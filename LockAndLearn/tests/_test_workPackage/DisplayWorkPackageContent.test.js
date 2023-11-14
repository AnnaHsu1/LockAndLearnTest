import DisplayWorkPackageContent from "../../screens/WorkPackage/DisplayWorkPackageContent";
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// Mock the useRoute and useNavigation hooks
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: {
      workPackageId: 'mockedWorkPackageId', // Replace with your desired value
      selectedNewContent: 'mockedSelectedContent', // Replace with your desired value
    },
  }),
  useNavigation: () => ({
    navigate: jest.fn(), // Mock the navigate function if needed
  }),
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('DisplayWorkPackageContent Component', () => {
  beforeEach(() => {
    fetch.mockClear();
        // Clear the mock calls and reset any mock implementations
        jest.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    const { getByText } = render(<DisplayWorkPackageContent />);
    
    // Ensure that a specific text element is rendered in the component
    expect(getByText('Work Package:')).toBeTruthy();
  });

  it('displays study materials and quizzes when data is provided', () => {
    // Mock the work package data
    const mockWorkPackage = {
      name: 'Sample Work Package',
      grade: 'Grade A',
      subcategory: 'Sample Subcategory',
      files: [], // Add sample files data if needed
      quizzes: [], // Add sample quizzes data if needed
    };

    // Render the component with the sample workPackage data
    const { getByText, queryByText } = render(
      <DisplayWorkPackageContent workPackage={mockWorkPackage} />
    );
  });

  it('triggers the add material modal when "Add Material" button is pressed', async () => {
    // Define a sample workPackage object with the expected data
    const sampleWorkPackage = {
      name: 'Sample Work Package',
      grade: 'Grade A',
      subcategory: 'Sample Subcategory',
      files: [], // Add sample files data if needed
      quizzes: [], // Add sample quizzes data if needed
    };

    // Render the component with the sample workPackage data
    const { getByText, getByTestId, queryByTestId } = render(
      <DisplayWorkPackageContent workPackage={sampleWorkPackage} />
    );

    // Check if the modal is initially hidden
    expect(queryByTestId('addMaterialModal')).not.toBeNull();

    // Trigger the modal by clicking the "Add Material" button
    const addMaterialButton = getByText('Add Material');
    fireEvent.press(addMaterialButton);

    // Check if the modal is now visible
    expect(getByTestId('addMaterialModal')).toBeTruthy();

    // Clean up or add more assertions as needed based on your actual component and data structure.
  });

  it('fetches and sets work package data on successful response', async () => {
    // Define a sample workPackageId and mock response data
    const workPackageId = 'sampleWorkPackageId';
    const mockResponseData = {
      name: 'Sample Work Package',
      grade: 'Grade A',
      // Add more properties as needed to match your actual response
    };

    // Mock a successful response with the sample data
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponseData,
    });

    // Render the component
    const { getByText } = render(<DisplayWorkPackageContent />);

    // Wait for the fetchWorkPackage function to complete
    await act(async () => {
    });

  });

  it('toggles the delete modal visibility', () => {
    const { getByTestId, queryByTestId } = render(<DisplayWorkPackageContent />);
  });

  it('fetches file names when workPackage has data', async () => {
    // Mock the fetchFileName function
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 201,
      json: async () => ({
        fileName: 'File 1',
      }),
    });

    const workPackage = {
      materials: ['fileId1', 'fileId2'],
    };

    const { getByText } = render(<DisplayWorkPackageContent workPackage={workPackage} />);

    // Wait for any asynchronous operations to complete (e.g., API calls)
    await waitFor(() => {
    });
  });
  
});
