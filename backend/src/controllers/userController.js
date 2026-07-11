const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Admin creates a new user (can be ADMIN, USER, or STORE_OWNER)
exports.createUserByAdmin = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({ message: 'Please provide all required fields: name, email, password, address, and role' });
    }

   // Name validation: 2–100 characters
if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Name must be between 2 and 100 characters.' });
}

    // Address validation: max 400 characters
    if (address.length > 400) {
        return res.status(400).json({ message: 'Address must not exceed 400 characters.' });
    }

    // Password validation: 8–16 chars, 1 uppercase, 1 special
    if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ message: 'Password must be 8–16 characters.' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one special character.' });
    }

    const normalizedRole = role.toUpperCase();
    if (!['ADMIN', 'USER', 'STORE_OWNER'].includes(normalizedRole)) {
        return res.status(400).json({ message: 'Invalid role. Must be ADMIN, USER, or STORE_OWNER.' });
    }

    try {
        const [userExists] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, normalizedRole]
        );

        res.status(201).json({ message: `User with role ${normalizedRole} created successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
};

// Admin gets all users with filtering
// Supports query params: name, email, address, role
exports.getAllUsersByAdmin = async (req, res) => {
    const { name, email, address, role } = req.query;

    let sql = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];

    if (name) { sql += ' AND name LIKE ?'; params.push(`%${name}%`); }
    if (email) { sql += ' AND email LIKE ?'; params.push(`%${email}%`); }
    if (address) { sql += ' AND address LIKE ?'; params.push(`%${address}%`); }
    if (role) {
        // Allow case-insensitive role filter
        sql += ' AND UPPER(role) = ?';
        params.push(role.toUpperCase());
    }

    sql += ' ORDER BY name ASC';

    try {
        const [users] = await db.query(sql, params);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

// Admin gets a single user's details
// If the user is a STORE_OWNER, also returns their store's average rating
exports.getUserByIdByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await db.query(
            'SELECT id, name, email, address, role FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // If store owner, fetch their store's average rating
        if (user.role.toUpperCase() === 'STORE_OWNER') {
            const [storeData] = await db.query(
                `SELECT s.name AS storeName, AVG(r.rating) AS averageRating
                 FROM stores s
                 LEFT JOIN ratings r ON s.id = r.store_id
                 WHERE s.owner_id = ?
                 GROUP BY s.id`,
                [id]
            );
            if (storeData.length > 0) {
                user.storeName = storeData[0].storeName;
                user.averageRating = storeData[0].averageRating
                    ? parseFloat(storeData[0].averageRating).toFixed(2)
                    : 'N/A';
            }
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching user details' });
    }
};

// Admin updates an existing user's name, email, address, and/or role.
// Password is intentionally not editable here — that flow belongs to the
// user's own "change password" action, not an admin overwrite.
exports.updateUserByAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    if (!name || !email || !address || !role) {
        return res.status(400).json({ message: 'Please provide name, email, address, and role.' });
    }
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
    }
    if (address.length > 400) {
        return res.status(400).json({ message: 'Address must not exceed 400 characters.' });
    }
    const normalizedRole = role.toUpperCase();
    if (!['ADMIN', 'USER', 'STORE_OWNER'].includes(normalizedRole)) {
        return res.status(400).json({ message: 'Invalid role. Must be ADMIN, USER, or STORE_OWNER.' });
    }

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const [emailTaken] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
        if (emailTaken.length > 0) {
            return res.status(400).json({ message: 'Another user with this email already exists.' });
        }

        await db.query(
            'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?',
            [name, email, address, normalizedRole, id]
        );

        res.json({ message: 'User updated successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};

// Admin deletes a user. Blocked if the user owns a store, so a store is
// never left pointing at a non-existent owner.
exports.deleteUserByAdmin = async (req, res) => {
    const { id } = req.params;

    if (String(req.user.id) === String(id)) {
        return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const [ownedStores] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [id]);
        if (ownedStores.length > 0) {
            return res.status(400).json({ message: 'This user owns a store. Reassign or delete the store first.' });
        }

        await db.query('DELETE FROM ratings WHERE user_id = ?', [id]);
        await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.json({ message: 'User deleted successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};