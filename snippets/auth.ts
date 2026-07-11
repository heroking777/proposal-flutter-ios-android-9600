import { useState, useEffect } from 'react';
import axios from 'axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any; // Adjust the type as necessary based on your user data structure
}

const useAuth = (): [AuthState, (token: string) => void, () => void] => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      authenticateUser(token);
    }
  }, []);

  const authenticateUser = async (token: string) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/user'); // Adjust the endpoint as necessary
      setAuthState({
        token,
        isAuthenticated: true,
        user: response.data.user, // Adjust based on your API response structure
      });
      localStorage.setItem('jwtToken', token);
    } catch (error) {
      logoutUser();
    }
  };

  const loginUser = (token: string) => {
    authenticateUser(token);
  };

  const logoutUser = () => {
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null,
    });
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  return [authState, loginUser, logoutUser];
};

export default useAuth;