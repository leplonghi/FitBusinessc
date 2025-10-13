import React from 'react';
import { LayoutDashboard, Building, BarChart3, User, Bell } from 'lucide-react';
import { Papel } from './types';

interface NavLinkConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: Papel[]; // Defines which roles can see this link
}

/**
 * Defines the primary navigation links for the application.
 * This list is filtered by user role to create a tailored navigation experience.
 * The menu is now streamlined to essential items as per the latest requirements.
 */
export const NAV_LINKS: NavLinkConfig[] = [
  // Core Dashboards & Monitoring
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
    label: 'Empresas Monitoradas', // Updated label for clarity
    icon: <Building size={20} />, 
    roles: ['superadmin', 'Gerente RH'] 
  },
  { 
    href: '/alertas', 
    label: 'Central de Alertas', 
    icon: <Bell size={20} />, 
    roles: ['superadmin', 'Gerente RH'] 
  },
  
  // Consolidated Analytics Hub
  { 
    href: '/painel-analitico', 
    label: 'Painel Analítico', 
    icon: <BarChart3 size={20} />, 
    roles: ['superadmin', 'Gerente RH'] 
  },

  // Note: Administrative links like 'Registro de Atividades' (/auditoria) and 
  // 'Integrações' (/integracoes) are not in the main navigation to keep the UI focused.
  // The routes still exist in App.tsx for direct access by admins.
];
