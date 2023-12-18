const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User, Role, UserDevice, Profile,Notification, Social} = require("../models");
const {Roles} = require("../utils/enums");
const setCookies = require("../utils/cookie");

function validatePassword(password) {
    const missingCriteria = [];

    // Минимальная длина пароля - 8 символов
    if (password.length < 8) {
        missingCriteria.push('длина не менее 8 символов');
    }

    // Проверка наличия букв верхнего и нижнего регистра
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;

    if (!upperCaseRegex.test(password)) {
        missingCriteria.push('буквы верхнего регистра');
    }

    if (!lowerCaseRegex.test(password)) {
        missingCriteria.push('буквы нижнего регистра');
    }

    // Проверка наличия цифр
    const digitRegex = /[0-9]/;
    if (!digitRegex.test(password)) {
        missingCriteria.push('цифры');
    }

    // Проверка наличия специальных символов
    const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    if (!specialCharacterRegex.test(password)) {
        missingCriteria.push('специальных символов');
    }

    return missingCriteria;
}

exports.registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, middleName } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ status: 'Error', message: 'Пользователь с таким email уже зарегистрирован' });
        }
        const missingCriteria = validatePassword(password);

        if (missingCriteria.length > 0) {
            const errorMessage = `Пароль не соответствует следующим требованиям: ${missingCriteria.join(', ')}`;
            return res.status(400).json({ status: 'Error', message: errorMessage });
        }
        const newUser = await User.create({
            email,
            hash_password: password // Предполагается, что поле в модели User называется hash_password
        });

        const newProfile = await Profile.create({
            firstName,
            lastName,
            middleName,
            userId: newUser.id // Привязываем профиль пользователя к его учетной записи (User)
        });
        const newSocial =await Social.create({
            userId:newUser.id
        });
        const role = await Role.findOne({where: {name: Roles.Student}});
        if (role) {
            await newUser.addRole(role);
        }

        res.status(201).json({
            status: 'Ok',
            message: 'Пользователь успешно зарегистрирован',
            user: {
                id: newUser.id,
                email: newUser.email,
                profile: {
                    id: newProfile.id,
                    firstName: newProfile.firstName,
                    lastName: newProfile.lastName,
                    middleName: newProfile.middleName,
                    // Добавьте другие поля профиля, если они есть в модели Profile
                }
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: 'Ошибка при регистрации пользователя' });
        console.log(err);
    }
};
exports.authUser = async (req,res) => {
    try {
        const { email, password , deviceInfo} = req.body;
        deviceInfo.ip = req.connection.remoteAddress;
        const user = await User.findOne({ where: { email },include: Role});
        if (!user) {
            return res.status(401).json({ status: 'Error', message: 'Неверный email или пароль' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.hash_password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'Error', message: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn:  process.env.TIME_JWT  });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn:  process.env.TIME_JWT_REFRESH });

        const userDevice = await UserDevice.create({
            userId: user.id,
            deviceInfo: deviceInfo,
            jwtRefreshToken: refreshToken,
            jwtRefreshTokenExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Установка срока действия токена обновления
            ban: false // По умолчанию устройство не заблокировано
        });
        setCookies(res,token,refreshToken);
        res.status(201).json({
            status: 'Ok',
            message: 'Пользователь успешно авторизирован',
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                roles: user.Roles.map(role => role.name)
            },
            token,
            refreshToken});
    } catch (err) {
        res.status(500).json({ status: 'Error', message: 'Ошибка при аутентификации пользователя' });
        console.error(err);
    }
}
exports.logOut=async (req,res)=>{
    const cookies = req.cookies;

    for (const cookie in cookies) {
        res.cookie(cookie, '', { expires: new Date(0) });
    }
    res.redirect('/')
    return res.status(200);
}
exports.getMe = async (req, res) => {
    try {
        const data = res.data;
        const notify = await Notification.findAndCountAll({
            where: { userId: data.user.id,isRead:false }
        });

        const count = notify.count;
        return res.json({ status: 'Ok', notifyCount: count });
    } catch (error) {
        console.error('Ошибка при получении количества уведомлений:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};

