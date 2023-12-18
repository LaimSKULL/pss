const express = require('express');
const profileController = require('../controllers/profileController');
const {verify_user} = require("../middlewares/verify");
const {Permissions} = require("../utils/enums");
const router = express.Router();
router.post('/:id/saveData',verify_user([Permissions.profile.edit,Permissions.profile.editSelf]),profileController.saveDate)
module.exports = router;
