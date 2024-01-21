const {
  createChild,
  getChildrenByParentId,
  updateChild,
  deleteChild,
  updateUserSubjectsPassingGrade,
  getPreviousPassingGrades,
  updateChildMaterial,
  getWorkPackagesByChildId,
  getPackageByPackageId,
} = require('../manager/childManager.js');
const express = require('express');
const router = express.Router();

// Handle child creation
router.post('/addchild', async (req, res) => {
  try {
    // Extract user data from the request body
    // console.log(req.body);
    const { FirstName, LastName, Grade, PassingGrade, ParentId, Preferences } = req.body;
    console.log(FirstName, LastName, Grade, PassingGrade, ParentId, Preferences);

    // Input validations
    if (!FirstName || !LastName || !Grade || !ParentId) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
    }

    if (Grade < 1 || Grade > 13) {
      return res.status(400).json({ msg: 'Grade must be between 1 and 12.' });
    }

    if (!FirstName.match(/^[a-zA-Z]+$/) && !LastName.match(/^[a-zA-Z]+$/)) {
      return res.status(400).json({ msg: 'First and last name must only contain letters.' });
    }

    // Call the createUser function to create a new user
    const child = await createChild({
      FirstName,
      LastName,
      Grade,
      PassingGrade,
      ParentId,
      Preferences,
    });

    // Respond with the newly created user
    res.status(201).json({ message: 'Successfully added child' });
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error adding child:', error);
    res.status(500).json({ error: 'Unable to add child' });
  }
});

// Handle child retrieval
router.get('/getchildren/:id', async (req, res) => {
  try {
    const children = await getChildrenByParentId(req.params.id);
    res.status(200).json(children);
  } catch (error) {
    console.error('Error getting children:', error);
    res.status(500).json({ error: 'Unable to get children' });
  }
});

// Handle child update
router.put('/updatechild/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    const { FirstName, LastName, Grade, PassingGrade, ParentId, Preferences } = req.body;

    if (!FirstName || !LastName || !Grade || !ParentId) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
    }

    if (Grade < 1 || Grade > 12 || !/^\d+$/.test(Grade)) {
      return res.status(400).json({ msg: 'Grade must be a digit between 1 and 12.' });
    }

    if (!FirstName.match(/^[a-zA-Z]+$/) || !LastName.match(/^[a-zA-Z]+$/)) {
      return res.status(400).json({ msg: 'First and last name must only contain letters.' });
    }

    const child = await updateChild({
      FirstName,
      LastName,
      Grade,
      PassingGrade,
      ParentId,
      _id: childId,
      Preferences,
    });

    res.status(200).json(child);
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ error: 'Unable to update child' });
  }
});

// Handle child deletion
router.delete('/deletechild/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    const child = await deleteChild(childId);
    res.status(200).json(child);
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ error: 'Unable to delete child' });
  }
});

// updates/adds subjects passing grade to child collection
router.put('/updateUserSubjectsPassingGrade/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { subjects } = req.body;
    const child = await updateUserSubjectsPassingGrade(userId, subjects);
    res.status(200).json(child);
  } catch (error) {
    console.error('Error updating user subjects:', error);
    res.status(500).json({ error: 'Unable to update user subjects' });
  }
});

router.get('/getPreviousPassingGrades/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    const previousPassingGrades = await getPreviousPassingGrades(childId);
    res.status(200).json(previousPassingGrades);
  } catch (err) {
    console.log('Error getting previous passing grades for child: ', err);
    res.status(500).json({ error: 'Unable to get passing grades for child' });
  }
});

// Handle child material assignment
router.put('/addChildMaterial/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    const { materials } = req.body;
    const child = await updateChildMaterial(childId, materials);
    res.status(200).json(child);
  } catch (error) {
    console.error('Error assigning child material:', error);
    res.status(500).json({ error: 'Unable to assign child material' });
  }
});

router.get('/getWorkPackages/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    const previouslyAssignedWorkPackage = await getWorkPackagesByChildId(childId);
    res.status(200).json(previouslyAssignedWorkPackage);
  } catch (err) {
    console.log('Error getting work packages for child: ', err);
    res.status(500).json({ error: 'Unable to get work packages for child' });
  }
});

// Get packages info (name, grade, description) by package Ids
router.get('/getWorkPackagesInfo/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    // get all the packages assigned to the child
    const previouslyAssignedPackage = await getWorkPackagesByChildId(childId);
    // handle: when no packages assigned
    if (previouslyAssignedPackage === null) {
      return res.status(200).json({ message: 'No work packages assigned' });
    }
    // randomly pick one of the packages
    const randomIndex = Math.floor(Math.random() * previouslyAssignedPackage.length);
    const randomPackageId = previouslyAssignedPackage[randomIndex];
    // get the package info
    const packageInfo = await getPackageByPackageId(randomPackageId);
    res.status(200).json(packageInfo);
  } catch (err) {
    console.log('Error getting work packages for child: ', err);
    res.status(500).json({ error: 'Unable to get work packages for child' });
  }
});

module.exports = router;
