const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const bcrypt = require('bcryptjs');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    hash_password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.hash_password) {
                const salt = await bcrypt.genSalt(10);
                user.hash_password = await bcrypt.hash(user.hash_password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.hash_password) {
                const salt = await bcrypt.genSalt(10);
                user.hash_password = await bcrypt.hash(user.hash_password, salt);
            }
        }
    }
});

const Role = sequelize.define('Role', {
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
}, {
    timestamps: false
});

const Permission = sequelize.define('Permission', {
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
}, {
    timestamps: false
});

const UserDevice = sequelize.define('UserDevice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deviceInfo: {
        type: DataTypes.JSONB
    },
    jwtRefreshToken: {
        type: DataTypes.TEXT
    },
    jwtRefreshTokenExpiration: {
        type: DataTypes.DATE
    },
    ban: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports={
    User,
    Role,
    Permission,
    UserDevice
}