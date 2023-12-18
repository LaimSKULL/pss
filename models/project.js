const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const {ProjectStatus} = require("../utils/enums");

const Project = sequelize.define('Project', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    briefDescription: {
        type: DataTypes.STRING
    },
    startDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ProjectStatus.PLANNING, // Значение по умолчанию
        validate: {
            isIn: {
                args: [
                    Object.values(ProjectStatus) // Проверка на соответствие доступным значениям перечисления
                ],
                msg: 'Invalid status' // Сообщение об ошибке, если статус не соответствует перечислению
            }
        }
    },
    max_user:{
        type:DataTypes.INTEGER,
        defaultValue:4,
        allowNull:true
    }
});
const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
const File = sequelize.define('File', {
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

const ProjectUser = sequelize.define('ProjectUser', {
    role: {
        type: DataTypes.ENUM('leader', 'member'),
        allowNull: false,
        defaultValue: 'member'
    },
    name:{
        type:DataTypes.STRING,
        allowNull:true
    }

});
module.exports={
    Project,
    Category,
    File,
    ProjectUser
}