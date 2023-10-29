const express = require('express');
const router = express.Router();
const Quiz = require('../server/quizSchema.js'); 

// Create a new quiz
router.post('/create', async (req, res) => {
  try {
    const { name, workPackageId, questions } = req.body;
    const newQuiz = new Quiz({ name, workPackageId, questions });
    const savedQuiz = await newQuiz.save();
    res.json(savedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all quizzes
router.get('/allQuizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();  // This retrieves all quizzes from the Quiz collection.
    res.json(quizzes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get a specific quiz by ID
router.get('/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a specific quiz by ID
router.put('/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { name, workPackageId, questions } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { name, workPackageId, questions },
      { new: true }
    );
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a specific quiz by ID
router.delete('/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    await Quiz.findByIdAndRemove(quizId);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
