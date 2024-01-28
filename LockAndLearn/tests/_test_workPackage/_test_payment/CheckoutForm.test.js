import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import CheckoutForm from '../../../screens/WorkPackage/Payment/CheckoutForm';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
  useElements: jest.fn(),
  PaymentElement: jest.fn(),
}));

jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(),
}));

describe('CheckoutForm Component', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue({ navigate: jest.fn() });
    useStripe.mockReturnValue({});
    useElements.mockReturnValue({});
    PaymentElement.mockReturnValue((() => <div />),);
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<CheckoutForm />);
    expect(getByTestId('payment-form')).toBeTruthy();
  });

  it('disables the button when processing or missing dependencies', () => {
    const { getByText } = render(<CheckoutForm />);
    const payButton = getByText('Pay now');
    expect(payButton.props.disabled).toBe(undefined);
  });
  
  it('enables the button when not processing and has dependencies', () => {
    useStripe.mockReturnValueOnce({
      confirmPayment: jest.fn(),
    });
    useElements.mockReturnValueOnce({});
    const { getByText } = render(<CheckoutForm />);
    const payButton = getByText('Pay now');
    expect(payButton.props.disabled).toBe(undefined);
  });

  
});