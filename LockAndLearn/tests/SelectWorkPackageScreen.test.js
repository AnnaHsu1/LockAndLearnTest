import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SelectWorkPackageScreen from '../screens/QuizMaterial/SelectWorkPackageScreen';
import { useNavigation } from '@react-navigation/native';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});
const workPackages = [
    { id: 1, name: 'Math - Grade 7' },
    { id: 2, name: 'Science - Grade 4' },
    { id: 3, name: 'History - Grade 5' },
    { id: 4, name: 'History - Grade 10' },
    { id: 4, name: 'French - Grade 12' },
];

describe('SelectWorkPackageScreen Tests', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  test('renders all work packages', () => {
    const { getAllByText } = render(<SelectWorkPackageScreen />);
    
    workPackages.forEach(wp => {
        const matchingElements = getAllByText(wp.name);
        expect(matchingElements.length).toBeGreaterThan(0);
    });
});

  test('navigates to QuizzesOverviewScreen when a work package is clicked', async () => {
    // Mocking the navigation function
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({
      navigate: mockNavigate
    });
    

    const { getByText } = render(<SelectWorkPackageScreen />);
    const workPackageButton = getByText(workPackages[0].name);

    fireEvent.press(workPackageButton);

    expect(mockNavigate).toHaveBeenCalledWith('QuizzesOverviewScreen', {
      workPackageId: workPackages[0].id,
    });
  });

  test('makes API call to create quiz when a work package is clicked', async () => {
    const { getByText } = render(<SelectWorkPackageScreen />);
    const workPackageButton = getByText(workPackages[0].name);

    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    await act(async () => {
      fireEvent.press(workPackageButton);
    });

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:4000/quizzes/create');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.workPackageId).toBe(workPackages[0].id);
    expect(body.name).toBe(`Quiz for ${workPackages[0].name}`);
  });

  test('handles "Create Package" button click', () => {
    const { getByText } = render(<SelectWorkPackageScreen />);
    const createPackageButton = getByText('Create Package');

    fireEvent.press(createPackageButton);
    // create package button does nothing for now, to be implemented
  });
});
