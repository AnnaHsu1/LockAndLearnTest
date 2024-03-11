import { render, fireEvent, act } from '@testing-library/react-native';
import GoogleSignUpScreen from '../../screens/User/GoogleSignUpScreen';

// Mock AsyncStorage and fetch
jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  setUserTokenWithExpiry: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 201, user: { isParent: false } }),
    status: 201,
  })
);

// Mock Navigation
const mockNavigate = jest.fn();
const mockRoute = { params: { userInfo: { given_name: 'John', family_name: 'Doe', email: 'john@example.com', id: '123' } } };
const mockNavigation = { navigate: mockNavigate };

describe('GoogleSignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the form and handles server response correctly', async () => {
    const { getByTestId } = render(
      <GoogleSignUpScreen route={mockRoute} navigation={mockNavigation} />
    );

    fireEvent.changeText(getByTestId('birthdate-input'), '2000-01-01');
    fireEvent.press(getByTestId('signup-button'));
  });
});
