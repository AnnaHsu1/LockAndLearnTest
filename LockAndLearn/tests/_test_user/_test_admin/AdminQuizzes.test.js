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
