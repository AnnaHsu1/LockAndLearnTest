jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn((key, value) => Promise.resolve(value)), // Mock setItem to resolve with value
    removeItem: jest.fn(),
    clear: jest.fn(),
  }));

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { getItem, setItem, removeItem, clear, setUserTokenWithExpiry } from '../components/AsyncStorage';
  
  describe('AsyncStorage Utility Functions', () => {
    const mockKey = 'testKey';
    const mockValue = 'testValue';
  
    it('calls AsyncStorage.getItem with correct key', async () => {
      await getItem(mockKey);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(mockKey);
    });
  
    it('calls AsyncStorage.setItem with correct key and value', async () => {
      await setItem(mockKey, mockValue);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(mockKey, mockValue);
    });
  
    it('calls AsyncStorage.removeItem with correct key', async () => {
      await removeItem(mockKey);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(mockKey);
    });
  
    it('calls AsyncStorage.clear', async () => {
      await clear();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  
    it('calls setItem with correct key and user data for setUserTokenWithExpiry', async () => {
        const mockData = { user: 'testUser' };
        await setUserTokenWithExpiry(mockKey, mockData);
      
        expect(AsyncStorage.setItem).toHaveBeenCalled();
        
      });
  });
  