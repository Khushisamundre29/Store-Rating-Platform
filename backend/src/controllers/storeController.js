const db = require('../config/db');

// Admin creates a new store
exports.createStoreByAdmin = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
        return res.status(400).json({ message: 'Please provide name, email, and address for the store' });
    }

    // Name validation: 20–60 characters
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Store name must be between 20 and 60 characters.' });
    }

    // Address validation: max 400 characters
    if (address.length > 400) {
        return res.status(400).json({ message: 'Address must not exceed 400 characters.' });
    }

    try {
        if (owner_id) {
            const [users] = await db.query('SELECT role FROM users WHERE id = ?', [owner_id]);
            if (users.length === 0 || users[0].role.toUpperCase() !== 'STORE_OWNER') {
                return res.status(400).json({ message: 'Invalid owner ID or the user is not a Store Owner' });
            }
        }

        await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id || null]
        );

        res.status(201).json({ message: 'Store created successfully' });

    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'A store with this email already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating store' });
    }
};

// Admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount]   = await db.query('SELECT COUNT(*) as total FROM users');
        const [storeCount]  = await db.query('SELECT COUNT(*) as total FROM stores');
        const [ratingCount] = await db.query('SELECT COUNT(*) as total FROM ratings');

        res.json({
            totalUsers:   userCount[0].total,
            totalStores:  storeCount[0].total,
            totalRatings: ratingCount[0].total,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching dashboard stats' });
    }
};

// Get all stores — accessible by any logged-in user (USER, ADMIN, STORE_OWNER)
// For USER: includes their own submitted rating per store
// For ADMIN: userSubmittedRating will be null (they don't rate stores)
exports.getAllStores = async (req, res) => {
    const { name, address } = req.query;
    const userId = req.user.id;

    try {
        let sql = `
            SELECT 
                s.id,
                s.name,
                s.email,
                s.address,
                AVG(r.rating) AS overallRating,
                (
                    SELECT rating 
                    FROM ratings 
                    WHERE user_id = ? AND store_id = s.id
                ) AS userSubmittedRating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;

        const params = [userId];

        if (name) {
            sql += ' AND s.name LIKE ?';
            params.push(`%${name}%`);
        }
        if (address) {
            sql += ' AND s.address LIKE ?';
            params.push(`%${address}%`);
        }

        sql += ' GROUP BY s.id ORDER BY s.name ASC';

        const [stores] = await db.query(sql, params);

        res.json(stores.map(store => ({
            ...store,
            overallRating: store.overallRating
                ? Number(store.overallRating).toFixed(2)
                : null,
            userSubmittedRating: store.userSubmittedRating ?? null,
        })));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching stores' });
    }
};

// User submits or updates a rating for a store (1–5)
exports.submitOrUpdateRating = async (req, res) => {
    const { storeId } = req.params;
    const { rating }  = req.body;
    const userId      = req.user.id;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
        return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5' });
    }

    try {
        await db.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = ?, updated_at = CURRENT_TIMESTAMP`,
            [userId, storeId, numRating, numRating]
        );

        res.status(200).json({ message: 'Rating submitted successfully' });

    } catch (error) {
        console.error(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ message: 'Store not found.' });
        }
        res.status(500).json({ message: 'Server error while submitting rating' });
    }
};

// Store owner gets their store's dashboard data
exports.getStoreOwnerDashboard = async (req, res) => {
    const ownerId = req.user.id;

    try {
        const [stores] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);

        if (stores.length === 0) {
            return res.status(404).json({ message: "You don't have a store assigned to you." });
        }

        const storeId = stores[0].id;

        const [avgResult] = await db.query(
            'SELECT AVG(rating) as averageRating FROM ratings WHERE store_id = ?',
            [storeId]
        );

        const [raters] = await db.query(
            `SELECT u.name, u.email, r.rating, r.updated_at 
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = ?
             ORDER BY r.updated_at DESC`,
            [storeId]
        );

        res.json({
            averageRating: avgResult[0].averageRating
                ? parseFloat(avgResult[0].averageRating).toFixed(2)
                : null,
            raters,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching store dashboard' });
    }
};