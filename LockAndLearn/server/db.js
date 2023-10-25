const mongoose = require("mongoose");
const express = require("express");
const session = require('express-session');
const router = express.Router();
const cors = require('cors');
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

const secretKey = process.env.SESSION_SECRET // Secret key for session stored in .env file

const app = express();
app.use(cors({
    origin: 'http://localhost:19006', // Replace with your frontend origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }, // 1 hour session expiration
}));

const port = 4000;
app.set('port', port);

const userRoutes = require('./userController');

app.use('/users', userRoutes);
app.use('/files', require("./controllers/filesController"))

app.listen(port, () => console.log('Backend server listening on port 4000.'));
