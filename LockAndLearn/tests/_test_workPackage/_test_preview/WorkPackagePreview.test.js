import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WorkPackagePreview from '../../../screens/WorkPackage/Preview/WorkPackagePreview';

// Mock the fetch function
global.fetch = require('jest-fetch-mock');

// Define a sample work package for testing
const sampleWorkPackage = {
  _id: '1',
  name: 'Sample Work Package',
  grade: 5,
};

// Mock the React Navigation hooks
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { workPackage: sampleWorkPackage } }),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('WorkPackagePreview component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WorkPackagePreview />);
    
    // Assert that the component renders the work package name and grade
    expect(getByText('Sample Work Package - 5th Grade')).toBeTruthy();
  });

  it('fetches and displays work packages', async () => {
    // Mock the fetch response
    fetch.mockResponseOnce(JSON.stringify([{ _id: '1', subcategory: 'Math', description: 'Mathematics', materials: [], quizzes: [] }]));

    const { getByText } = render(<WorkPackagePreview />);
    
    // Wait for the component to render
    await waitFor(() => {
      // Assert that it displays the subcategory and description of the work package
      expect(getByText('Math')).toBeTruthy();
      expect(getByText('Mathematics')).toBeTruthy();
    });
  });

});
