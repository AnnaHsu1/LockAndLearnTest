import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import QuizzesOverviewScreen from '../../screens/QuizMaterial/QuizzesOverviewScreen';
import * as AsyncStorage from '../../components/AsyncStorage'; // Adjust the import path as needed

// Mock useFocusEffect to simply execute its argument immediately
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'), // use actual for all non-hook parts
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
    useFocusEffect: (effect) => effect(),
  };
});


// Mocking AsyncStorage
jest.mock('../../components/AsyncStorage', () => ({
  getUser: jest.fn(),
}));

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Adjust based on expected data
  })
);

describe('QuizzesOverviewScreen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    fetch.mockClear();
    AsyncStorage.getUser.mockResolvedValue({ _id: '123' }); // Mock user ID
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <QuizzesOverviewScreen route={{ params: { userId: '123' } }} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Quizzes')).toBeTruthy();
    });
  });

  it('fetches quizzes on focus', async () => {
    render(
      <NavigationContainer>
        <QuizzesOverviewScreen route={{ params: { userId: '123' } }} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('allQuizzes/123'), expect.anything());
    });
  });

  it('deletes a quiz after confirmation', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <QuizzesOverviewScreen route={{ params: { userId: '123' } }} />
      </NavigationContainer>
    );

    // Simulate fetching quizzes with a delete button available
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([{ _id: 'quiz1', name: 'Sample Quiz' }]),
      })
    );

    await waitFor(() => {
      expect(getByText('Sample Quiz')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-button-x'));
    fireEvent.press(getByTestId('deleteConfirmationModal'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('deleteQuiz/quiz1'), expect.anything());
    });
  });

  it('fetches and renders quizzes correctly', async () => {
    // Mock the AsyncStorage to return a specific user ID
    AsyncStorage.getUser.mockResolvedValue({ _id: 'user123' });

    // Mock the fetch response for quizzes
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([
        { _id: 'quiz1', name: 'Quiz One', approved: true },
        { _id: 'quiz2', name: 'Quiz Two', approved: false },
      ]),
      status: 200,
    });

    const { findByText } = render(
      <NavigationContainer>
        <QuizzesOverviewScreen route={{ params: { userId: 'user123' } }} />
      </NavigationContainer>
    );

    // Wait for the quizzes to be fetched and rendered
    const quizOne = await findByText('Quiz One');
    const quizTwo = await findByText('Quiz Two');

    expect(quizOne).toBeTruthy();
    expect(quizTwo).toBeTruthy();
  });

  it('prompts and deletes a quiz correctly', async () => {
    // Prepare mock quizzes
    const mockQuizzes = [
      { _id: 'quiz1', name: 'Quiz One', approved: true },
    ];
  
    // Mock fetch to simulate fetching quizzes and deleting a quiz
    global.fetch.mockImplementation((url) => {
      if (url.includes('allQuizzes')) {
        return Promise.resolve({ json: () => Promise.resolve(mockQuizzes), status: 200 });
      }
      if (url.includes('deleteQuiz')) {
        // Simulate deleting the quiz by removing it from the mock quizzes array
        const quizId = url.split('/').pop();
        const index = mockQuizzes.findIndex(quiz => quiz._id === quizId);
        if (index !== -1) mockQuizzes.splice(index, 1);
        return Promise.resolve({ status: 200 });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  
    const { getByText, queryByText, findByTestId } = render(
      <NavigationContainer>
        <QuizzesOverviewScreen route={{ params: { userId: 'user123' } }} />
      </NavigationContainer>
    );
  
    // Simulate pressing the delete button for the first quiz
    fireEvent.press(await findByTestId('delete-button-x'));
  
    // Simulate confirming the deletion
    fireEvent.press(getByText('Confirm'));
  
    // Use waitFor for asynchronous state updates and fetch calls
    await waitFor(() => {
      // Verify the quiz has been deleted by checking it's not in the document
      expect(queryByText('Quiz One')).toBeNull();
    });
  });
  

});
