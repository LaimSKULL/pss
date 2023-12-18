const express = require('express');
const authController = require('../controllers/authController');
const {verify_user} = require("../middlewares/verify");
const {Permissions} = require("../utils/enums");
const router = express.Router();

// Регистрация пользователя
router.post('/register', authController.registerUser);

// Аутентификация пользователя
router.post('/login', authController.authUser);
router.get('/logOut',authController.logOut);
// GetMe
router.get('/getMe', verify_user([Permissions.auth.getMe]), authController.getMe);
module.exports = router;
