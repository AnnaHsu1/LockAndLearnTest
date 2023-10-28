const Quiz = require('./quizSchema');

// Create a new quiz
const createQuiz = async (quizData) => {
    try {
      const quiz = new Quiz(quizData);
      await quiz.save();
      return quiz;
    } catch (error) {
      throw error;
    }
  };
  
  // Get a quiz by its ID
  const getQuizById = async (quizId) => {
    try {
      return await Quiz.findById(quizId);
    } catch (error) {
      throw error;
    }
  };
  
  // Get all quizzes
  const getAllQuizzes = async () => {
    try {
      return await Quiz.find();
    } catch (error) {
      throw error;
    }
  };

  module.exports = {
    createQuiz,
    getQuizById,
    getAllQuizzes,
  };