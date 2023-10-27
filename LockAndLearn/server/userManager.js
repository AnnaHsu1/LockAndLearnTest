//const User = require('./schema/userSchema.js'); // Import the User model from UserSchema.js
const User = require('./schema/userSchema.js');
//const Parent = require('./schema/parentSchema.js');
//const Teacher = require('./schema/teacherSchema.js');


// Function to create a user within DB
exports.createUser = async function createUser(fdata) {
    try {
      // Extract the relevant data from fdata
        const { FirstName, LastName, isParent, Email, passwordHash, DOB } = fdata;

        if (isParent) {
            // If user is a parent, create a parent instance and link it to the user
            const parent = new Parent({
                firstName: FirstName,
                lastName: LastName,
                isParent: isParent,
                email: Email,
                password: passwordHash,
                birthDate: DOB, // Need to Convert DOB to a Date object
                children: null,
            });
            //Save parent data to the user
            parent.save();
            return parent;
        } else {
            // If user is a teacher, create a teacher instance (if needed)
            const teacher = new Teacher({
                // Teacher-specific fields can be added here
                firstName: FirstName,
                lastName: LastName,
                isParent: isParent,
                email: Email,
                password: passwordHash,
                birthDate: DOB, // Need to Convert DOB to a Date object
            });

            teacher.save()
            return teacher;

            // Save teacher data to the user
            // Example: newUser.teacher = teacher;
        }

    } catch (error) {
        
      // Log the error and throw an exception
      console.error("Error creating user:", error);

      throw error;
    }
};

// Function to find a user by email and password for login
exports.findUserByEmailAndPassword = async function findUserByEmailAndPassword(email, password) {
    try {
        // Find the user in the database by email and password
        const user = await User.findOne({ email: email, password: password });

        // If user is found, return the user object; otherwise, return null
        return user;
    } catch (error) {
        // Log the error and throw an exception
        console.error("Error finding user:", error);
        throw error;
    }
};

// Function to find a user by email and password for login
exports.getUserByEmail = async function getUserByEmail(email) {
    try {
        // Find the user in the database by email and password
        const user = await User.findOne({ email: email });

        // If user is found, return the user object; otherwise, return null
        return user;
    } catch (error) {
        // Log the error and throw an exception
        console.error("Error finding user:", error);
        throw error;
    }
};
