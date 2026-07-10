const jwt = require('jsonwebtoken');

// Verifies JWT and attaches req.user = { id, role } (role is always UPPERCASE)
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Normalize role to uppercase so all downstream checks are consistent
            req.user = {
                id:   decoded.user.id,
                role: decoded.user.role?.toUpperCase(),
            };

            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};

// Only allows ADMIN role
const isAdmin = (req, res, next) => {
    if (req.user?.role === 'ADMIN') return next();
    return res.status(403).json({ message: 'Access denied: Admins only' });
};

// Only allows STORE_OWNER role
const isStoreOwner = (req, res, next) => {
    if (req.user?.role === 'STORE_OWNER') return next();
    return res.status(403).json({ message: 'Access denied: Store Owners only' });
};

// Only allows USER role (used for actions like submitting ratings)
const isUser = (req, res, next) => {
    if (req.user?.role === 'USER') return next();
    return res.status(403).json({ message: 'Access denied: Users only' });
};

module.exports = { protect, isAdmin, isStoreOwner, isUser };