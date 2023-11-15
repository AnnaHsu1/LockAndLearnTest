import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StudyMaterial from '../../screens/StudyMaterial/StudyMaterial';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
}));

describe('StudyMaterial', () => {
  it('displays time', () => {
    const { getByTestId } = render(<StudyMaterial />);
    expect(getByTestId('lessonTime')).toBeDefined();
  });
  it('displays title', () => {
    const { getByTestId } = render(<StudyMaterial />);
    expect(getByTestId('lesonTitle')).toBeDefined();
  });
  it('displays lesson content', () => {
    const { getByTestId } = render(<StudyMaterial />);
    expect(getByTestId('lesonContent')).toBeDefined();
  });
  it('displays lesson content', () => {
    const { getByTestId } = render(<StudyMaterial />);
    expect(getByTestId('takeQuizButton')).toBeDefined();
  });
});
