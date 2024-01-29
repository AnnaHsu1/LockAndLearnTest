import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DisplayQuizzScreen from '../../screens/StudyMaterial/DisplayQuizzScreen';
import { useNavigation } from "@react-navigation/native";

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      questionText: 'Sample Question',
      questionType: 'Multiple Choice Question',
      answer: 'Option A',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
    }),
    status: 200,
  })
);

describe('DisplayQuizzScreen Tests', () => {
    const route = {
        params: {
            quizId: '123',
            questionIndex: 0,
            quizLength: 5,
        },
    };

    test('renders correctly with initial state', () => {
        const { getByText, getByPlaceholderText } = render(<DisplayQuizzScreen route={route} />);
        
        // Add assertions to check if initial elements are rendered
        // e.g., expect(getByText('Question 0')).toBeDefined();
        // Depending on your initial state, check for other elements
    });

    test('navigates to previous question on press', () => {
        const notFirstQuestionRoute = {
            params: {
                quizId: '123',
                questionIndex: 1, // Not the first question
                quizLength: 5,
            },
        };
    
        const { getByText } = render(<DisplayQuizzScreen route={notFirstQuestionRoute} />);
        const previousButton = getByText('Previous');
        fireEvent.press(previousButton);

        // Check if navigation function was called with the correct parameters
        // e.g., expect(useNavigation().navigate).toHaveBeenCalledWith(/* parameters */);
    });

    test('navigates to next question on press', () => {
        const { getByText } = render(<DisplayQuizzScreen route={route} />);
        const nextButton = getByText('Next');
        fireEvent.press(nextButton);

        // Similar assertion as the previous test, but for the next button
    });

    test('updates answer state when user inputs an answer', () => {
        const { getByPlaceholderText } = render(<DisplayQuizzScreen route={route} />);
        const answerInput = getByPlaceholderText('Enter the answer here');
        fireEvent.changeText(answerInput, 'User Answer');

        // Check if the answer state is updated
        // This might require you to export and mock a custom hook if your state logic is complex
    });

    // Add tests for other functionalities like checking checkboxes, filling in the blanks, etc.

    test('submits answers and navigates to QuizGradeScreen on finish', async () => {
        const lastQuestionRoute = {
            params: {
                quizId: '123',
                questionIndex: 4, // Assuming quizLength is 5
                quizLength: 5,
            },
        };

        const { getByText } = render(<DisplayQuizzScreen route={lastQuestionRoute} />);
        const finishButton = getByText('Finish Quiz');

        await act(async () => {
            fireEvent.press(finishButton);
        });


        // Check if navigation to QuizGradeScreen happens with correct parameters
        // e.g., expect(useNavigation().navigate).toHaveBeenCalledWith('QuizGradeScreen', /* parameters */);
    });
    

    // Reset fetch mock after each test
    afterEach(() => {
        global.fetch.mockClear();
    });

});
