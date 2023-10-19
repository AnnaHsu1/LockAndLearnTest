import { render, fireEvent } from "@testing-library/react-native";
import LockingSchedulePresentation from '../screens/LockingSchedulePresentation';


jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }),
  }));

describe('LockingSchedulePresentation', () => {
    it('Checks that Header time is rendered', () => {
        const { getByTestId } = render(<LockingSchedulePresentation />);

        expect(getByTestId('header-time')).toBeDefined();
 
    });
    it('Checks that end session button is rendered', () => {
        const { getByTestId } = render(<LockingSchedulePresentation />);
    
        expect(getByTestId('end-session-button')).toBeDefined();
 
    });
    it('Checks that lesson info is rendered', () => {
        const { getByTestId } = render(<LockingSchedulePresentation />);
        
        expect(getByTestId('lesson-title')).toBeDefined();
        expect(getByTestId('subject-text')).toBeDefined();
        expect(getByTestId('subject-time')).toBeDefined();
        expect(getByTestId('subject-title1')).toBeDefined();
        expect(getByTestId('subject-title2')).toBeDefined();
        expect(getByTestId('subject-quiz')).toBeDefined();
        expect(getByTestId('subject-passCriteria')).toBeDefined();
    
        expect(getByTestId('start-learning-button')).toBeDefined();
 
    });
    it('Checks that start learning button is rendered', () => {
        const { getByTestId } = render(<LockingSchedulePresentation />);
    
        expect(getByTestId('start-learning-button')).toBeDefined();
 
    });
    it('should render End Session components after clicking button', () => {
        const { getByTestId, queryByText } = render(<LockingSchedulePresentation />);

        // simulate a click on the "End Session" button
        fireEvent.press(getByTestId('end-session-button'));
        
        // after clicking on the button, checks that all the components in the End Session Modal are visible
        expect(getByTestId('enterPasswordText')).toBeDefined();
        expect(getByTestId('passwordInput')).toBeDefined();
 
    });
});
