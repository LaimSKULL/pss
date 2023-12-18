    const { createToken, verifyToken, verifyRefreshToken } = require('../utils/jwt');
    const setCookies = require("../utils/cookie");
    const {User, Permission, Role, Profile, UserDevice, Social} = require("../models");
    async function checkPermissionUser(permissions, userId) {
        try {
            const userRoles = await User.findByPk(userId, {
                include: [
                    {
                        model: Role,
                        include: [{ model: Permission, attributes: ['name'] }]
                    },
                    {
                        model: Profile
                    },
                    {
                        model: Social
                    }
                ]
            });

            if (!userRoles) {
                if(permissions){
                    return 'close';
                }

            }
            else {
                const user = userRoles.toJSON()
                const userPermissions = userRoles.Roles.flatMap(role => role.Permissions.map(permission => permission.name));
                for (let perm in permissions) {
                    if (userPermissions.includes(permissions[perm])) {
                        return {permission: permissions[perm], user: user};
                    }
                }
                if (permissions === undefined) {
                    return {user: user};
                }
            }
            return null;

        } catch (error) {
            console.error('Ошибка при проверке разрешений пользователя:', error);
            return null;
        }
    }

    function verify_user(permission = undefined) {
        return async function (req, res, next) {
            let token = req.cookies.token || null;
            const refreshToken = req.cookies.refreshToken || null;

            if (!token) {
                if (!refreshToken) {
                    if (permission === undefined) {
                        return next();
                    }
                    return res.status(403).send('Отказано в доступе');
                } else {
                    const refreshTokenValid = verifyRefreshToken(refreshToken);
                    if (!refreshTokenValid) {
                        return res.status(403).send('Отказано в доступе');
                    }

                    // Проверка токена
                    const token = createToken({userId:refreshTokenValid.userId});
                    setCookies(res,token,refreshToken);
                    res.data={};
                    res.data.permission=await checkPermissionUser(permission, verifyToken(token).userId)
                    return next();
                }
            } else {
                // Если есть токен, можно его проверить
                let tokenValid = verifyToken(token);
                if (!tokenValid) {
                    const refreshTokenValid = verifyRefreshToken(refreshToken);
                    if (!refreshTokenValid) {
                        return res.status(403).send('Отказано в доступе');
                    }

                    // Обновление токена
                    token = createToken({userId:refreshTokenValid.userId});
                    setCookies(res,token,refreshToken);
                    tokenValid = verifyToken(token);
                }
                res.data={};
                res.data = await checkPermissionUser(permission, tokenValid.userId)
                if (res.data==='close'){
                    return res.status(403).send('Отказано в доступе')
                }
                else if (res.data!==null)
                {
                    const dbToken = await UserDevice.findOne({
                        where: {
                            jwtRefreshToken: refreshToken
                        }
                    });
                    if (!dbToken){
                        return res.status(403).send('Отказано в доступе')
                    }
                    if (dbToken.ban){
                        return res.status(403).send('Отказано в доступе')
                    }
                }

                return next();
            }
        };
    }

    module.exports = {verify_user,checkPermissionUser};
