const mongoose = require('mongoose');
const User = require('./userSchema.js');


const Teacher = User.discriminator('Teacher', new mongoose.Schema({
    // Fields for parent information
    // ...
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child', // Reference to the Child model
    }],
}),);


module.exports = Teacher;