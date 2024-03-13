const express = require('express');
const router = express.Router();
const Subcategories = require('../schema/subcategoriesSchema.js');

// Route to fetch subcategories for a specific subject and grade
router.get('/fetchSubcategories/:subject/:grade', async (req, res) => {
  try {
    const { subject, grade } = req.params;

    // Find the subcategories document by subject name
    const subcategories = await Subcategories.findOne({ name: subject });

    // Check if the subcategories document and grades exist
    if (subcategories && subcategories.grades && subcategories.grades[grade]) {
      const gradeSubcategories = subcategories.grades[grade];
      res.status(200).json(gradeSubcategories);
    } else {
      res.status(404).json({ error: 'Subcategories not found for the given subject and grade.' });
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'An error occurred while fetching subcategories.' });
  }
});


// Route to fetch all subcategories
router.get('/fetchAll', async (req, res) => {
  try {
    // Query the database to fetch all subcategories
    const allSubcategories = await Subcategories.find();

    // Respond with the fetched subcategories
    res.status(200).json(allSubcategories);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new course
router.post('/createCourse', async (req, res) => {
  try {
    // Get the course name from the request body
    const { courseName } = req.body;

    // Check if the course name is provided
    if (!courseName) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    // Create a new subcategory document
    const newCourse = new Subcategories({
      name: courseName,
      grades: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
      },
    });

    // Save the new course to the database
    await newCourse.save();

    // Respond with the newly created course
    res.status(201).json(newCourse);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a subcategory to a specific grade
router.post('/addSubcategoryToGrade', async (req, res) => {
  try {
    const { subcategoryId, grade, subcategoryName } = req.body;

    // Find the subcategory by ID
    const subcategory = await Subcategories.findById(subcategoryId);

    // Check if the grade exists in the subcategory and add the subcategory name
    if (subcategory && subcategory.grades.hasOwnProperty(grade)) {
      subcategory.grades[grade].push(subcategoryName);
      await subcategory.save();
      res.status(200).json(subcategory);
    } else {
      res.status(404).json({ error: 'Subcategory or grade not found' });
    }
  } catch (error) {
    console.error('Error adding subcategory to grade:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a subcategory from a specific grade at a given index
router.delete('/deleteSubcategoryFromGrade/:subcategoryId/:grade/:index', async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const grade = req.params.grade;
    const index = req.params.index;

    // Find the subcategory by ID
    const subcategory = await Subcategories.findById(subcategoryId);

    // Check if the grade and index exist in the subcategory and remove the subcategory at the specified index
    if (subcategory && subcategory.grades.hasOwnProperty(grade) && subcategory.grades[grade].length > index) {
      subcategory.grades[grade].splice(index, 1);
      await subcategory.save();
      res.status(200).json(subcategory);
    } else {
      res.status(404).json({ error: 'Subcategory, grade, or index not found' });
    }
  } catch (error) {
    console.error('Error deleting subcategory from grade:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});


// Route to delete a subcategory
router.delete('/delete/:subcategoryId', async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const deletedSubcategory = await Subcategories.findByIdAndDelete(subcategoryId);

    if (deletedSubcategory) {
      res.status(200).json({ message: 'Subcategory deleted successfully' });
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all subjects
router.get('/allSubjects', async (req, res) => {
  try {
    const allSubjects = await Subcategories.find({}, 'name');
    res.status(200).json(allSubjects);
  } catch (error) {
    console.error('Error fetching all subjects:', error);
    res.status(500).json({ error: 'An error occurred while fetching all subjects.' });
  }
});

module.exports = router;
