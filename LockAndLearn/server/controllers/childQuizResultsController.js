const express = require('express');
const router = express.Router();
const ChildQuizResults = require('../schema/childQuizResultsSchema.js')

// save new quiz result for child
router.post('/addChildQuizResults', async (req, res) => {
    try {
      // Extract childQuizResults data from the request body
      console.log(req.body);
      const { childID, quizID, answers, score, status, date } = req.body;
   
      // create new childQuizResults instance with the extracted passed data
      const newChildQuizResults = new ChildQuizResults({
        childID: childID,
        quizID: quizID,
        childAnswers: answers,
        score: score,
        status: status,
        date: date,
      });

      // Save ChildQuizResults to the database
      await newChildQuizResults.save();   
  
      // Respond with the newly created childQuizResults
      res.status(201).json({ message: 'Successfully added childQuizResults' });
    } catch (error) {
      // Handle errors if childQuizResults function fails
      console.error('Error adding childQuizResults:', error);
      res.status(500).json({ error: 'Unable to add childQuizResults' });
    }
  });


module.exports = router;
