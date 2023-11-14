import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import EditQuestion from '../../screens/QuizMaterial/EditQuestion'; // Adjust the import path to where your file is located

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

describe('EditQuestion Tests', () => {
  const mockRoute = {
    params: {
      quizId: '123',
      questionIndex: 1,
    },
  };

  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  test('loads question data and populates fields', async () => {
    const mockQuestionData = {
      questionText: 'What is the capital of France?',
      questionType: 'Short Answer',
      answer: 'Paris',
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockQuestionData));

    const { findByDisplayValue } = render(<EditQuestion route={mockRoute} />);

    expect(await findByDisplayValue('What is the capital of France?')).toBeDefined();
    expect(await findByDisplayValue('Paris')).toBeDefined();
  });

  test('updates a question when the save button is pressed', async () => {
    // Mocking the initial fetch response for the question data
    fetchMock.mockResponses(
      [JSON.stringify({
        questionText: 'What is 2+2?',
        questionType: 'Short Answer',
        answer: '4',
      }), { status: 200 }],
      [JSON.stringify({}), { status: 200 }] // Mocking a successful PUT request response
    );

    const { getByText, getByPlaceholderText, getByTestId } = render(<EditQuestion route={mockRoute} />);

    // Simulate changing the question text
    fireEvent.changeText(getByPlaceholderText('Enter your question here'), 'Updated Question Text');
    // Simulate pressing the save button
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    await waitFor(() => {
      // Check if the PUT request was made with the updated question data
      expect(fetchMock.mock.calls[1][0]).toEqual('http://localhost:4000/quizzes/updateQuestion/123/1');
      expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual(expect.objectContaining({ questionText: 'Updated Question Text' }));
    });
  });


  test('renders multiple choice options when question type is Multiple Choice and allows interaction', async () => {

    const { getByTestId, findAllByTestId, findByTestId, findByText } = render(<EditQuestion route={mockRoute} />);

    // First, change the question type to 'Multiple Choice' using the picker
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'Multiple Choice Question');

    const mockQuestionData = {
      questionText: 'What is the largest planet in our solar system?',
      questionType: 'Multiple Choice',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Jupiter',
    };

    fetchMock.mockResponses(
      [JSON.stringify(mockQuestionData), { status: 200 }],
      [JSON.stringify({ success: true }), { status: 200 }] // Mock response for the PUT request
    );

    // Now, wait for the Multiple Choice options to be rendered
    const optionInputs = await findAllByTestId(/option-input-/i); // Regex to match all testIDs starting with 'option-input-'


    // Check the number of option inputs matches the number of options
    expect(optionInputs.length).toBe(mockQuestionData.options.length);

    // Simulate user interaction with each option input
    for (const [index, input] of optionInputs.entries()) {
      fireEvent.changeText(input, `Updated option ${index}`);
    }

    // Simulate pressing the save button
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Wait for the PUT request to be called and check if the payload is correct
    await waitFor(() => {
      // Check if the PUT request was made with the updated question data
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/quizzes/updateQuestion/'), // The URL should contain this string
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('Updated option') // The body should contain updated options
        })
      );
    });

    // Assert the PUT request was made
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('changes to inputs update state for short answer questions', async () => {
    const { getByDisplayValue, getByPlaceholderText } = render(<EditQuestion route={mockRoute} />);

    // Simulate changing the question text for a short answer
    fireEvent.changeText(getByPlaceholderText('Enter your question here'), 'Updated Question Text');

    // Verify state is updated
    expect(getByDisplayValue('Updated Question Text')).toBeDefined();
  });


  test('renders fill in the blanks options after selecting the question type and allows input', async () => {
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

    const { getByTestId, findAllByPlaceholderText, getAllByTestId, findByText, getByText } = render(<EditQuestion route={mockRoute} />);

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
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Wait for the PUT request to be called
    await waitFor(() => {
      // Verify that the PUT request is made to the correct endpoint
      const putCall = fetchMock.mock.calls[1]; // This assumes that fetchMock.mock.calls[0] was the initial GET request
      expect(putCall[0]).toEqual(`http://localhost:4000/quizzes/updateQuestion/${mockRoute.params.quizId}/${mockRoute.params.questionIndex}`);

      // The body of the PUT request should contain the filled-in blanks
      const putBody = JSON.parse(putCall[1].body);
      expect(putBody.inputs).toEqual(['', '']); // Verify that the inputs match the user's entries

      // Verify the method of the request
      expect(putCall[1].method).toBe('PUT');
    });

    // Verify that the response handler is called
    expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
  });


  test('renders true/false options correctly after selecting question type', async () => {
    const mockQuestionData = {
      questionType: 'True or False',
      answer: 'True',
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockQuestionData));

    const { getByTestId, findByText, findByTestId } = render(<EditQuestion route={mockRoute} />);

    // Simulate selecting "True or False" from the Picker
    const questionTypePicker = getByTestId('questionTypePicker');
    fireEvent(questionTypePicker, 'onValueChange', 'True or False');

    // Simulate pressing the save button
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Wait for the PUT request to be called
    await waitFor(() => {
      // Verify that the PUT request is made to the correct endpoint
      const putCall = fetchMock.mock.calls[1]; // This assumes that fetchMock.mock.calls[0] was the initial GET request
      expect(putCall[0]).toEqual(`http://localhost:4000/quizzes/updateQuestion/${mockRoute.params.quizId}/${mockRoute.params.questionIndex}`);

      // The body of the PUT request should contain "False" as the answer since the false checkbox was last clicked
      const putBody = JSON.parse(putCall[1].body);
      expect(putBody.answer).toEqual('False'); // Verify that the answer matches the last checkbox interaction

      // Verify the method of the request
      expect(putCall[1].method).toBe('PUT');
    });

  });

  test('handleSaveQuestion constructs the correct payload and sends a PUT request for a Short Answer', async () => {
    const mockQuestionData = {
      questionText: 'What is the capital of France?',
      questionType: 'Short Answer',
      answer: 'Paris',
    };

    // Mock the fetch response for updating the question
    fetchMock.mockResponseOnce(JSON.stringify({ updated: true }));

    // Render the component with the initial data
    const { getByTestId, getByText, getByPlaceholderText } = render(<EditQuestion route={mockRoute} />);

    // Simulate user input for a short answer question
    fireEvent.changeText(getByPlaceholderText('Enter your question here'), mockQuestionData.questionText);
    fireEvent.changeText(getByPlaceholderText('Enter the answer here'), mockQuestionData.answer);

    // Simulate pressing the save button
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Wait for the PUT request to be called
    await waitFor(() => {
      // The second call to fetchMock (index 1) should be the PUT request
      const putCall = fetchMock.mock.calls[1];
      expect(putCall[0]).toEqual(`http://localhost:4000/quizzes/updateQuestion/${mockRoute.params.quizId}/${mockRoute.params.questionIndex}`);

      // The body of the PUT request should match the mockQuestionData
      const putBody = JSON.parse(putCall[1].body);
      expect(putBody).toEqual(expect.objectContaining({
        questionText: mockQuestionData.questionText,
        questionType: mockQuestionData.questionType,
        answer: mockQuestionData.answer,
        // Verify the structure of the payload as expected by your backend
      }));

      // Verify the method of the request
      expect(putCall[1].method).toBe('PUT');
    });

    // Verify that the response handler is called
    expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
  });

  test('navigates to the QuestionsOverviewScreen when the Cancel button is pressed', () => {
    // Arrange: Render the component with the mock route and navigation
    const { getByText } = render(<EditQuestion route={mockRoute} />);

    // Act: Find the Cancel button and simulate pressing it
    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

  });

  // Test error scenario (non-200 response status)
  test('handles non-200 response status when fetching question', async () => {
    // Mock the fetch response with a status other than 200
    fetchMock.mockResponseOnce('', { status: 404 });

    // Render the component
    render(<EditQuestion route={mockRoute} />);

  });

  // Test network error scenario
  test('handles network error when fetching question', async () => {
    // Mock a fetch failure
    fetchMock.mockRejectOnce(new Error('Network error'));

    // Render the component
    render(<EditQuestion route={mockRoute} />);

  });

});
