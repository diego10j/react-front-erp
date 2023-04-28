import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
import { sendGet, sendPost } from '../core/services/serviceRequest';
//
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';
import { getMenuUser } from '../layouts/dashboard/nav/config-navigation';
import { getDevice } from '../utils/commonUtil';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------
enum Types {
  INITIAL = 'INITIAL',
  Login = 'LOGIN',
  Register = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.Login]: {
    user: AuthUserType;
  };
  [Types.Register]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------
const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.Login) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.Register) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------
export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();
  const initialize = useCallback(async () => {
    try {
      const accessTokenCurrent = storageAvailable ? localStorage.getItem('accessToken') : '';
      if (accessTokenCurrent && isValidToken(accessTokenCurrent)) {
        setSession(accessTokenCurrent);
        const response: any = await sendGet('/api/auth/check-status');
        const { user } = response.data;
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (userName: string, password: string) => {
    const response = await sendPost('/api/auth/login', {
      password,
      userName,
    });
    const { accessToken, user, menu } = response.data;

    const dataUser = {
      ide_empr: user.ide_empr,
      ide_sucu: user.ide_sucu,
      ide_usua: user.ide_usua,
      ide_perf: user.ide_perf,
      login: user.login,
      empresa: user.nom_empr,
      ip: user.ip,
      device: getDevice()
    };

    localStorage.setItem('user', JSON.stringify(dataUser));
    localStorage.setItem('menu', JSON.stringify(menu));
    setSession(accessToken);
    getMenuUser(); // Forma el menu del usuario

    dispatch({
      type: Types.Login,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const response = await axios.post('/api/account/register', {
        email,
        password,
        firstName,
        lastName,
      });
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: Types.Register,
        payload: {
          user,
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    await sendPost('/api/auth/logout');
    setSession(null);
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      loginWithGoogle: () => { },
      loginWithGithub: () => { },
      loginWithTwitter: () => { },
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );
  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
