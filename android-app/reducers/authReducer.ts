import { authInitialSate, AuthState } from '@/context/authContext';
import { UserProfile } from '@/types/global';

interface SetTokens {
  type: 'SET_TOKENS';
  payload: {
    access: string | null;
    refresh: string | null;
  };
}

interface SetProfile {
  type: 'SET_PROFILE';
  payload: UserProfile;
}

interface SignOut {
  type: 'SIGN_OUT';
}

export type AuthActions = SetTokens | SetProfile | SignOut;

export default function authReducer(state: AuthState, action: AuthActions) {
  switch (action.type) {
    case 'SET_TOKENS':
      return {
        ...state,
        access: action.payload.access,
        refresh: action.payload.refresh,
      };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SIGN_OUT':
      return authInitialSate;
    default:
      return state;
  }
}
