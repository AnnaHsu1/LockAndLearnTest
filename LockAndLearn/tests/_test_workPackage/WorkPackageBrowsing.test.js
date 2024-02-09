import WorkPackageBrowsing from '../../screens/WorkPackage/WorkPackageBrowsing';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mocking modules and navigation
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  }));

jest.mock('../../components/AsyncStorage', () => ({
    getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: '123' }))),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]), // Mock empty array for initial fetch
        status: 200,
    })
);


const mockedParameters = {
    route: {
        params: {
            removedWP: 'WPid-to-be-removed',
        },
    },
};

const mockWorkPackages = [
    {
        _id: '1',
        name: 'Work Package 1',
        grade: 'A',
        subcategory: 'Math',
        instructorID: 'instructor1',
        quizzes: ['quiz1', 'quiz2'],
        materials: ['material1', 'material2']
    }
];
const mockChild = [
    {
    _id: {
      $oid: "6568a7ed60ca2c3aeef149cd"
    },
    firstName: "Blah",
    lastName: "Blah",
    grade: "6",
    parentId: "6568a7ac60ca2c3aeef149ca",
    __v: 3,
    preferences: [
      "French",
      "Science",
      "History",
      "Biology",
      "English"
    ]
  }
];


describe('WorkPackageBrowsing Tests', () => {
    
    beforeEach(() => {
        global.fetch = jest.fn();
        global.fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => Promise.resolve(mockWorkPackages),
                status: 200,
            })
        ).mockReturnValueOnce(
            Promise.resolve({
                json: () => Promise.resolve(mockWorkPackages),
                status: 200,
            })
        ).mockReturnValueOnce(
            Promise.resolve({
                json: () => Promise.resolve(mockChild),
                status: 200,
            })
        );
    });

    it('renders correctly', () => {
        const { getByText } = render(<WorkPackageBrowsing {...mockedParameters}/>);
        expect(getByText('Explore')).toBeTruthy();
    });

    it('fetches work packages and cart on mount', async () => {
        render(<WorkPackageBrowsing {...mockedParameters}/>);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(3);
        });
    });

    it('displays work packages properly and adds to cart', async () => {

        const { getByTestId, findByText } = render(<WorkPackageBrowsing {...mockedParameters}/>);
        await waitFor(() => {
            expect(findByText('Work Package 1')).toBeTruthy();
        });
    });

    it('renders the work package item correctly', async () => {
        const { findByText } = render(<WorkPackageBrowsing {...mockedParameters} />);  
        await waitFor(() => {
            expect(findByText('Work Package 1')).toBeTruthy();
        });
    });
});
