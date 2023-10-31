import { describe, expect, test } from '@jest/globals';
import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import CreateQuestion from '../screens/QuizMaterial/CreateQuestion';
import { Picker } from '@react-native-picker/picker';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('CreateQuestion Tests', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders form elements for question creation', () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    expect(getByPlaceholderText('Enter your question here')).toBeDefined();
    expect(getByText('Question')).toBeDefined();
    // Add assertions for each form element that should be rendered initially
  });

  test('updates state on user input', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    const questionInput = getByPlaceholderText('Enter your question here');
    fireEvent.changeText(questionInput, 'What is the capital of Spain?');

    expect(questionInput.props.value).toBe('What is the capital of Spain?');
    // Add similar assertions for other input elements like question type, options, etc.
  });

  test('sends a new question to the server on submission', async () => {
    const mockNavigate = jest.fn();
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { getByPlaceholderText, getByText } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    fireEvent.changeText(getByPlaceholderText('Enter your question here'), 'What is the capital of Spain?');
    // Simulate entering other necessary data for the question based on its type
    
    await act(async () => {
      fireEvent.press(getByText('Create Question'));
    });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/quizzes/addQuestion/123', expect.any(Object));
    // You can add more specific checks to the expect.any(Object) to ensure the body contains the right form data
  });
});
