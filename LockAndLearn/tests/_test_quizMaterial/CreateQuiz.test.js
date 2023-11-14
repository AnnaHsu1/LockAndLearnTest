import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateQuiz from '../../screens/QuizMaterial/CreateQuiz';
import { getItem } from '../../components/AsyncStorage';
import { useNavigation } from '@react-navigation/native';
import { act } from 'react-test-renderer';
import * as AsyncStorage from '../../components/AsyncStorage';

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});
jest.mock('../../components/AsyncStorage', () => ({
    getItem: jest.fn(),
}));


describe('CreateQuiz component', () => {
    it('should render without errors', () => {
        render(<CreateQuiz />);
    });

    it('should update quizName when text is entered', () => {
        const { getByPlaceholderText } = render(<CreateQuiz />);
        const input = getByPlaceholderText('Quiz Name');

        fireEvent.changeText(input, 'Sample Quiz');

        expect(input.props.value).toBe('Sample Quiz');
    });

    it('should not create a quiz with an empty name', () => {
        const { getByTestId } = render(<CreateQuiz />);
        const createButton = getByTestId('create-quiz-button');

        fireEvent.press(createButton);
    });  

});

describe('CreateQuiz - createQuiz function scenarios', () => {
    it('does not proceed with empty quiz name', () => {
      const { getByPlaceholderText, getByTestId } = render(<CreateQuiz />);
      const input = getByPlaceholderText('Quiz Name');
      const createButton = getByTestId('create-quiz-button');
  
      fireEvent.changeText(input, '');
      fireEvent.press(createButton);
  
      // Assert that quiz creation does not proceed
    });
  
    it('creates a quiz successfully', async () => {
        // Mock AsyncStorage with a valid token
        AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ _id: 'validUserId' }));
      
        // Mock fetch with a successful response
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 200, // or 201, based on your API's response
            json: () => Promise.resolve({ /* response data */ }),
          })
        );
      
        // Render the component
        const { getByPlaceholderText, getByTestId } = render(<CreateQuiz />);
        const input = getByPlaceholderText('Quiz Name');
        const createButton = getByTestId('create-quiz-button');
      
        // Simulate entering a valid quiz name and pressing the create button
        fireEvent.changeText(input, 'Test Quiz');
        fireEvent.press(createButton);
      
        // Clean up mocks
        AsyncStorage.getItem.mockReset();
        global.fetch.mockReset();
      });
      
  });
  
