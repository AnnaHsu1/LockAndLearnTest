import AdminCertificates from '../../../screens/User/Admin/AdminCertificates';
import { describe, expect } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-dom';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        uploadedCertificates: [
          { metadata: { userId: '1', filename: 'certificate_1.pdf' } },
          { metadata: { userId: '2', filename: 'certificate_2.pdf' } },
        ],
      }),
  })
);

describe('view uploaded certificates tests', () => {
  it('Certificate page title is displayed', () => {
    const { getByText } = render(<AdminCertificates />);
    const title = getByText('Certificates to Review');
    expect(title).toBeTruthy();
  });

  it('certificate is present and clickable', () => {
    const { getByTestId } = render(<AdminCertificates />);
    waitFor(async () => {
      const selectCertificate = getByTestId('certificateContainerTest-0');
      fireEvent.press(selectCertificate);
      expect(selectCertificate).toBeDefined();
    });
  });

  it('select accept certificate button is present and clickable', () => {
    const { getByTestId } = render(<AdminCertificates />);
    waitFor(async () => {
      const acceptButton = getByTestId('acceptTest');
      fireEvent.press(acceptButton);
      expect(acceptButton).toBeDefined();
    });
  });

  it('select reject certificate button is present and clickable', () => {
    const { getByTestId } = render(<AdminCertificates />);
    waitFor(async () => {
      const rejectButton = getByTestId('rejectTest');
      fireEvent.press(rejectButton);
      expect(rejectButton).toBeDefined();
    });
  });

  it('should fetch certificates and display them', async () => {
    const { getByTestId, findByTestId } = render(<AdminCertificates />);
    waitFor(async () => {
      await findByTestId('certificateContainerTest-0');
      fireEvent.press(getByTestId('certificateContainerTest-0'));
      expect(getByTestId('certificateContainerTest-0')).toBeInTheDocument();
      expect(getByTestId('certificateContainerTest-0')).toHaveTextContent('certificate_1.pdf');
    });
  });
});