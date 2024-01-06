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
//Tests
describe('StudyMaterialPreferences tests', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText } = render(<StudyMaterialPreferences navigation={mockNavigation} route={mockRoute}/>);
        
        // Assert that the component renders the learning subject title
        expect(getByText('Learning Subject Preferences')).toBeTruthy();
        
        // Assert that the component renders the save preferences button
        expect(getByText('Save Preferences')).toBeTruthy();
    });
    
    it('triggers savePreferences function when save preferences button is pressed', () => {
        
        const { getByTestId } = render(<StudyMaterialPreferences navigation={mockNavigation} route={mockRoute}/>);
        
        const savePreferencesMock = getByTestId('savePreferencesButton');

        expect(savePreferencesMock).toBeTruthy();

        // Simulate button press
        fireEvent.press(savePreferencesMock);

    });
    it('Updates the state of the checkbox when the checkbox is pressed', () => {
        const { getByTestId } = render(<StudyMaterialPreferences navigation={mockNavigation} route={mockRoute}/>);
        
        const checkboxMock = getByTestId('checkbox-1');

        expect(checkboxMock).toBeTruthy();

        // Simulate button press
        fireEvent.press(checkboxMock);

    });

});
