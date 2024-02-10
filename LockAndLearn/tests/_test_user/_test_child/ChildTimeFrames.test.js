import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ChildTimeframes from '../../../screens/User/Child/ChildTimeframes';
import { useRoute } from '@react-navigation/native';

// Mock the useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    // Mock the route object properties here
    params: {
      // Define any expected route params
      child: {
        _id: 'child1',
        firstName: 'Child One',
      },
    },
  }),
}));

jest.mock('../../../components/AsyncStorage', () => ({
  getUser: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'user123' }))),
}));

// Mock fetch API
global.fetch = jest.fn((url) => {
  if (url === 'http://localhost:4000/timeframes/addtimeframe') {
    return Promise.resolve({
      json: () => Promise.resolve(),
      status: 201,
    });
  } else if (url === 'http://localhost:4000/timeframes/gettimeframes/child1') {
    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            _id: 'timeframe1',
            childId: 'child1',
            day: 'Monday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
          {
            _id: 'timeframe2',
            childId: 'child1',
            day: 'Tuesday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
          {
            _id: 'timeframe3',
            childId: 'child1',
            day: 'Wednesday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
          {
            _id: 'timeframe4',
            childId: 'child1',
            day: 'Thursday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
          {
            _id: 'timeframe5',
            childId: 'child1',
            day: 'Friday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
          {
            _id: 'timeframe6',
            childId: 'child1',
            day: 'Saturday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
          {
            _id: 'timeframe7',
            childId: 'child1',
            day: 'Sunday',
            startTime: '10:30',
            endTime: '11:00',
            subject: 'Math',
          },
        ]),
      status: 200,
    });
  } else if (url === 'http://localhost:4000/child/getPreferences/child1') {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          preferences: {
            subjects: ['Math', 'English', 'Science', 'French', 'History', 'Geography'],
          },
        }),
      status: 200,
    });
  } else {
    return Promise.resolve({
      json: () => Promise.resolve({}),
      status: 200,
    });
  }
});

describe('Child timeframe tests', () => {
  test('renders correctly', async () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);
    const addTimeFrame = getByTestId('add-timeframe');
    const editTimeFrame = getByTestId('edit-timeframe');
    const title = getByText('Timeframes');

    expect(addTimeFrame).toBeTruthy();
    expect(editTimeFrame).toBeTruthy();
    expect(title).toBeTruthy();
  });

  test('change to add time screen and expect all fields to be on the page', async () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);
    const addTimeFrame = getByTestId('add-timeframe');

    fireEvent.press(addTimeFrame);

    const monday = getByText('Monday');
    const tuesday = getByText('Tuesday');
    const wednesday = getByText('Wednesday');
    const thursday = getByText('Thursday');
    const friday = getByText('Friday');
    const saturday = getByText('Saturday');
    const sunday = getByText('Sunday');

    expect(monday).toBeTruthy();
    expect(tuesday).toBeTruthy();
    expect(wednesday).toBeTruthy();
    expect(thursday).toBeTruthy();
    expect(friday).toBeTruthy();
    expect(saturday).toBeTruthy();
    expect(sunday).toBeTruthy();

    const startTime = getByText('Start time');
    const endTime = getByText('End time');
    const save = getByText('Save');

    expect(startTime).toBeTruthy();
    expect(endTime).toBeTruthy();
    expect(save).toBeTruthy();
  });

  test('change to add screen and input values', async () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);
    const addTimeFrame = getByTestId('add-timeframe');

    // Wait for the component to fetch data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/timeframes/gettimeframes/child1',
        { credentials: 'include', method: 'GET' }
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/child/getPreferences/child1',
        { credentials: 'include', method: 'GET' }
      );
    });

    fireEvent.press(addTimeFrame);

    const monday = getByText('Monday');
    const startHour = getByTestId('start-hour');
    const startMinute = getByTestId('start-minute');
    const endHour = getByTestId('end-hour');
    const endMinute = getByTestId('end-minute');
    const subject = getByTestId('subject-dropdown-picker-add');
    const save = getByText('Save');

    // Select Monday
    fireEvent.press(monday);

    // Input values 10:30
    fireEvent.changeText(startHour, '10');
    fireEvent.changeText(startMinute, '30');

    // Input values 11:00
    fireEvent.changeText(endHour, '11');
    fireEvent.changeText(endMinute, '00');

    // Select subject
    fireEvent(subject, 'onValueChange', 'Math');

    // Save changes
    fireEvent.press(save);
  });

  test('change to edit timeframe', () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);

    const editTimeFrame = getByTestId('edit-timeframe');
    fireEvent.press(editTimeFrame);

    const cancel = getByText('Cancel');
    const save = getByText('Save');

    expect(cancel).toBeTruthy();
    expect(save).toBeTruthy();
  });

  test('edit timeframe', async () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);

    // Wait for the component to fetch data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/timeframes/gettimeframes/child1',
        { credentials: 'include', method: 'GET' }
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/child/getPreferences/child1',
        { credentials: 'include', method: 'GET' }
      );
    });

    const editTimeFrame = getByTestId('edit-timeframe');
    fireEvent.press(editTimeFrame);

    const subject = getByTestId('subject-dropdown-picker-edit-Monday-0-timeframe1');
    fireEvent(subject, 'onValueChange', 'English');

    const startHour = getByTestId('start-hour-input-edit-Monday-0-timeframe1');
    fireEvent.changeText(startHour, '17');

    const startMinute = getByTestId('start-minute-input-edit-Monday-0-timeframe1');
    fireEvent.changeText(startMinute, '00');

    const endHour = getByTestId('end-hour-input-edit-Monday-0-timeframe1');
    fireEvent.changeText(endHour, '19');

    const endMinute = getByTestId('end-minute-input-edit-Monday-0-timeframe1');
    fireEvent.changeText(endMinute, '30');

    const save = getByText('Save');
    fireEvent.press(save);
  });

  test('delete timeframe', async () => {
    const { getByTestId } = render(<ChildTimeframes route={useRoute()} />);

    // Wait for the component to fetch data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/timeframes/gettimeframes/child1',
        { credentials: 'include', method: 'GET' }
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/child/getPreferences/child1',
        { credentials: 'include', method: 'GET' }
      );
    });

    const editTimeFrame = getByTestId('edit-timeframe');
    fireEvent.press(editTimeFrame);

    const deleteTimeFrame = getByTestId('delete-Monday-0-timeframe1');
    expect(deleteTimeFrame).toBeTruthy();

    const deleteModal = getByTestId('delete-modal');
    expect(deleteModal).toBeTruthy();

    fireEvent.press(deleteTimeFrame);
    const modalCancel = getByTestId('delete-timeframe-no-button');
    fireEvent.press(modalCancel);

    fireEvent.press(deleteTimeFrame);
    const modalDelete = getByTestId('delete-timeframe-yes-button');
    fireEvent.press(modalDelete);

    // Restore the original fetch implementation
    global.fetch.mockRestore();
  });
});
