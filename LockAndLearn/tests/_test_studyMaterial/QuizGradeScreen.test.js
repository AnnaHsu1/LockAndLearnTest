import React from 'react';
import { render } from '@testing-library/react-native';
import QuizGradeScreen from '../../screens/StudyMaterial/QuizGradeScreen';

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});

global.fetch = require('jest-fetch-mock');

describe('QuizGradeScreen Tests', () => {
    const route = {
        params: {
            quizId: '123',
            numOfCorrectAnswers: 8,
            quizLength: 10,
        },
    };

    test('renders grade information correctly', () => {
        const route = {
            params: {
                quizId: '123',
                numOfCorrectAnswers: 8,
                quizLength: 10,
            },
        };

        fetch.mockResponseOnce(JSON.stringify({
            prevPassingGrades: [{name: 'Math', grade: '70'}],
            revealAnswer: false,
            revealAnswerPassing: true,
            revealExplanation: false,
            revealExplanationPassing: true,
          }));
    
        const { getByText } = render(<QuizGradeScreen route={route} />);
    
        // Calculate the expected grade percentage
        const expectedGradePercentage = ((route.params.numOfCorrectAnswers / route.params.quizLength) * 100).toFixed(0);
    
        // Text for the number of correct answers
        const correctAnswersText = `You got ${route.params.numOfCorrectAnswers} correct answers out of ${route.params.quizLength}!`;
        expect(getByText(correctAnswersText)).toBeDefined();
    
        // Text for the grade percentage
        const gradePercentageText = `Your grade is ${expectedGradePercentage} %`;
        expect(getByText(gradePercentageText)).toBeDefined();
    });

});
