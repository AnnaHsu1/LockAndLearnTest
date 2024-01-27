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
      status: 200,
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
          },
          {
            _id: 'timeframe2',
            childId: 'child1',
            day: 'Tuesday',
            startTime: '10:30',
            endTime: '11:00',
          },
          {
            _id: 'timeframe3',
            childId: 'child1',
            day: 'Wednesday',
            startTime: '10:30',
            endTime: '11:00',
          },
          {
            _id: 'timeframe4',
            childId: 'child1',
            day: 'Thursday',
            startTime: '10:30',
            endTime: '11:00',
          },
          {
            _id: 'timeframe5',
            childId: 'child1',
            day: 'Friday',
            startTime: '10:30',
            endTime: '11:00',
          },
          {
            _id: 'timeframe6',
            childId: 'child1',
            day: 'Saturday',
            startTime: '10:30',
            endTime: '11:00',
          },
          {
            _id: 'timeframe7',
            childId: 'child1',
            day: 'Sunday',
            startTime: '10:30',
            endTime: '11:00',
          },
        ]),
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

  test('change to add screen and input values', () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);
    const addTimeFrame = getByTestId('add-timeframe');

    fireEvent.press(addTimeFrame);

    const monday = getByText('Monday');
    const startHour = getByTestId('start-hour');
    const startMinute = getByTestId('start-minute');
    const endHour = getByTestId('end-hour');
    const endMinute = getByTestId('end-minute');
    const save = getByText('Save');

    // Select Monday
    fireEvent.press(monday);

    // Input values 10:30
    fireEvent.changeText(startHour, '10');
    fireEvent.changeText(startMinute, '30');

    // Input values 11:00
    fireEvent.changeText(endHour, '11');
    fireEvent.changeText(endMinute, '00');

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
});
