const express = require('express');
const projectController = require('../controllers/projectController');
const {verify_user} = require("../middlewares/verify");
const {Permissions} = require("../utils/enums");
const router = express.Router();
router.post('/create',verify_user([Permissions.project.create]),projectController.create)
module.exports = router;
