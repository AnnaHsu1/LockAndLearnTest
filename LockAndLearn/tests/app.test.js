import {describe, expect, test} from '@jest/globals';
import React from 'react';
import { render } from "@testing-library/react-native";
import HomeScreen from '../screens/HomeScreen';

describe('Components rendering correctly', () => {
  test('renders the Text element with the expected text', () => {
    const { getByText } = render(<HomeScreen />);

    // Use the getByText query to assert that the Text element is present with the expected text
    //expect(getByText('HOME HOME HOME HOME')).toBeDefined();
  }); 
});