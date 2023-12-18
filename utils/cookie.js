function setCookies(res, token, refreshToken) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Для HTTPS
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Для HTTPS
    });
}
module.exports=setCookies