const {User,Role,Permission,UserDevice} = require('./auth')
const {Profile, Skill,SkillLevel,Position} = require("./profile");
const {Project,Category, File, ProjectUser}=require("./project")
const Notification =require('./notification')
const Social =require('./social')
User.belongsToMany(Role, { through: 'UserRole' });
Role.belongsToMany(User, { through: 'UserRole' });

Role.belongsToMany(Permission, { through: 'RolePermission' });
Permission.belongsToMany(Role, { through: 'RolePermission' });

Profile.belongsToMany(Skill, { through: SkillLevel, foreignKey: 'profileId' });
Skill.belongsToMany(Profile, { through: SkillLevel, foreignKey: 'skillId' });

Profile.belongsTo(Position, { foreignKey: 'positionId' });
Position.hasMany(Profile, { foreignKey: 'positionId' });

User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Social, { foreignKey: 'userId' });
Social.belongsTo(User, { foreignKey: 'userId' });

Project.belongsTo(Category); // Проект принадлежит категории
Category.hasOne(Project); // Категория имеет один проект


Project.hasMany(File);
File.belongsTo(Project);

Project.belongsToMany(User, { through: ProjectUser, as: 'Leaders', foreignKey: 'projectId' });
User.belongsToMany(Project, { through: ProjectUser, as: 'LeadingProjects', foreignKey: 'userId' });


module.exports = {
    User,
    Role,
    Permission,
    UserDevice,
    Profile,
    Position,
    SkillLevel,
    Skill,
    Notification,
    Social,
    Category,
    File,
    Project,
};