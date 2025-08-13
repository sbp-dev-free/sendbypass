import { API_URL } from '@/constants/Urls';
import authReducer, { type AuthActions } from '@/reducers/authReducer';
import { UserProfile, UserProfileResponse } from '@/types/global';
import {
  clearAuthData,
  loadAuthData,
  saveAuthData,
} from '@/utils/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';

export interface AuthState {
  access: string | null;
  refresh: string | null;
  profile: UserProfile | null;
}

export const authInitialSate: AuthState = {
  access: null,
  refresh: null,
  profile: null,
};

interface IAuthContext {
  state: AuthState;
  dispatch: React.Dispatch<AuthActions>;
  setTokens: (access: string, refresh: string) => void;
  signOut: () => void;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  state: authInitialSate,
  dispatch: () => {},
  setTokens: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: IAuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, authInitialSate);

  const handleSetAuthData = async () => {
    const authData = await loadAuthData();

    dispatch({
      type: 'SET_TOKENS',
      payload: {
        access: authData?.access || null,
        refresh: authData?.refresh || null,
      },
    });
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<UserProfileResponse>(
        `${API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${state.access}` },
        }
      );
      const { image, first_name, last_name, email } = response.data;
      dispatch({
        type: 'SET_PROFILE',
        payload: {
          email: email || null,
          firstName: first_name || null,
          lastName: last_name || null,
          image: image || null,
        },
      });
    } catch (error) {
      console.error('Profile fetch failed:', error);
      signOut(); // Clear tokens if fetching profile fails
    }
  };

  const setTokens = async (access: string, refresh: string) => {
    dispatch({ type: 'SET_TOKENS', payload: { access, refresh } });
    await saveAuthData({ access, refresh });
  };

  const signOut = async () => {
    dispatch({ type: 'SIGN_OUT' });
    await clearAuthData();
  };

  useEffect(() => {
    handleSetAuthData();
  }, []);

  useEffect(() => {
    if (state.access) {
      fetchUserProfile();
    }
  }, [state.access]);

  const contextValue = {
    state,
    dispatch,
    setTokens,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
