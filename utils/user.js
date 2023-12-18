// Функция для получения пользователя с его ролями, разрешениями и профилем
async function getUserWithRolesPermissionsAndProfile(userId) {
    try {
        const user = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: Permission,
                            attributes: ['id', 'name'],
                            through: { attributes: [] }
                        }
                    ]
                },
                { model: Profile }
            ]
        });

        return user;
    } catch (error) {
        throw new Error(`Ошибка при получении пользователя: ${error.message}`);
    }
}
module.exports=getUserWithRolesPermissionsAndProfile()