const Quiz = require('../schema/quizSchema');

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


// Add a new question to a quiz by quiz ID
const addQuestionToQuiz = async (quizId, questionData) => {
    try {
      const quiz = await Quiz.findById(quizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }
  
      quiz.questions.push(questionData);
      await quiz.save();
      return quiz;
    } catch (error) {
      throw error;
    }
  };

// Get all questions for a quiz by quiz ID
const getQuestionsForQuiz = async (quizId) => {
    try {
      const quiz = await Quiz.findById(quizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }
  
      return quiz.questions;
    } catch (error) {
      throw error;
    }
  };

  module.exports = {
    createQuiz,
    getQuizById,
    getAllQuizzes,
    addQuestionToQuiz,
    getQuestionsForQuiz,
  };


  