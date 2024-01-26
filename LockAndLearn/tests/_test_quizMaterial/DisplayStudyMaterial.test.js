// Import necessary utilities from the testing library
import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import React from 'react';

// Import the component to be tested
import DisplayStudyMaterial from '../../screens/StudyMaterial/DisplayStudyMaterial'; // Adjust the import path as necessary

// Mock the react-navigation hooks as they're not available outside of a navigation context
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      child_ID: 'testChildId',
    },
  }),
}));


// Mock fetch with jest-fetch-mock
global.fetch = require('jest-fetch-mock');

describe('DisplayStudyMaterial Component Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.resetMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<DisplayStudyMaterial />);
    expect(getByText('No pdf has been found for this package.')).toBeTruthy();
  });

  it('fetches package info on component mount', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      name: 'Math',
      grade: 10,
      packageDescription: 'Mathematics material',
      materials: [],
      quizzes: [],
    }));

    const { findByTestId } = render(<DisplayStudyMaterial />);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/child/getPackagesInfo/testChildId', expect.anything());
  });

  it('logs an error message for non-200 response', async () => {
    fetch.mockResponseOnce('', { status: 404 }); // Simulate a 404 response

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<DisplayStudyMaterial />);

    await waitFor(() => {
      // Use waitFor to wait for asynchronous operations to complete
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching workPackage');
    });

    consoleSpy.mockRestore(); // Restore original console.error behavior
  });
  it('renders PDF viewer when PDF URLs are available', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      name: 'Math',
      grade: 10,
      packageDescription: 'Mathematics material',
      materials: ['mockMaterialId1'], // Ensure this matches your component's expectations
      quizzes: [],
    }));
  
    const { findByText } = render(<DisplayStudyMaterial />);
  
    // Wait for the component to finish rendering based on the fetched data
    await waitFor(() => {
      expect(findByText('Document 1 out of 1')).toBeTruthy();
    });
  });
  
  
});

