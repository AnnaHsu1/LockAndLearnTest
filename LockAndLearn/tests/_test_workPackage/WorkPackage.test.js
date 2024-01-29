import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WorkPackage from '../../screens/WorkPackage/WorkPackage';

describe('WorkPackage component', () => {

    // Mock the navigation and route objects
    const mockNavigation = {
        navigate: jest.fn(),
    };

    const mockRoute = {
        params: {
            refresh: true, // Mock the refresh parameter
            edited: false, // Mock the edited parameter
        },
    };
    // Test case 1: Check if the component renders without crashing
    it('renders without crashing', () => {
        render(<WorkPackage navigation={mockNavigation} route={mockRoute} />);
      });

    // Test case 2: Check if the "Create work package" button exists
    it('displays a "Create work package" button', () => {
        const { getByText } = render(
          <WorkPackage navigation={mockNavigation} route={{ params: {} }} />
        );
        const createButton = getByText('Create work package');
        expect(createButton).toBeTruthy();
      });
      

    // Add more test cases as needed
});
