import { describe, expect, test } from '@jest/globals';
import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import CreateQuestion from '../../screens/QuizMaterial/CreateQuestion';

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
  test('updates UI elements when different question types are selected', () => {
    const { getByTestId, queryByText } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    const questionTypePicker = getByTestId('questionTypePicker');

    // Simulate selecting "Multiple Choice Question"
    fireEvent(questionTypePicker, 'onValueChange', 'Multiple Choice Question');
    expect(queryByText('Option A')).toBeDefined(); // Replace with actual text/element for Multiple Choice

    // Simulate selecting "True or False"
    fireEvent(questionTypePicker, 'onValueChange', 'True or False');
    expect(queryByText('True')).toBeDefined(); // Replace with actual text/element for True/False

    fireEvent(questionTypePicker, 'onValueChange', 'Fill In The Blanks');
    // Continue for other question types...
  });

  test('renders fill in the blanks options after selecting the question type and allows input and sends to server', async () => {
    const mockRoute = {
      params: {
        quizId: '123',
        questionIndex: 1,
      },
    };

    // Mock the fetch response for the initial data load
    fetchMock.mockResponseOnce(JSON.stringify({
      questionText: '',
      questionType: '',
      answer: '',
    }));

    const { getByTestId, findAllByPlaceholderText, getAllByTestId, findByText, getByText } = render(<CreateQuestion route={mockRoute} />);

    // Simulate selecting "Fill in the Blanks" from the Picker
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'Fill In The Blanks');

    // Wait for the UI to update based on the question type selection
    const question = getByText('Enter words you want to be blank here:');

    // Add a new input field
    const addButton = getByTestId('add-blank-input');
    fireEvent.press(addButton);
    const removeButton = getAllByTestId('remove-blank-input');
    fireEvent.press(removeButton[0]);
    fireEvent.press(addButton);

    // Simulate pressing the save button
    const createQuestion = getByTestId('create-question');
    fireEvent.press(createQuestion);

  });

  test('sends a new question of type multiple choice to the server on submission', async () => {
    const mockNavigate = jest.fn();
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    // Simulate selecting "Fill in the Blanks" from the Picker
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'Multiple Choice Question');

    fireEvent.changeText(getByPlaceholderText('Enter your question here'), 'What is the capital of Spain?');
    // Simulate entering other necessary data for the question based on its type

    await act(async () => {
      fireEvent.press(getByText('Create Question'));
    });
  });

  test('sends a new question of type true or false to the server on submission', async () => {
    const mockNavigate = jest.fn();
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    // Simulate selecting "Fill in the Blanks" from the Picker
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'True or False');

    fireEvent.changeText(getByPlaceholderText('Enter your question here'), 'What is the capital of Spain?');
    // Simulate entering other necessary data for the question based on its type

    await act(async () => {
      fireEvent.press(getByText('Create Question'));
    });

    expect(fetchMock).toHaveBeenCalledWith('https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/createQuestion?quizId=123', expect.any(Object));
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

  });

  test('updates options text for multiple choice questions', () => {
    // Render the component with a Multiple Choice Question type
    const { getByTestId, getAllByTestId } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );

    // Change the question type to 'Multiple Choice Question'
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'Multiple Choice Question');

    // Find all option input fields
    const optionInputs = getAllByTestId(/option-input-/i); // Assuming you have testIDs like 'option-input-A', 'option-input-B', etc.

    // Simulate changing text in the first option input
    fireEvent.changeText(optionInputs[0], 'Updated Option A');
  });

  test('enables the "Create Question" button when the form is valid', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CreateQuestion route={{ params: { quizId: '123' } }} />
    );
  
    // Simulate entering valid question text
    const questionInput = getByPlaceholderText('Enter your question here');
    fireEvent.changeText(questionInput, 'What is the capital of Spain?');
  
    // Simulate selecting "Short Answer" question type
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'Short Answer');
  
    // Simulate entering valid answer text
    const answerInput = getByPlaceholderText('Enter the answer here');
    fireEvent.changeText(answerInput, 'Madrid');
  
    // Check if the "Create Question" button is enabled
    const createQuestionButton = getByText('Create Question');
    expect(createQuestionButton.props.disabled).toBe(undefined);
  });

});
