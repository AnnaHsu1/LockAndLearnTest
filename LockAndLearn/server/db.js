const MongoDBStore = require('connect-mongodb-session');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const router = express.Router();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Establish connection to MongoDB Atlas database
mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas.');
  })
  .catch((e) => console.log(e.message));

// Export the mongoose connection for use in other modules
module.exports = mongoose;

//Routing Logic for backend server

const secretKey = process.env.SESSION_SECRET; // Secret key for session stored in .env file
const environment = process.env.NODE_ENV || 'development';

const app = express();

const mongoStore = MongoDBStore(session);

const store = new mongoStore({
  collection: 'userSessions',
  uri: process.env.DB_STRING,
  expires: 3600000,
});

app.set('trust proxy', 1);

app.use(
  cors({
    origin: 'https://localhost:19006',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: secretKey,
    store: store,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    //cookie: { maxAge: 3600000 }, // 1 hour session expiration
    cookie: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
    },
  })
);

const port = 4000;
app.set('port', port);

const userRoutes = require('./controllers/userController');

app.use('/users', userRoutes);
app.use('/files', require('./controllers/filesController'));
app.use('/quizzes', require('./quizController'));
app.use('/child', require('./controllers/childController'));
app.use('/workPackages', require('./controllers/workPackageController'))
app.use('/packages', require('./controllers/packageController'))
app.use('/subcategories', require('./controllers/subcategoriesController'))
app.use('/payment', require('./controllers/paymentController'))

app.listen(port, () => console.log('Backend server listening on port 4000.'));
