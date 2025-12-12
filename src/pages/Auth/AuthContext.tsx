import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

interface TableData {
  rows: any[];
  columns: any[];
}
interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: Dispatch<SetStateAction<boolean>>;
  isConfirmSaveModalOpen: boolean;
  downloadData: { rows: any[]; columns: any[] } | null;
  setDownloadData:  Dispatch<TableData | null>;
  setIsConfirmSaveModalOpen: Dispatch<SetStateAction<boolean>>;
  viewName: string;
  setViewName: Dispatch<SetStateAction<string>>;
  confirmSave: () => void;
  setConfirmSaveAction: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    try {
      const storedUser = localStorage.getItem("ig_user");
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Invalid user JSON:", err);
      localStorage.removeItem("ig_user");
      return null;
    }
  });
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const [downloadData, setDownloadData] = useState<TableData | null>(null);
  const [confirmSaveAction, setConfirmSaveAction] = useState<() => void>(() => () => { });



  const login = (userData: any) => {
    localStorage.setItem("ig_user", JSON.stringify(userData));
    setUser(userData);
    navigate("/layout/dashboard", { replace: true });
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
      downloadData, setDownloadData,
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