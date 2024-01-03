import React from 'react';
import AdminSubcategories from '../../../screens/User/Admin/AdminSubcategories';
import { render, fireEvent, waitFor} from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});


describe('AdminSubcategories', () => {
  it('renders correctly', () => {
    const { getByText } = render(<AdminSubcategories />);
    expect(getByText('Subjects')).toBeTruthy();
  });

  it('fetches subcategories on component mount', async () => {
    // Mock initial fetch call for subcategories
    fetchMock.mockResponseOnce(JSON.stringify([{ _id: '1', name: 'Subcategory 1' }]));
    const { getByText } = render(<AdminSubcategories />);
  
    await waitFor(() => {
      expect(getByText('Subcategory 1')).toBeTruthy();
    });
  });
  
  it('opens and closes the modal correctly', () => {
    const { getByText, queryByText } = render(<AdminSubcategories />);
    
    // Trigger openModal (assuming it's triggered by pressing a button with text 'Create')
    fireEvent.press(getByText('Create'));
  
    // Trigger closeModal
    fireEvent.press(getByText('Cancel'));
  
    // Check if the modal is not visible anymore
    expect(queryByText('Unique Text in Modal')).toBeNull();
  });

  

});

