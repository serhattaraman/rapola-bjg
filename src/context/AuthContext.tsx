
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'staff';

// Süreçler için yetki türü
export type StageKey =
  | 'Başvuru Alındı'
  | 'Telefon Görüşmesi'
  | 'İK Görüşmesi'
  | 'Evrak Toplama'
  | 'Sisteme Evrak Girişi'
  | 'Sınıf Yerleştirme'
  | 'Denklik Süreci'
  | 'Vize Süreci'
  | 'Sertifika Süreci';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authorizedStages?: StageKey[];
}

// Initialize a mock users array
const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', authorizedStages: ['Başvuru Alındı', 'Telefon Görüşmesi', 'İK Görüşmesi', 'Evrak Toplama', 'Sisteme Evrak Girişi', 'Sınıf Yerleştirme', 'Denklik Süreci', 'Vize Süreci', 'Sertifika Süreci'] },
  { id: '2', name: 'Manager User', email: 'manager@example.com', role: 'manager', authorizedStages: ['Başvuru Alındı', 'Telefon Görüşmesi', 'İK Görüşmesi'] },
  { id: '3', name: 'Staff User', email: 'staff@example.com', role: 'staff', authorizedStages: ['Başvuru Alındı'] }
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUserStages: (userId: string, authorizedStages: StageKey[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: String(users.length + 1)
    };
    setUsers(prev => [...prev, user]);
  };

  const updateUserStages = (userId: string, authorizedStages: StageKey[]) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => u.id === userId ? { ...u, authorizedStages } : u)
    );
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      isAuthenticated,
      login,
      logout,
      addUser,
      updateUserStages
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
