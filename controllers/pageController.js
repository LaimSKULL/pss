const {User, Role, Profile, Social, Permission, Project, Category} = require("../models");
const {toJSON} = require("lodash/seq");
const {ProjectUser} = require("../models/project");
const sequelize = require("../utils/db");


smart_text=[
    'Авторизация — это ключ к вашим данным. Как бы просто она ни выглядела, за ней скрывается сложная система защиты вашей информации.',
    'Авторизация — это ваш персональный ключ доступа к системе. Она подобна виртуальному замку, который обеспечивает безопасность вашей информации.',
    'Авторизация — это как уникальный ключ, который открывает доступ к вашему аккаунту. Она играет роль охранника, проверяющего вашу личность перед тем, как дать вам доступ к личным данным.'
]

exports.index = async (req, res) => {
    try {
        const projects = await Project.findAll({ include: { model: Category } });

        // Получаем массив id проектов
        const projectIds = projects.map(project => project.id);

        // Получаем количество пользователей для каждого проекта
        const usersPerProject = await ProjectUser.findAll({
            attributes: ['projectId', [sequelize.fn('COUNT', sequelize.col('projectId')), 'userCount']],
            where: { projectId: projectIds },
            group: ['projectId']
        });

        // Создаем объект для хранения количества пользователей по projectId
        const usersCountMap = {};
        usersPerProject.forEach(user => {
            usersCountMap[user.dataValues.projectId] = user.dataValues.userCount;
        });

        // Добавляем количество пользователей к каждому проекту
        const dataProjects = projects.map(project => {
            const projectData = project.toJSON();
            // Если есть количество пользователей для данного проекта, добавляем его
            if (usersCountMap[project.id]) {
                projectData.userCount = usersCountMap[project.id];
            } else {
                projectData.userCount = 0; // Установим ноль, если нет пользователей
            }
            return projectData;
        });

        console.log(dataProjects);

        // Передаем данные в шаблон при рендеринге страницы index
        return res.render('index', { title: "Главная страница", data: res.data, projects: dataProjects });
    } catch (error) {
        // Обработка ошибок, если есть
        console.error(error);
        return res.status(500).send("Ошибка при загрузке данных");
    }
}

exports.auth = (req,res) =>{
    res.render('auth',{smart_text:smart_text[Math.floor(Math.random()*smart_text.length)],layout: false});
}
exports.chat = (req,res) =>{
    res.render('chat');
}
exports.notifications = (req,res) =>{
    res.render('notifications');
}
exports.reg = (req,res)=>{
    res.render('reg',{layout: false})
}

exports.project = (req,res)=>{
    const data=res.data;
    res.render('project',{data: data})
}

exports.profile = async (req, res) => {
    const data=res.data;
    const currentUserID = res.data.user.id;
    const requestedUserID = Number(req.params.id);
    if (currentUserID === requestedUserID) {
        return res.render('profile', {data: data, data_profile: data})
    }else {
            const requestedUser = await User.findByPk(requestedUserID, {
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
            if(requestedUser){
                const user = requestedUser.toJSON()
                return res.render('profile',{data:data,data_profile:{user:user}})
            }
            else{
                return res.status(404).send('NOT FOUND')
            }

    }
}