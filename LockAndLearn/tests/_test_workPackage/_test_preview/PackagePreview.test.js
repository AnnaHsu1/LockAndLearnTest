import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PackagePreview from '../../../screens/WorkPackage/Preview/PackagePreview';

// Mocks for navigation and route
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn().mockReturnValue({
    params: {
      workPackage: { wp_id: 1, name: 'Mathematics', grade: 'Grade 10' },
      package: {
        p_id: 1,
        p_quizzes: ['Sanple Quiz Name'],
        p_materials: [],
        subcategory: 'Algebra',
        description: 'Algebra topics for Grade 10'
      }
    }
  })
}));

// Mock the global fetch API
global.fetch = jest.fn((url) =>
  url.includes('/quizzes/quiz/')
    ? Promise.resolve({
        json: () => Promise.resolve({ id: 'quiz1', name: 'Sample Quiz Name', questions: [] }), // Mock quiz details
        status: 200
      })
    : url.includes('/files/uploadFiles/')
    ? Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['pdf file content'], { type: 'application/pdf' })),
      })
    : Promise.reject(new Error('fetch called with unexpected URL'))
);

afterEach(() => {
  jest.clearAllMocks();
});


describe('PackagePreview Component', () => {
  it('renders correctly', () => {
    const tree = render(<PackagePreview />).toJSON();
    expect(tree);
  });

  it('displays the correct package name', () => {
    const { getByText } = render(<PackagePreview />);
    expect(getByText('Package')).toBeTruthy();
  });

  it('renders ScrollView component', () => {
    const { getByTestId } = render(<PackagePreview />);
    expect(getByTestId('scrollView')).toBeTruthy();
  });
  
  it('displays the correct subject name', () => {
    const { getByText } = render(<PackagePreview />);
    expect(getByText('Mathematics')).toBeTruthy();
  });

  it('opens PDF Modal on file press', () => {
    const { getByText } = render(<PackagePreview />);
    const fileButton = getByText('Mathematics'); 
    fireEvent.press(fileButton);
    expect(getByText('Mathematics')).toBeTruthy(); 
  });

  it('displays no files message when there are no files', () => {
    const { getByText } = render(<PackagePreview />);
    expect(getByText('No files added')).toBeTruthy();
  });
  
  it('fetches and displays quiz names correctly', async () => {
    const {getByText} = render(<PackagePreview />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`http://localhost:4000/quizzes/quiz/`));
      expect(getByText('Sample Quiz Name')).toBeTruthy();
    });
  });
});

