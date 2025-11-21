// server/utils/generateToken.js

import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // The id payload is used to sign the token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiration
    });
};

export default generateToken;