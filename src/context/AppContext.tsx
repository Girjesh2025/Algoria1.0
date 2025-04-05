import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AppContextProps {
  user: User | null;
  isDmatConnected: boolean;
  toggleDmatConnection: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User>({ name: 'Girjesh', email: 'girjesh@example.com' });
  const [isDmatConnected, setIsDmatConnected] = useState(false);

  const toggleDmatConnection = () => {
    setIsDmatConnected(prevStatus => !prevStatus);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isDmatConnected,
        toggleDmatConnection
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
