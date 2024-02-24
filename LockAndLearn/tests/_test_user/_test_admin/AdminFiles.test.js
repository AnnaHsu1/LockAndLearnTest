import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminFiles from '../../../screens/User/Admin/AdminFiles';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ allFiles: [{ _id: '1', filename: 'TestFile.pdf', uploadDate: '2023-01-01' }] }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('<AdminFiles />', () => {
  it('renders correctly', () => {
    const { getByText } = render(<AdminFiles />);
    expect(getByText('Study Material')).toBeTruthy();
  });

  it('fetches and displays files after component mounts', async () => {
    const { getByText } = render(<AdminFiles />);
    await waitFor(() => expect(getByText('TestFile.pdf')).toBeTruthy());
  });

  it('opens modal on delete button press', async () => {
    const { getByText, getByPlaceholderText } = render(<AdminFiles />);
    await waitFor(() => fireEvent.press(getByText('Delete')));

    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  
  it('opens file details modal on file name press', async () => {
    const { getByText } = render(<AdminFiles />);
    await waitFor(() => fireEvent.press(getByText('TestFile.pdf')));
  
    expect(getByText('File Details')).toBeTruthy();
  });

});

