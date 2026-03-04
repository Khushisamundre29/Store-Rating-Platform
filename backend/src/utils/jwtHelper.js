const jwt = require('jsonwebtoken');

exports.generateToken = (id, role) => {
  return jwt.sign(
    {
      user: {
        id,
        role,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

