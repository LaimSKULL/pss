const express = require('express');
const bodyParser = require('body-parser');
const hbs = require("hbs");
const {recreateTable}=require("./sync");
const cookieParser = require('cookie-parser');
const exphbs  = require('express-handlebars');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
if(process.env.DB_CREATE==='1'){
    recreateTable()
}
// Подключение bodyParser для обработки JSON и URL-encoded данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка шаблонизатора Handlebars
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'base', // Имя основного макета
    layoutsDir: __dirname + '/views/layouts/', // Путь к папке с макетами
    partialsDir: __dirname + '/views/partials/', // Путь к папке с частичными представлениями
    helpers: {
        formatDate: function () {
            return new Date().toISOString().split('T')[0];
        },
    },
}));
app.set('view engine', 'hbs');

// Подключение каталогов для статических ресурсов
app.use('/css', express.static('./public/css'));
app.use('/js', express.static('./public/js'));
app.use(express.static('./public'));

// Использование cookieParser для обработки куков
app.use(cookieParser());

// Подключение маршрутизаторов
const authRouter = require('./routers/authRouter');
const pageRouter = require('./routers/pageRouter');
const profileRouter = require('./routers/profileRouter');
const projectRouter = require('./routers/projectRouter');

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/project', projectRouter);
app.use('', pageRouter);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
