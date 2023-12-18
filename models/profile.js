const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    middleName: {
        type: DataTypes.STRING
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING // Предполагается, что это ссылка на изображение
    },
    studentIdCard: {
        type: DataTypes.STRING
    },
    positionId: {
        type: DataTypes.INTEGER,
        allowNull: true // или false, в зависимости от вашей бизнес-логики
    }
});

// Модель для навыков
const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

// Модель для позиций
const Position = sequelize.define('Position', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

// Модель для уровня навыка пользователя
const SkillLevel = sequelize.define('SkillLevel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5 // или любой другой диапазон уровней, который вы используете
        }
    }
});

// Определяем связь "многие ко многим" между Profile (пользователь) и Skill (навык)


module.exports={
    Profile,
    Skill,
    SkillLevel,
    Position
}