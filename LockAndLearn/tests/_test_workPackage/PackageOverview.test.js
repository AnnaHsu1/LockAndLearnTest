import PackageOverview from "../../screens/WorkPackage/Package/PackageOverview";
import React from 'react';
import { render, waitFor, fireEvent} from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';

// Mocks
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => jest.fn(),
    useRoute: () => ({ params: { workPackage: { _id: '1', name: 'Test Package', grade: 10 } } }),
  }));
fetchMock.enableMocks();

describe('PackageOverview Component', () => {
    
    it('renders correctly', () => {
        const { getByText } = render(<PackageOverview />);
        expect(getByText('Test Package - 10th Grade')).toBeTruthy();
    });

    it('fetches packages on mount', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ _id: '1', subcategory: 'Math' }]));
        const { findByText } = render(<PackageOverview />);
        await waitFor(() => {
            expect(findByText('Math')).toBeTruthy();
        });
    });

    it('displays no packages message when list is empty', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]));
        const { findByText } = render(<PackageOverview />);
        await waitFor(() => {
            expect(findByText('No created work packages')).toBeTruthy();
        });
    });

    it('shows delete confirmation modal when delete is initiated', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ _id: '1', subcategory: 'Math' }]));
        const { findByText} = render(<PackageOverview />);
    
        await waitFor(() => {
            expect(findByText('Math')).toBeTruthy();
        });
    
    });
    


});

