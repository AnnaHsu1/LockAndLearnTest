import ViewUploadedFilesScreen from '../screens/StudyMaterial/ViewUploadedFilesScreen';
import { describe, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
jest.useFakeTimers();

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ uploadedFiles: [] }),
    })
  );
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

describe('download file tests', () => {
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
    const toggleModalFilterMock = jest.fn();
    const { getByTestId } = render(
      <ViewUploadedFilesScreen toggleModalFilter={toggleModalFilterMock} />
    );
    const filterButton = getByTestId('filterPress');
    fireEvent.press(filterButton);
    expect(filterButton).toBeDefined();
  });

  // it('test there is a delete button for each row', async () => {
  //   const { getByTestId } = render(<ViewUploadedFilesScreen />);
  //   await waitFor(
  //     () => {
  //       const deleteButton = getByTestId('deleteButton');
  //       expect(deleteButton.length).toBeGreaterThan(0);
  //     },
  //     { timeout: 300000 }
  //   );
  // });
});
