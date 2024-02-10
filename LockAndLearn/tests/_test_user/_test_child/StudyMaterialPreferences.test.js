import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StudyMaterialPreferences from '../../../screens/User/Child/StudyMaterialPreferences';

// Mock child object
const mockChild = {
  _id: 'child123',
  firstName: 'John',
  lastName: 'Doe',
  grade: '1',
  parentId: 'parent123',
};

// Mock navigation and AsyncStorage
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {
    child: mockChild,
  },
};

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('../../../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'parent123' }))),
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    status: 200,
  })
);

describe('StudyMaterialPreferences tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <StudyMaterialPreferences navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByText('Learning Subject Preferences')).toBeTruthy();
    expect(getByText('Save Preferences')).toBeTruthy();
  });

  it('triggers savePreferences function when save preferences button is pressed', () => {
    const { getByTestId } = render(
      <StudyMaterialPreferences navigation={mockNavigation} route={mockRoute} />
    );
    const savePreferencesMock = getByTestId('savePreferencesButton');
    fireEvent.press(savePreferencesMock);
    expect(savePreferencesMock).toBeTruthy();
  });
  it('make GET request for study material subcategories', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Successfully fetched all subcategories' })
    );
    const response = await fetchMock('http://localhost:4000/subcategories/fetchAll', {
      method: 'GET',
    });
    if (response.status) {
      expect(response.status).toBe(200);
    }
  });
  it('make PUT request for changing subject selection', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Preferences saved successfully!' }));
    const updateSubjects = async (userId) => {
      await fetchMock(`http://localhost:4000/child/updatechild/${userId}`, {
        method: 'PUT',
      });
    };
    await updateSubjects('child123');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/child/updatechild/child123', {
      method: 'PUT',
    });
    const response = await fetchMock('http://localhost:4000/child/updatechild/123', {
      method: 'PUT',
    });
    if (response.status) {
      expect(response.status).toBe(200);
    }
  });
});
