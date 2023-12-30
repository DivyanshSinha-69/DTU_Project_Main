// AuthContext.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { login as loginAction, logout as logoutAction } from './authActions';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const login = () => {
    dispatch(loginAction());
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
