require('dotenv').config();
require('./connection')

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // Help defend against common web app security vulnerabilities, such as XSS attacks
const hpp = require('hpp'); // This protects against HTTP Parameter Pollution attacks
const logger = require('morgan');

const usersRouter = require('./routes/users.routes');
const newsRouter = require('./routes/news.routes');
const categoriesRouter = require('./routes/categories.routes');
const subjectsRouter = require('./routes/subjects.routes');
const picturesRouter = require('./routes/pictures.routes');
const weatherRouter = require('./routes/weather.routes');
const galleryRouter = require('./routes/gallery.routes');
const answersRouter = require('./routes/answers.routes');

const app = express();

const cors = require('cors');
app.use(cors());
app.use(helmet());
app.use(hpp());

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/news', newsRouter);
app.use('/categories', categoriesRouter);
app.use('/subjects', subjectsRouter);
app.use('/pictures', picturesRouter);
app.use('/weather', weatherRouter);
app.use('/gallery', galleryRouter);
app.use('/answers', answersRouter);


module.exports = app;
