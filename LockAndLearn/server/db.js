const mongoose = require("mongoose");
const express = require("express");
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
    console.log("Connected to MongoDB Atlas.");
  })
  .catch((e) => console.log(e.message));

// Export the mongoose connection for use in other modules
module.exports = mongoose;  


//Routing Logic for backend server
const app = express();
app.use(cors());

const port = 4000;
app.set('port', port);
app.use(express.json());

const userRoutes = require('./userController');

app.use('/users', userRoutes);
app.use('/files', require("./controllers/filesController"))

app.listen(port, () => console.log("Backend server listening on port 4000."));