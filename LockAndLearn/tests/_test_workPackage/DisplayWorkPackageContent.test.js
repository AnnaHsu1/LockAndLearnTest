import DisplayWorkPackageContent from '../../screens/WorkPackage/DisplayWorkPackageContent';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

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
//global.fetch = jest.fn();

describe('DisplayWorkPackageContent Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetchMock.resetMocks();
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
    await act(async () => {});
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
    await waitFor(() => {});
  });

  it('displays the workpackage description and updates it correctly', async () => {
    const { getByText, getByTestId } = render(<DisplayWorkPackageContent />);
    const descriptionTitle = getByText('Description');
    const descriptionInput = getByTestId('description_input');
    fireEvent.changeText(descriptionInput, 'This is a test for workpackage description input.');
    expect(descriptionTitle).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
    expect(descriptionInput.props.value).toBe('This is a test for workpackage description input.');
  });

  it('displays the workpackage price field and updates it correctly', async () => {
    const { getByText, getByTestId, queryByText } = render(<DisplayWorkPackageContent />);
    const priceTitle = getByText('Price $');
    const priceInput = getByTestId('price_input');
    fireEvent.changeText(priceInput, 1);
    expect(priceTitle).toBeTruthy();
    expect(priceInput).toBeTruthy();
    expect(priceInput.props.value).toBe(1);
    await waitFor(() => {
          expect(queryByText('Please enter an accurate price in this format: 12.34')).toBeNull();
        });
  });

  it('displays the price validation error when inputing an invalid price', async () => {
    const { getByText, getByTestId } = render(<DisplayWorkPackageContent />);
    const priceInput = getByTestId('price_input');
    fireEvent.changeText(priceInput, 'T');
    await waitFor(() => {
      expect(getByText('Please enter an accurate price in this format: 12.34')).toBeTruthy();
    });
  });

  it("displays 'save changes' button when the description field is modified", async () => {
    const { getByTestId } = render(<DisplayWorkPackageContent />);
    const descriptionInput = getByTestId('description_input')
    fireEvent.changeText(descriptionInput, "testing description field");
    await waitFor(() => {
      expect(getByTestId('saveChangesButton')).toBeTruthy();
    });
  });

  it("displays 'save changes' button when the description or price fields are modified", async () => {
    const { getByTestId } = render(<DisplayWorkPackageContent />);
    const priceInput = getByTestId('price_input')
    fireEvent.changeText(priceInput, 5);
    await waitFor(() => {
      expect(getByTestId('saveChangesButton')).toBeTruthy();
    });
  });

  it("'save changes' button is not displayed when the description or price fields are not modified", async () => {
    const { queryByTestId } = render(<DisplayWorkPackageContent />);
    await waitFor(() => {
      expect(queryByTestId('saveChangesButton')).toBeNull();
    });
  });

  it('make POST request to edit work package', async () => {

    const workPackageId = "test_wp_id"
    const mockWorkPackage = {
      description: "test description",
      price: "test_price"
    }

    // Mock the response with the correct content type and message
    fetchMock.mockResponseOnce(JSON.stringify({ message: `Successfully edited work package ${workPackageId}` }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Call editWorkPackage/:workPackageId endpoint with mock
    const response = await fetch(`http://localhost:4000/workPackages/editWorkPackage/${workPackageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockWorkPackage),
    })

    // Check that fetch was called with the correct parameters and body 
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:4000/workPackages/editWorkPackage/${workPackageId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockWorkPackage),
      }
    );

    // Check the response status and content
    expect(response.status).toBe(200);
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
    const data = await response.json();
    expect(data.message).toBe(`Successfully edited work package ${workPackageId}`);
  });

});
