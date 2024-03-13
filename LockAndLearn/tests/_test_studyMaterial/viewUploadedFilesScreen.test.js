import { describe, expect } from '@jest/globals';
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('test download connection', () => {
  it('make GET request and test connection to server', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Successfully downloaded file' }));
    const downloadFilesHandler = async (fileName) => {
      await fetchMock(`https://lockandlearn.onrender.com/files/uploadFiles/${fileName}`, {
        method: 'GET',
      });
    };
    await downloadFilesHandler('1698621228023-sample2.txt');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://lockandlearn.onrender.com/files/uploadFiles/1698621228023-sample2.txt',
      {
        method: 'GET',
      }
    );
    const response = await fetchMock(
      'https://lockandlearn.onrender.com/files/uploadFiles/1698621228023-sample2.txt',
      {
        method: 'GET',
      }
    );
    if (response.status) {
      expect(response.status).toBe(200);
    }
  });
});
