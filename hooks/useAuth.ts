import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// To test different user roles, comment/uncomment the desired user object
// and ensure it's assigned to the 'user' property in the AuthProvider below.

// Super Admin: Full access to all data and settings, including company management.
const superAdminUser: User = {
  id: 'su01',
  nome: 'Admin FitBusiness',
  email: 'admin@fitbusiness.com',
  papel: 'superadmin',
  avatarUrl: 'https://i.pravatar.cc/150?u=super-admin',
};

// Client Admin: Read-only access, restricted to their own company's data.
const clientAdminUser: User = {
  id: 'u1',
  nome: 'Carla Almeida',
  email: 'carla.almeida@empresa.com',
  papel: 'Gerente RH',
  avatarUrl: 'https://i.pravatar.cc/150?u=carla-almeida',
  empresaId: 'e1', // Corresponds to 'InovaTech Soluções'
};

// Employee: Read-only access to their personal dashboard only.
const mockEmployeeUser: User = {
    id: 'f1',
    nome: 'Ana Lima Silva',
    email: 'ana.lima-silva@inovatech-solucoes.com.br',
    papel: 'Funcionário',
    avatarUrl: 'https://i.pravatar.cc/150?u=f1',
    empresaId: 'e1',
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- SWITCH USER HERE ---
  // Change the user to test different permission levels.
  // superAdminUser: Full control.
  // clientAdminUser: View-only for their company.
  // mockEmployeeUser: View-only for personal dashboard.
  const value = { user: superAdminUser };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
