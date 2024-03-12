import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactUs from '../../screens/User/ContactUs'; // Assuming the component file is in the same directory
// Import fetchMock at the top of your test file
import fetchMock from 'jest-fetch-mock';

// Mock global.fetch
global.fetch = jest.fn((url) => {
    if (url.includes('/createContactUs')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: 201 }), // Simulate successful submission
        });
    }
    return Promise.reject(new Error('Unknown endpoint'));
});

const mockedNavigate = jest.fn();
const mockedRoute = {};

describe('ContactUs Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        mockedNavigate.mockClear();
    });

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<ContactUs />);
        expect(getByText('Contact Us')).toBeTruthy();
        // Additional assertions for rendering elements
    });


});
// Before running your tests, setup fetchMock
beforeAll(() => {
    fetchMock.enableMocks(); // Enable fetch mocking
});

describe('ContactUs Component', () => {
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<ContactUs />);
        expect(getByText('Contact Us')).toBeTruthy();
        expect(getByText('Need to get in touch with us? Please fill out the form with your inquiry or contact us directly at admin@lockandlearn.ca')).toBeTruthy();
        expect(getByPlaceholderText('Name')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Subject')).toBeTruthy();
        expect(getByPlaceholderText('Message')).toBeTruthy();
        expect(getByText('Send')).toBeTruthy();
    });

});
