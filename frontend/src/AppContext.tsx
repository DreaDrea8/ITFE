import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";


export interface appContextInterface {
  host: string;
  token: string;
}

export type AppContextType = {
  app: appContextInterface;
  createApp: (app: appContextInterface) => void;
  updateApp: (dto: { host?: string; token?: string }) => void;
  verifyToken: () => boolean;
  deleteToken: () => void;
};

export const AppContext = createContext<AppContextType | null>(null);

interface DecodedToken {
  exp: number;
}

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [app, setApp] = useState<appContextInterface>({
    host: "https://localhost",
    token: ""
  });

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setApp((prevApp) => ({ ...prevApp, token: tokenFromStorage }));
    }
  }, []);

  const createApp = (newApp: appContextInterface) => {
    setApp(newApp);
    localStorage.setItem("token", newApp.token);
  };

  const updateApp = (dto: { host?: string; token?: string }) => {
    setApp((prevApp) => {
      const updatedApp = { ...prevApp, ...dto };
      if (dto.token) localStorage.setItem("token", dto.token);
      return updatedApp;
    });
  };

  const verifyToken = () => {
    if (!app.token) return false;
  
    try {
      const decoded: DecodedToken = jwtDecode(app.token);

      const isTokenExpired = decoded.exp * 1000 < Date.now();
  
      return !isTokenExpired; 
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return false; 
    }
  };

  const deleteToken = () => {
    setApp((prevApp) => {
      const updatedApp = { ...prevApp, token:'' }
      localStorage.removeItem("token")
      return updatedApp;
    });
  };

  return (
    <AppContext.Provider value={{ app, createApp, updateApp, verifyToken, deleteToken }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
