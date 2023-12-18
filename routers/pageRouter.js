const express = require('express');
const pageController = require('../controllers/pageController');
const profileController = require("../controllers/profileController");
const {verify_user} = require("../middlewares/verify");
const {Permissions} = require("../utils/enums");

const router = express.Router();
router.get('',verify_user(),pageController.index);
router.get('/auth',pageController.auth);
router.get('/chat', verify_user(), pageController.chat);
router.get('/notifications', verify_user(), pageController.notifications);
router.get('/register',pageController.reg);
router.get('/profile/:id', verify_user([Permissions.profile.view]), pageController.profile)
router.get('/project/:id', verify_user([Permissions.project.view]), pageController.project)
module.exports = router;
