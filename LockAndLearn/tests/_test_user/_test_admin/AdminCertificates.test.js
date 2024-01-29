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

jest.mock('react-native/Libraries/Modal/Modal', () => 'Modal');

describe('view uploaded certificates tests', () => {
  test('modal appears when the button is clicked', () => {
    const { getByText } = render(<AdminCertificates />);
    fireEvent.press(getByText('Reject'));
    // reject confirmation message should appear when clicking on reject button
    expect(getByText(/Are you sure you want to reject this application?/i)).toBeDefined();
  });

  it('make PUT request and test connection to server', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Successfully downloaded certificate' }));
    const downloadCertificateHandler = async (userId) => {
      await fetchMock(`http://localhost:4000/certificates/acceptUserCertificates/${userId}`, {
        method: 'PUT',
      });
    };
    await downloadCertificateHandler('123');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/certificates/acceptUserCertificates/123',
      {
        method: 'PUT',
      }
    );
    const response = await fetchMock(
      'http://localhost:4000/certificates/acceptUserCertificates/123',
      {
        method: 'PUT',
      }
    );
    if (response.status) {
      expect(response.status).toBe(200);
    }
  });

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
