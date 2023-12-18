const { Roles, Permissions, Role_Permission} = require("./utils/enums");
const { Role, Permission, User, UserDevice,Profile,Skill,SkillLevel,Position} = require("./models");
const sequelize = require("./utils/db");
exports.recreateTable = function () {
    sequelize.sync({force: true})
        .then(async () => {
            console.log('Таблицы созданы');

            // Создание ролей в таблице Role
            await Promise.all(
                Object.values(Roles).map(roleName => {
                    return Role.create({name: roleName});
                })
            );

            // Создание разрешений в таблице Permission
            await Promise.all(
                Object.values(Permissions).flatMap(permission => Object.values(permission)).map(permissionName => {
                    return Permission.create({name: permissionName});
                })
            );

            // Связывание ролей и разрешений в таблице Role_Permission
            await Promise.all(
                Object.entries(Role_Permission).flatMap(([roleName, permissions]) => {
                    return Promise.all(
                        permissions.map(permissionName => {
                            return Role.findOne({where: {name: roleName}})
                                .then(role => {
                                    return Permission.findOne({where: {name: permissionName}})
                                        .then(permission => {
                                            return role.addPermission(permission);
                                        });
                                });
                        })
                    );
                })
            );
            const admin = await User.create({
                email:process.env.ADMIN_EMAIL,
                hash_password:process.env.ADMIN_PASSWORD,
                phone:null

            })
            const profile= await Profile.create({
                firstName:process.env.ADMIN_EMAIL});
            if(profile){
                profile.setUser(admin);
            }
            const role = await Role.findOne({ where: { name: Roles.Admin } });
            if (role) {
                await admin.addRole(role);
            }
            await Position.bulkCreate([
                { name: 'Ведущий научный сотрудник', abbreviation: 'внс' },
                { name: 'Главный научный сотрудник', abbreviation: 'гнс' },
                { name: 'Докторант', abbreviation: 'докторант' },
                { name: 'Доцент', abbreviation: 'доц.' },
                { name: 'Младший научный сотрудник', abbreviation: 'мнс' },
                { name: 'Научный сотрудник', abbreviation: 'нс' },
                { name: 'Преподаватель', abbreviation: 'преп.' },
                { name: 'Профессор', abbreviation: 'проф.' },
                { name: 'Старший научный сотрудник', abbreviation: 'снс' },
                { name: 'Старший преподаватель', abbreviation: 'ст.преп.' },
                { name: 'Стажер', abbreviation: 'стажер' }
            ]);
            console.log('Данные успешно добавлены.');
            sequelize.query(`
  CREATE OR REPLACE FUNCTION delete_expired_tokens() RETURNS TRIGGER AS $$
  BEGIN
    DELETE FROM "UserDevices"
    WHERE "jwtRefreshTokenExpiration" < NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER delete_expired_tokens_trigger
  BEFORE INSERT OR UPDATE OF "jwtRefreshTokenExpiration" ON "UserDevices"
  FOR EACH ROW EXECUTE FUNCTION delete_expired_tokens();
`)
                .then(() => {
                    console.log('Триггер успешно создан');
                })
                .catch((error) => {
                    console.error('Ошибка создания триггера:', error);
                });

        })
        .catch((error) => {
            console.error('Ошибка синхронизации:', error);
        });

}