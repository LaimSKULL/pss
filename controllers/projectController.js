const { Project } = require("../models");
const {ProjectUser} = require("../models/project");

exports.create = async (req, res) => {
    try {
        const { name, description, briefDescription, startDate, endDate } = req.body;

        if (!name || !startDate) {
            return res.status(400).json({ message: "Отсутствуют обязательные поля для создания проекта" });
        }

        // Формируем объект с данными для создания проекта,
        // игнорируя пустые строки ('') и присваивая null полям с пустыми значениями
        const projectData = {
            name: name.trim(),
            description: description ? description.trim() : null,
            briefDescription: briefDescription ? briefDescription.trim() : null,
            startDate,
            endDate: endDate ? endDate.trim() : null
        };

        // Создаем проект с заполненными данными
        const createdProject = await Project.create(projectData);
        const createProjectUser=await ProjectUser.create({projectId:createdProject.id,userId:res.data.user.id,role:'leader'})
        // Отправляем ответ клиенту после успешного создания проекта
        return res.redirect('/project/'+createdProject.id)
    } catch (error) {
        // Обработка ошибок при создании проекта
        console.error("Ошибка при создании проекта:", error);
        return res.status(500).json({ message: "Ошибка при создании проекта" });
    }
};
