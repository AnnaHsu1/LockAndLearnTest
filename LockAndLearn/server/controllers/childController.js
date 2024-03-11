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
  getPackagesByChildId,
  getPreferences,
} = require('../manager/childManager.js');
const express = require('express');
const router = express.Router();

// Handle child creation
// router.post('/addchild', async (req, res) => {
//   try {
//     // Extract user data from the request body
//     // console.log(req.body);
//     const { FirstName, LastName, Grade, PassingGrade, ParentId, Preferences } = req.body;
//     // console.log(FirstName, LastName, Grade, PassingGrade, ParentId, Preferences);

//     // Input validations
//     if (!FirstName || !LastName || !Grade || !ParentId) {
//       return res.status(400).json({ msg: 'All fields must be filled.' });
//     }

//     if (Grade < 1 || Grade > 13) {
//       return res.status(400).json({ msg: 'Grade must be between 1 and 12.' });
//     }

//     if (!FirstName.match(/^[a-zA-Z]+$/) && !LastName.match(/^[a-zA-Z]+$/)) {
//       return res.status(400).json({ msg: 'First and last name must only contain letters.' });
//     }

//     // Call the createUser function to create a new user
//     const child = await createChild({
//       FirstName,
//       LastName,
//       Grade,
//       PassingGrade,
//       ParentId,
//       Preferences,
//     });

//     // Respond with the newly created user
//     res.status(201).json({ message: 'Successfully added child' });
//   } catch (error) {
//     // Handle errors if createUser function fails
//     console.error('Error adding child:', error);
//     res.status(500).json({ error: 'Unable to add child' });
//   }
// });

// // Handle child retrieval
// router.get('/getchildren/:id', async (req, res) => {
//   try {
//     const children = await getChildrenByParentId(req.params.id);
//     res.status(200).json(children);
//   } catch (error) {
//     console.error('Error getting children:', error);
//     res.status(500).json({ error: 'Unable to get children' });
//   }
// });

// Handle child update
// router.put('/updatechild/:id', async (req, res) => {
//   try {
//     const childId = req.params.id;
//     const { FirstName, LastName, Grade, PassingGrade, ParentId, Preferences } = req.body;

//     if (!FirstName || !LastName || !Grade || !ParentId) {
//       return res.status(400).json({ msg: 'All fields must be filled.' });
//     }

//     if (Grade < 1 || Grade > 12 || !/^\d+$/.test(Grade)) {
//       return res.status(400).json({ msg: 'Grade must be a digit between 1 and 12.' });
//     }

//     if (!FirstName.match(/^[a-zA-Z]+$/) || !LastName.match(/^[a-zA-Z]+$/)) {
//       return res.status(400).json({ msg: 'First and last name must only contain letters.' });
//     }

//     const child = await updateChild({
//       FirstName,
//       LastName,
//       Grade,
//       PassingGrade,
//       ParentId,
//       _id: childId,
//       Preferences,
//     });

//     res.status(200).json(child);
//   } catch (error) {
//     console.error('Error updating child:', error);
//     res.status(500).json({ error: 'Unable to update child' });
//   }
// });

// Handle child deletion
// router.delete('/deletechild/:id', async (req, res) => {
//   try {
//     const childId = req.params.id;
//     const child = await deleteChild(childId);
//     res.status(200).json(child);
//   } catch (error) {
//     console.error('Error deleting child:', error);
//     res.status(500).json({ error: 'Unable to delete child' });
//   }
// });

// updates/adds subjects passing grade to child collection
router.put('/updateUserSubjectsPassingGrade/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { subjects, revealAnswers, revealAnswersPassing, revealExplanation, revealExplanationPassing } = req.body;
    const child = await updateUserSubjectsPassingGrade(userId, subjects, revealAnswers, revealAnswersPassing, revealExplanation, revealExplanationPassing);
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

// Get all work packages assigned to the child
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
router.get('/getPackagesInfo/:id', async (req, res) => {
  try {
    const childId = req.params.id;
    // get random package from array of packages except wp
    const packages = await getPackagesByChildId(childId);
    packages.forEach((package) => {
      if (package.length === 26) {
        // remove package from packages
        const index = packages.indexOf(package);
        if (index > -1) {
          packages.splice(index, 1);
        }
      }
    });
    const randomIndex = Math.floor(Math.random() * packages.length);
    const randomPackageId = packages[randomIndex];
    // get this package info with its wp info
    const packageInfo = await getPackageByPackageId(randomPackageId);
    // when no package found
    if (packageInfo === null) {
      res.status(400).json({ error: 'no package found' });
    } else {
      res.status(200).json(packageInfo);
    }
  } catch (err) {
    console.log('Error getting packages for child: ', err);
    res.status(500).json({ error: 'Unable to get packages for child' });
  }
});

// router.get('/getPreferences/:id', async (req, res) => {
//   try {
//     const childId = req.params.id;
//     const preferences = await getPreferences(childId);
//     // console.log('preferences:', preferences);
//     res.status(200).json(preferences);
//   } catch (error) {
//     console.error('Error getting preferences:', error);
//     res.status(500).json({ error: 'Unable to get preferences' });
//   }
// });

module.exports = router;
