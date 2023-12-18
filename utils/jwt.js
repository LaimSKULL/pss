const jwt = require('jsonwebtoken');

// Функция для создания токена
function createToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: process.env.TIME_JWT});
}

// Функция для создания refresh-токена
function createRefreshToken(data) {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.TIME_JWT_REFRESH});
}

// Функция для верификации токена
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Функция для верификации refresh-токена
function verifyRefreshToken(refreshToken) {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = {
    createToken,
    createRefreshToken,
    verifyToken,
    verifyRefreshToken
};
