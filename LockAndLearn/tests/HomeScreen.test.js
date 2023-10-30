import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('HomeScreen', () => {
    test('renders correctly', () => {
        const { getByText } = render(<HomeScreen />);
        const welcomeText = getByText(/Welcome to Lock & Learn/i);
        expect(welcomeText).toBeTruthy();
    });

/*    test('displays different content for authenticated and unauthenticated users', () => {
        const { getByText } = render(<HomeScreen isAuthenticated={false} />);
        const signupButton = getByText(/Tutor/i);
        const parentButton = getByText(/Parent/i);
        expect(signupButton).toBeTruthy();
        expect(parentButton).toBeTruthy();

    });
*/
/*    test('navigates to the correct screen when buttons are pressed', () => {
        const navigateMock = jest.fn();
        const { getByText } = render(<HomeScreen navigation={{ navigate: navigateMock }} />);

        const parentButton = getByText(/Parent/i);


        fireEvent.press(parentButton);
        expect(navigateMock).toHaveBeenCalledWith('Signup'); 
    });*/
});