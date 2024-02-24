import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminQuizzes from '../../../screens/User/Admin/AdminQuizzes';

// Mocking the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]), // Mocked response for fetch quizzes
    })
);

// Reset the mocks before each test
beforeEach(() => {
    fetch.mockClear();
});

it('fetches quizzes on component mount', async () => {
    render(<AdminQuizzes />);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:4000/quizzes/allQuizzes');
    });
});


it('displays no quizzes message if none are available', async () => {
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            json: () => Promise.resolve([]),
        })
    );

    const { getByText } = render(<AdminQuizzes />);

    await waitFor(() => {
        expect(getByText('No quizzes available')).toBeTruthy();
    });

    
});

it('displays quizzes when they are available', async () => {
    const mockQuizzes = [
        { _id: '1', name: 'Quiz 1', userId: 'user1' },
        { _id: '2', name: 'Quiz 2', userId: 'user2' },
        // Add more mock quizzes as needed
    ];

    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockQuizzes),
        })
    );

    const { getByText } = render(<AdminQuizzes />);

    await waitFor(() => {
        mockQuizzes.forEach((quiz) => {
            expect(getByText(quiz.name)).toBeTruthy();
            expect(getByText(`ID: ${quiz._id}`)).toBeTruthy();
        });
    });
});


it('handles deletion of a quiz', async () => {
    const mockQuizzes = [
        { _id: '1', name: 'Quiz 1', userId: 'user1' },
        // Add more mock quizzes as needed
    ];

    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockQuizzes),
        })
    );

    const { queryByText, findByTestId } = render(<AdminQuizzes />);

    try {
        await waitFor(async () => {
            // Simulate the press event on the delete button
            const deleteButton = await findByTestId('delete-button-1'); // Assuming the testID is 'delete-button-1'
            fireEvent.press(deleteButton);

            // Assert that the quiz is removed from the UI
            expect(queryByText('Quiz 1')).toBeNull();
            expect(queryByText('ID: 1')).toBeNull();
        });
    } catch (error) {
        // Handle errors, if any
        console.error('Error occurred:', error);
    }
});


