const {
  createChild,
  getChildrenByParentId,
  updateChild,
  deleteChild,
} = require('../manager/childManager.js');
const express = require('express');
const router = express.Router();

// Handle child creation
router.post('/addchild', async (req, res) => {
  try {
    // Extract user data from the request body
    // console.log(req.body);
    const { FirstName, LastName, Grade, ParentId } = req.body;
    console.log(FirstName, LastName, Grade, ParentId);

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
      ParentId,
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
    const { FirstName, LastName, Grade, ParentId } = req.body;

    if (!FirstName || !LastName || !Grade || !ParentId) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
    }

    if (Grade < 1 || Grade > 13 || !/^\d+$/.test(Grade)) {
      return res.status(400).json({ msg: 'Grade must be a digit between 1 and 12.' });
    }

    if (!FirstName.match(/^[a-zA-Z]+$/) && !LastName.match(/^[a-zA-Z]+$/)) {
      return res.status(400).json({ msg: 'First and last name must only contain letters.' });
    }

    const child = await updateChild({
      FirstName,
      LastName,
      Grade,
      ParentId,
      _id: childId,
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

module.exports = router;
