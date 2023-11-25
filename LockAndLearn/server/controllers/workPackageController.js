const express = require('express');
const router = express.Router();
const WorkPackage = require('../schema/workPackageSchema.js');

// Create a new work package
router.post('/create', async (req, res) => {
  try {
    // Get the data for the new work package from the request body
    const { name, workPackageId, materials, quizzes, tags, grade, subcategory, instructorID } =
      req.body;

    // Create a new work package document using the WorkPackage model
    const newWorkPackage = new WorkPackage({
      name,
      workPackageId,
      materials,
      quizzes,
      tags,
      grade,
      subcategory,
      instructorID,
    });

    // Save the new work package to the database
    const savedWorkPackage = await newWorkPackage.save();

    // Send a success response with the created work package
    res.status(201).json(savedWorkPackage);
    console.log('Created');
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating work package:', error);
    res.status(500).json({ error: 'An error occurred while creating the work package.' });
  }
});

// Fetch all work packages
router.get('/fetchWorkpackages/:id', async (req, res) => {
  const instructorID = req.params.id;
  try {
    // Retrieve all work packages from the database
    const allWorkPackages = await WorkPackage.find({ instructorID: instructorID });
    // Send a success response with the array of work packages
    res.status(200).json(allWorkPackages);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error fetching all work packages:', error);
    res.status(500).json({ error: 'An error occurred while fetching all work packages.' });
  }
});

// Delete a specific work package by ID
router.delete('/delete/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    // Use Mongoose's findByIdAndRemove to delete the work package by its ID
    const deletedWorkPackage = await WorkPackage.findByIdAndRemove(workPackageId);
    if (!deletedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(deletedWorkPackage);
  } catch (error) {
    console.error('Error deleting work package:', error);
    res.status(500).json({ error: 'An error occurred while deleting the work package.' });
  }
});

// Add a quiz to a work package
router.post('/addquiz/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const quizId = req.body.quizId;

    // Use Mongoose to find and update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $push: { quizzes: quizId } }, // Add the quizId to the "quizzes" array
      { new: true } // Return the updated work package
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error adding quiz to work package:', error);
    res.status(500).json({ error: 'An error occurred while adding the quiz to the work package.' });
  }
});

router.post('/editWorkPackage/:workPackageId', async (req, res) => {
  try{
    const workPackageId = req.params.workPackageId;
    const {description, price} = req.body;
    const editedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      {
        description: description,
        price: price
      }
    );
    if (!editedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(editedWorkPackage);
  } catch (error) {
    console.error('Error editing work package:', error);
    res.status(500).json({ error: 'An error occurred while editing the work package.' });
  }
})

// Add quizzes to a specific work package by ID
router.post('/addQuizzes/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const quizzes = req.body.quizzes;

    // Use Mongoose's findByIdAndUpdate to update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $push: { quizzes: { $each: quizzes } } }, // Add the quizzes to the "quizzes" array
      { new: true } // Return the updated work package
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the updated work package data
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error adding quizzes to work package:', error);
    res.status(500).json({ error: 'An error occurred while adding quizzes to the work package.' });
  }
});


// Fetch a specific work package by ID
router.get('/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;

    // Use Mongoose's findById to find the work package by its ID
    const workPackage = await WorkPackage.findById(workPackageId);

    if (!workPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the work package data
    res.status(200).json(workPackage);
  } catch (error) {
    console.error('Error fetching work package by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the work package by ID.' });
  }
});

// Add materials to a specific work package by ID
router.put('/addMaterials/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const materials = req.body.materials;

    // Use Mongoose's findById to find the work package by its ID
    const workPackage = await WorkPackage.findById(workPackageId);
    if (!workPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Remove files that are not selected by user (materials from req)
    const removedMaterials = workPackage.materials.filter(material => !materials.includes(material));
    if (removedMaterials.length > 0) {
      await WorkPackage.findByIdAndUpdate(
        workPackageId,
        { $pull: { materials: { $in: removedMaterials } } },
        { new: true }
      );
    }

    // Add files that do not already exists in the work package
    const newMaterials = materials.filter(material => !workPackage.materials.includes(material));
    if (newMaterials.length === 0) {
      return res.status(200).json(workPackage);
    }
    // Use Mongoose's findByIdAndUpdate to update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $push: { materials: { $each: newMaterials } } },
      { new: true }
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the updated work package data
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error adding materials to work package:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while adding materials to the work package.' });
  }
});

// Delete material given fileID from a specific work package given by ID
router.delete('/deleteMaterial/:workPackageId/:fileId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const fileId = req.params.fileId;

    // Find the file by its Id and delete it in the materials array
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $pull: { materials: fileId } },
      { new: true }
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error deleting material from work package:', error);
    res
      .status(500)
      .json({ error: 'Error occurred while deleting material from work package' });
  }
});

// Delete a quiz from a specific work package by ID
router.delete('/deleteQuiz/:workPackageId/:quizId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const quizId = req.params.quizId;

    // Use Mongoose's findByIdAndUpdate to update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $pull: { quizzes: quizId } },
      { new: true }
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the updated work package data
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error deleting quiz from work package:', error);
    res.status(500).json({ error: 'An error occurred while deleting the quiz from the work package.' });
  }
});


module.exports = router;
