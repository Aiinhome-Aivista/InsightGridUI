import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: Dispatch<SetStateAction<boolean>>;
  isConfirmSaveModalOpen: boolean;
  setIsConfirmSaveModalOpen: Dispatch<SetStateAction<boolean>>;
  viewName: string;
  setViewName: Dispatch<SetStateAction<string>>;
  confirmSave: () => void;
  setConfirmSaveAction: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const [confirmSaveAction, setConfirmSaveAction] = useState<() => void>(() => () => { });


  // useEffect(() => {
  //   const storedUser = localStorage.getItem("ig_user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("ig_user");

    try {
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Invalid user JSON:", err);
      localStorage.removeItem("ig_user");
      setUser(null);
    }
  }, []);


  const login = (userData: any) => {
    localStorage.setItem("ig_user", JSON.stringify(userData));
    setUser(userData);
    navigate("/layout/upload", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("ig_user");
    setIsLogoutModalOpen(false);
    setUser(null);
    navigate("/", { replace: true });
  };

  const confirmSave = () => {
    if (confirmSaveAction) {
      confirmSaveAction();
    }
    setIsConfirmSaveModalOpen(false);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user, login, logout, isAuthenticated,
      isLogoutModalOpen, setIsLogoutModalOpen,
      isConfirmSaveModalOpen, setIsConfirmSaveModalOpen,
      viewName, setViewName, confirmSave, setConfirmSaveAction: setConfirmSaveAction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};