require('dotenv').config();

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

const indexRoutes = require('./routes/index');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

connectDB();

// Handlebars là engine CHÍNH — dùng main.hbs làm layout mặc định
app.engine('hbs', engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// EJS đăng ký thêm cho các trang cụ thể (gọi res.render với đuôi .ejs)
app.engine('ejs', require('ejs').__express);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Routes
app.use('/', indexRoutes);
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
