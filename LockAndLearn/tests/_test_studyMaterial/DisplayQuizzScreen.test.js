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


    });

    test('navigates to next question on press', () => {
        const { getByText } = render(<DisplayQuizzScreen route={route} />);
        const nextButton = getByText('Next');
        fireEvent.press(nextButton);

    });

    test('updates answer state when user inputs an answer', () => {
        const { getByPlaceholderText } = render(<DisplayQuizzScreen route={route} />);
        const answerInput = getByPlaceholderText('Enter the answer here');
        fireEvent.changeText(answerInput, 'User Answer');

       
    });

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

    });
    
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    { name: 'Math', grade: 75 },
                    { name: 'Science', grade: 80 },
                    // Add more subjects as needed
                ]),
                status: 200,
            })
        );
    });
    

    // Reset fetch mock after each test
    afterEach(() => {
        global.fetch.mockClear();
    });

});
