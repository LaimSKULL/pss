const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Social = sequelize.define('Social', {
    Web: {
        type: DataTypes.STRING
    },
    GH: {
        type: DataTypes.STRING
    },
    TG: {
        type: DataTypes.STRING
    },
    VK: {
        type: DataTypes.STRING
    }
});

module.exports=Social