import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = 'auth_data';

export const saveAuthData = async (authData: {
  access: string;
  refresh: string;
}) => {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Failed to save auth data:', error);
  }
};

export const loadAuthData = async (): Promise<{
  access: string;
  refresh: string;
} | null> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load auth data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};
