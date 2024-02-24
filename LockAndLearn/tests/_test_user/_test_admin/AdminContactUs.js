import AdminContactUs from '../../../screens/User/Admin/AdminContactUs';
import { describe, expect } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-dom';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();



jest.mock('react-native/Libraries/Modal/Modal', () => 'Modal');

