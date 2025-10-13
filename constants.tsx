import React from 'react';
import { LayoutDashboard, Building, BarChart3, Settings, User, Bell, History, Zap, Users as UsersIcon } from 'lucide-react';
import { Papel } from './types';

interface NavLinkConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: Papel[]; // Defines which roles can see this link
}

export const NAV_LINKS: NavLinkConfig[] = [
  // Dashboards
  { 
    href: '/', 
    label: 'Visão Geral', 
    icon: <LayoutDashboard size={20} />, 
    roles: ['superadmin'] 
  },
  { 
    href: '/meu-painel', 
    label: 'Meu Painel', 
    icon: <User size={20} />, 
    roles: ['Funcionário'] 
  },
  { 
    href: '/empresas', 
    label: 'Empresas', 
    icon: <Building size={20} />, 
    roles: ['superadmin', 'Gerente RH'] 
  },
  { 
    href: '/alertas', 
    label: 'Central de Alertas', 
    icon: <Bell size={20} />, 
    roles: ['superadmin', 'Gerente RH'] 
  },
  
  // Analytics Hub
  { 
    href: '/painel-analitico', 
    label: 'Painel Analítico', 
    icon: <BarChart3 size={20} />, 
    roles: ['superadmin', 'Gerente RH'] 
  },

  // Management (Admin Only)
   { 
    href: '/auditoria', 
    label: 'Registro de Atividades', 
    icon: <History size={20} />, 
    roles: ['superadmin'] 
  },
  { 
    href: '/integracoes', 
    label: 'Integrações', 
    icon: <Zap size={20} />, 
    roles: ['superadmin'] 
  },
];