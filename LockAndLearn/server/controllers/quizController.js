const express = require('express');
const router = express.Router();
const Quiz = require('../schema/quizSchema.js');

// Create a new quiz
router.post('/create', async (req, res) => {
  try {
    const { name, questions, userId, approved } = req.body;
    const newQuiz = new Quiz({ name, questions, userId, approved });
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

// get all quizzes BASED ON USER IF
router.get('/allQuizzes/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const quizzes = await Quiz.find({ userId: userId }); // This retrieves all quizzes from the Quiz collection.
    res.json(quizzes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all quizzes
router.get('/allQuizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Retrieve all quizzes from the Quiz collection.
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new question and associate it with a quiz by quiz ID
router.post('/addQuestion/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { questionText, questionType, answer, isTrue, multipleChoiceAnswers, inputs, options } =
      req.body;

    // Construct the new question
    const newQuestion = {
      questionText,
      questionType,
      answer,
      isTrue,
      multipleChoiceAnswers,
      inputs,
      options,
    };

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Add the new question to the quiz's questions array
    quiz.questions.push(newQuestion);

    // Save the updated quiz with the new question
    const savedQuiz = await quiz.save();

    res.json(savedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a specific question in a quiz by quiz ID and question index
router.put('/updateQuestion/:quizId/:questionIndex', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questionIndex = parseInt(req.params.questionIndex, 10);
    const { questionText, questionType, answer, isTrue, multipleChoiceAnswers, inputs, options } =
      req.body;

    // Ensure the questionIndex is a valid number
    if (isNaN(questionIndex) || questionIndex < 0) {
      return res.status(400).json({ error: 'Invalid question index provided.' });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Ensure the question exists at the specified index
    if (questionIndex >= quiz.questions.length) {
      return res.status(404).json({ error: 'Question not found at the specified index.' });
    }

    // Update the question based on the received data
    const updatedQuestion = {
      questionText,
      questionType,
      answer,
      isTrue,
      multipleChoiceAnswers,
      inputs,
      options,
    };

    quiz.questions[questionIndex] = updatedQuestion;

    // Save the updated quiz with the modified question
    const savedQuiz = await quiz.save();

    res.json(savedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete question based on quizid and question index
router.delete('/deleteQuestion/:quizId/:questionIndex', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questionIndex = req.params.questionIndex;

    // Ensure the questionIndex is a valid number
    if (isNaN(questionIndex) || questionIndex < 0) {
      return res.status(400).json({ error: 'Invalid question index provided.' });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Ensure the question exists at the specified index
    if (quiz.questions.length <= questionIndex) {
      return res.status(404).json({ error: 'Question not found at the specified index.' });
    }

    // Remove the question from the quiz's questions array
    quiz.questions.splice(questionIndex, 1);

    // Save the updated quiz without the deleted question
    const savedQuiz = await quiz.save();

    res.json(savedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a specific question based on quizId and questionIndex
router.get('/getQuestion/:quizId/:questionIndex', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questionIndex = parseInt(req.params.questionIndex, 10);

    // Ensure the questionIndex is a valid number
    if (isNaN(questionIndex) || questionIndex < 0) {
      return res.status(400).json({ error: 'Invalid question index provided.' });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Ensure the question exists at the specified index
    if (questionIndex >= quiz.questions.length) {
      return res.status(404).json({ error: 'Question not found at the specified index.' });
    }

    // Retrieve the question from the quiz's questions array
    const question = quiz.questions[questionIndex];

    // Return the question
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a specific quiz by ID
router.delete('/deleteQuiz/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    await Quiz.findByIdAndRemove(quizId);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a specific quiz by ID
router.get('/quiz/:quizId', async (req, res) => {
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
    const { name, workPackageId, questions, approved } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { name, workPackageId, questions, approved },
      { new: true }
    );
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
