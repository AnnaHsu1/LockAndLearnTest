const express = require('express');
const router = express.Router();
const ChildQuizResults = require('../schema/childQuizResultsSchema.js')

// save new quiz result for child
router.put('/addChildQuizResults', async (req, res) => {
  try {
      // Extract childQuizResults data from the request body
      console.log(req.body);
      const { childID, quizID, answers, score, status, date, packageID } = req.body;

      // Check if the result already exists
      const result = await ChildQuizResults.findOne({ childID: childID, quizID: quizID });

      if (result) {
          // Append new scores and statuses to the existing arrays
          const updatedScores = result.score.concat(score); // Use concat for arrays
          const updatedStatuses = result.status.concat(status);

          // Update the document with new scores and statuses
          await ChildQuizResults.findByIdAndUpdate(result._id, { $set: { score: updatedScores, status: updatedStatuses } });

          res.status(200).json({ message: "Successfully updated childQuizResult" });
      } else {
          // Create new childQuizResults instance with the extracted passed data
          const newChildQuizResults = new ChildQuizResults({
              childID: childID,
              quizID: quizID,
              childAnswers: answers,
              score: score,
              status: status,
              date: date,
              packageID: packageID,
          });

          // Save ChildQuizResults to the database
          await newChildQuizResults.save();

          // Respond with the newly created childQuizResults
          res.status(201).json({ message: 'Successfully added childQuizResults' });
      }
  } catch (error) {
      // Handle errors if childQuizResults function fails
      console.error('Error adding childQuizResults:', error);
      res.status(500).json({ error: 'Unable to add childQuizResults' });
  }
});


// get status for a quiz based on childId and quizId
router.get('/getStatusForQuiz', async (req, res) => {
    try {
        // Use query parameters for GET requests
        const { childID, quizID } = req.query;

        // Use findOne to retrieve a single document that matches the criteria
        const quizResult = await ChildQuizResults.findOne({ childID: childID, quizID: quizID });

        if (!quizResult) {
            return res.status(404).json({ error: 'Quiz result not found' });
        }

        const status = quizResult.status;

        res.json({ status: status });
    } catch (error) {
        console.error('Error getting childQuizResults status:', error);
        res.status(500).json({ error: 'Unable to get childQuizResults status' });
    }
});


module.exports = router;
