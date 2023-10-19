import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../../constants";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (username: string, password: string) => Promise<any>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        setAuthState({
          token: token,
          authenticated: true,
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    };
  }, []);
  const register = async (username: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/auth/signup`, {
        username,
        password,
      });
    } catch (err) {
      return { error: true, message: (err as any).response.data.message };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      setAuthState({
        token: result.data.access_token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.access_token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.access_token);
      return result;
    } catch (err) {
      return { error: true, message: (err as any).response.data.message };
    }
  };

  const logout = async () => {
    setAuthState({
      token: null,
      authenticated: false,
    });

    axios.defaults.headers.common["Authorization"] = ``;

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const value = {
    authState: authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
