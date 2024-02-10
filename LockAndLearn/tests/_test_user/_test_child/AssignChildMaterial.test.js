import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import AssignChildMaterial from '../../../screens/User/Child/AssignChildMaterial';
import { useRoute } from '@react-navigation/native';
import { getUser } from '../../../components/AsyncStorage';

const fetchMock = require('jest-fetch-mock');

const mockPrevAssigned = ['wp1', 'wp2'];

const mockWorkPackages = [
  {
    _id: 'wp1',
    name: 'Work Package 1',
    description: 'This is a work package',
    grade: '1st Grade',
    subject: 'Math',
    price: 12,
  },
  {
    _id: 'wp2',
    name: 'Work Package 2',
    description: 'This is a work package 2',
    grade: '1st Grade',
    subject: 'English',
    price: 13,
  }
];

// Mock the useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    // Mock the route object properties here
    params: {
      // Define any expected route params
      child: {
        _id: 'child1',
        firstName: 'Child One',
      },
    },
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('../../../components/AsyncStorage', () => ({
  getUser: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'user123' }))),
}));

// Mock fetch API
global.fetch = jest.fn((url) => {
  if(url === 'http://localhost:4000/workPackages/fetchWorkpackagesParent/undefined?displayOwned=true') {
    return Promise.resolve({
      json: () => Promise.resolve(mockPrevAssigned),
      status: 200,
    });
  } else if(url === 'http://localhost:4000/child/getWorkPackages/child1') {
    return Promise.resolve({
      json: () => Promise.resolve(mockWorkPackages),
      status: 200,
    });
  }
  else {
    return  Promise.resolve({
        json: () => Promise.resolve({}),
        status: 200,
      })    
  } 
}

);

describe('AssignChildMaterial component', () => {
  test('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <AssignChildMaterial navigation={{ navigate: jest.fn() }} route={useRoute()} />
    );
    const assignChildMaterialHeader = getByTestId('header');
    expect(assignChildMaterialHeader).toBeTruthy();
    const addButton = getByText('Save');
    expect(addButton).toBeTruthy();
  });

  test('makes 4 api calls on page load', async () => {
    const { getByTestId } = render(
      <AssignChildMaterial navigation={{ navigate: jest.fn() }} route={useRoute()} />
    );
    expect(global.fetch).toHaveBeenCalledTimes(6);
  }
  );
});
