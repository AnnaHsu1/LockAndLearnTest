import SelectStudyMaterialToAdd from "../../screens/WorkPackage/StudyMaterial/SelectStudyMaterialToAdd";
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// Importing AsyncStorage mock
import { getItem } from '../../components/AsyncStorage';

// Mocking the navigation and route
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
}));

// Mocking AsyncStorage
jest.mock('../../components/AsyncStorage', () => ({
    getItem: jest.fn(),
}));

// Mocking fetch API
global.fetch = jest.fn((url) => {
    switch (url) {
      case `http://localhost:4000/files/specificUploadFiles/mockedUserId`:
        return Promise.resolve({
          json: () => Promise.resolve({ uploadedFiles: [{ filename: 'file1', _id: 'file1Id' }] }),
        });
      case `http://localhost:4000/workPackages/mockWorkPackageId`:
        return Promise.resolve({
          json: () => Promise.resolve({ materials: ['file1Id', 'file2Id'] }),
        });
      default:
        return Promise.reject(new Error('Not Found'));
    }
  });

describe('SelectStudyMaterialToAdd', () => {
    beforeEach(() => {
        useNavigation.mockReturnValue({ navigate: jest.fn() });
        useRoute.mockReturnValue({ params: { workPackageId: 'mockWorkPackageId' } });
        fetch.mockClear();
        getItem.mockResolvedValue(JSON.stringify({ _id: 'mockedUserId' }));
        
      });

    // Mocking the getItem function to return a user object
    getItem.mockResolvedValue(JSON.stringify({ _id: 'mockedUserId' }));

    it('renders correctly', async () => {
        const { getByText, findByText } = render(<SelectStudyMaterialToAdd />);
        await findByText('Choose files to add to your Work Package:'); // Using findByText for async operations
        expect(getByText('Choose files to add to your Work Package:')).toBeTruthy();
    });
    
    it('fetches files on load', async () => {
        render(<SelectStudyMaterialToAdd />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    });

});




