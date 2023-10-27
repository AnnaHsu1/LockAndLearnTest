const mongoose = require('mongoose');
const User = require('./userSchema.js');
const Child = require('./childSchema.js')


const Parent = User.discriminator('Parent', new mongoose.Schema({
    // Fields for parent information
    // ...
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child', // Reference to the Child model
    }],
}),);


module.exports = Parent;