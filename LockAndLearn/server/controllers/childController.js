const { createChild } = require("../childManager.js");
const express = require("express");
const router = express.Router();
// Handle user registration
router.post('/addchild', async (req, res) => {
    try {
        // Extract user data from the request body
        console.log(req.body);
        const { FirstName, LastName, Grade } = req.body;

        // Input validations
        if ((!FirstName || !LastName || !Grade)) {
            return res.status(400).json({ msg: "All fields must be filled." });
        }

        // Call the createUser function to create a new user
        const child = await createChild({
            FirstName,
            LastName,
            Grade,
        });

        // Respond with the newly created user
        res.status(201).json({ message: "Successfully added child" });
    } catch (error) {
        // Handle errors if createUser function fails
        console.error('Error adding child:', error);
        res.status(500).json({ error: 'Unable to add child' });
    }
});

module.exports = router;
