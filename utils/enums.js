const Roles = {
    Student: "Student",
    Admin: "Admin",
    Teacher: "Teacher"
};

const Permissions = {
    auth: {
        resetPassword: "auth.resetPassword",
        getMe:"auth.getMe"
    },
    profile: {
        editSelf: "profile.editSelf",
        edit: "profile.edit",
        view:"profile.view"
    },
    project:{
        create: "project.create",
        view: "project.view",
        editSelf:"project.editSelf",
        edit:"project.edit"
    },
    messager:{
        access:"messager.access"
    }
};

const Role_Permission = {
    [Roles.Student]: [
        Permissions.auth.resetPassword,
        Permissions.profile.editSelf,
        Permissions.auth.getMe,
        Permissions.profile.view,
        Permissions.project.create,
        Permissions.project.view,
        Permissions.project.editSelf,
        Permissions.messager.access
    ],
    [Roles.Admin]: [
        Permissions.profile.edit,
        Permissions.project.edit,
    ],
    [Roles.Teacher]: [
    ]
};
const ProjectStatus = {
    PLANNING: 'Планирование',
    IN_PROGRESS: 'В процессе',
    COMPLETED: 'Завершен',
    ON_HOLD: 'На паузе',
    CANCELED: 'Отменен'
};
Role_Permission[Roles.Admin] = Role_Permission[Roles.Admin].concat(Role_Permission[Roles.Student]);
Role_Permission[Roles.Teacher] = Role_Permission[Roles.Teacher].concat(Role_Permission[Roles.Student]);
module.exports = { Roles, Permissions, Role_Permission,ProjectStatus };
