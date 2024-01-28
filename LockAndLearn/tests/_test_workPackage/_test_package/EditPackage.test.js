import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditPackage from '../../../screens/WorkPackage/Package/EditPackage';

// Mock the useRoute and useNavigation hooks
jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
    useNavigation: jest.fn(),
  }));

describe('EditPackage Component', () => {
  // Mock necessary dependencies and functions here (e.g., navigation, fetch functions)

  it('renders correctly', () => {
    // Mock the route and navigation objects as needed for your test case
    const mockRoute = {
      params: {
        workPackage: {
          wp_id: 1,
          name: 'Test Work Package',
          grade: 'A',
        },
        package: {
          p_id: 2,
          p_quizzes: [],
          p_materials: [],
          subcategory: 'Test Subcategory',
          description: 'Test Description',
        },
      },
    };
    const mockNavigation = { navigate: jest.fn() };

    // Provide mock implementations for useRoute and useNavigation
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute);
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation);

    const { getByText } = render(<EditPackage />);

    // Your test assertions here...
  });

});
