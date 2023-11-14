import ViewUploadedFilesScreen from '../screens/StudyMaterial/ViewUploadedFilesScreen';
import { describe, expect } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FlatList } from 'react-native';
import '@testing-library/jest-dom';
import { renderFile } from '../screens/StudyMaterial/ViewUploadedFilesScreen';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        uploadedFiles: [
          { metadata: { userId: '1' }, filename: 'Uploaded_file_1.pdf' },
          { metadata: { userId: '2' }, filename: 'Uploaded_file_2.pdf' },
        ],
      }),
  })
);

// beforeAll(() => {
//   const fetchMock = require('jest-fetch-mock');
//   fetchMock.enableMocks();
//   global.fetch = jest.fn(() =>
//     Promise.resolve({
//       json: () =>
//         Promise.resolve({
//           uploadedFiles: [
//             { metadata: { userId: '1' }, filename: 'Uploaded_file_1.pdf' },
//             { metadata: { userId: '2' }, filename: 'Uploaded_file_2.pdf' },
//           ],
//         }),
//     })
//   );
// });

// afterAll(() => {
//   global.fetch.mockClear();
//   delete global.fetch;
// });

describe('view uploaded files tests', () => {
  it('select file is present on screen', () => {
    const { getByText } = render(<ViewUploadedFilesScreen />);
    const selectFile = getByText('Select files');
    expect(selectFile).toBeTruthy();
  });

  it('select file is clickable', () => {
    const { getByTestId } = render(<ViewUploadedFilesScreen />);
    const selectFile = getByTestId('selectFileText');
    fireEvent.press(selectFile);
    expect(selectFile).toBeDefined();
  });

  it('filter feature is present on screen and clickable', () => {
    const { getByTestId } = render(<ViewUploadedFilesScreen/>);
    const filterButton = getByTestId('filterPress');
    fireEvent.press(filterButton);
    expect(filterButton).toBeDefined();
  });

  it('fetches uploaded files and renders them', async () => {
    const { UNSAFE_getAllByType } = render(<ViewUploadedFilesScreen />);

    await waitFor(() => {
      const filesFlatlist = UNSAFE_getAllByType(FlatList);
      expect(filesFlatlist.length).toBe(1);
      expect(filesFlatlist[0].props.data[0].originalname).toBe('Uploaded_file_1.pdf');
      expect(filesFlatlist[0].props.data[1].originalname).toBe('Uploaded_file_2.pdf');
    });
  });

  it('checkbox is present and clickable', async () => {
    const { getByTestId } = render(<ViewUploadedFilesScreen />);
    fireEvent.press(getByTestId('openingFilter'));
    await waitFor(() => {
      expect(getByTestId('checkbox-1')).toBeDefined();
      expect(getByTestId('checkbox-2')).toBeDefined();
    });
    fireEvent.press(getByTestId('checkbox-1'));
    await waitFor(() => {
      expect(getByTestId('checkbox-1')).toBeDefined();
    });
    fireEvent.press(getByTestId('checkbox-2'));
    await waitFor(() => {
      expect(getByTestId('checkbox-2')).toBeDefined();
    });
  });

  it('should fetch files and display them', async () => {
    const { getByTestId, findByTestId } = render(<ViewUploadedFilesScreen />);
    waitFor(async () => {
      await findByTestId('fileTouchableOpacity-0');
      fireEvent.press(getByTestId('fileTouchableOpacity-0'));
      expect(getByTestId('fileTouchableOpacity-0')).toBeInTheDocument();
      expect(getByTestId('fileTouchableOpacity-0')).toHaveTextContent('Uploaded_file_1.pdf');
    });
  });

  it('should delete a file when the delete button is pressed', async () => {
    const { getByTestId, findByTestId } = render(<ViewUploadedFilesScreen />);
    waitFor(async () => {
      findByTestId('deleteButton-0');
      expect(getByTestId('deleteButton-0')).toBeInTheDocument();
      fireEvent.press(getByTestId('deleteButton-0'));
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/files/deleteUploadFiles/1', {
        method: 'POST',
      });
      expect(getByTestId('fileTouchableOpacity-0')).toBeNull();
    });
  });
});
