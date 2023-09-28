import {describe, expect, test} from '@jest/globals';
import React from 'react';
import { render } from "@testing-library/react-native";
import HomeScreen from '../screens/HomeScreen';
import renderer from 'react-test-renderer';

describe('Components rendering correctly', () => {
  test('renders the Text element with the expected text', () => {
    const { getByText } = render(<HomeScreen />);

    // Use the getByText query to assert that the Text element is present with the expected text
    expect(getByText('HOME HOME HOME HOME')).toBeDefined();
  }); 

  test('snapshot matches', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});