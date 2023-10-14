import {describe, expect, test} from '@jest/globals';
import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from '../screens/HomeScreen';

describe('Components rendering correctly', () => {
  // test('renders the Text element with the expected text', () => {
  //   const { getByTestId } = render(<HomeScreen />);
  //   // Use the getByText query to assert that the Text element is present with the expected text
  //   // expect(getByText('HOME HOME HOME HOME')).toBeDefined();
  // });   

  test('login button is shown and on press, navigate to login screen', () => {
    // Create a mock navigation function
    const mockNavigate = jest.fn();

    const { getByTestId } = render(<HomeScreen navigation={{ navigate: mockNavigate }} />);
    const logInButton = getByTestId('loginButton');
    
    fireEvent.press(logInButton);
  
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});