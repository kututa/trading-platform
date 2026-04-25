import React, { createContext, useContext, useState } from 'react';

export interface User {
  name: string;
  email: string;
  balance: number;
}

interface UserContextType {
  user: User;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const defaultUser: User = {
  name: 'Moses',
  email: 'moses@vantrexmarkets.com',
  balance: 0.0,
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login  = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <UserContext.Provider value={{ user: defaultUser, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);