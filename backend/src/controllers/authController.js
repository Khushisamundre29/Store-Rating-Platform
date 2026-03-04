const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtHelper');

// Validate password rules: 8-16 chars, 1 uppercase, 1 special character
const validatePassword = (password) => {
    if (!password || password.length < 8 || password.length > 16)
        return 'Password must be 8–16 characters.';
    if (!/[A-Z]/.test(password))
        return 'Password must contain at least one uppercase letter.';
    if (!/[^a-zA-Z0-9]/.test(password))
        return 'Password must contain at least one special character.';
    return null;
};

// Register a new user (Normal User role by default)
exports.registerUser = async (req, res) => {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Name validation: 20–60 characters
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
    }

    // Address validation: max 400 characters
    if (address.length > 400) {
        return res.status(400).json({ message: 'Address must not exceed 400 characters.' });
    }

    // Password validation
    const pwError = validatePassword(password);
    if (pwError) return res.status(400).json({ message: pwError });

    try {
        const [userExists] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Always store roles as UPPERCASE for consistency
        await db.query(
            'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, address, hashedPassword, 'USER']
        );

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Authenticate user & get token
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Normalize role to UPPERCASE before putting it in the token and response
        const normalizedRole = user.role.toUpperCase();
        const token = generateToken(user.id, normalizedRole);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: normalizedRole,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Change password for any logged-in user (called via PUT /api/auth/password)
// Frontend sends: { currentPassword, newPassword }
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new passwords.' });
    }

    const pwError = validatePassword(newPassword);
    if (pwError) return res.status(400).json({ message: pwError });

    try {
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating password.' });
    }
};