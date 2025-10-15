import React from 'react';
import { LayoutDashboard, Building, BarChart3, User, Bell, Briefcase } from 'lucide-react';

interface NavLinkConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Defines the primary navigation links for the application.
 * This list is now static as role-based filtering has been removed.
 */
export const NAV_LINKS: NavLinkConfig[] = [
  // Core Dashboards & Monitoring
  { 
    href: '/', 
    label: 'Visão Geral', 
    icon: <LayoutDashboard size={20} />, 
  },
  { 
    href: '/empresas', 
    label: 'Empresas Monitoradas',
    icon: <Building size={20} />, 
  },
  { 
    href: '/alertas', 
    label: 'Central de Alertas', 
    icon: <Bell size={20} />, 
  },
  
  // Consolidated Analytics Hub
  { 
    href: '/painel-analitico', 
    label: 'Painel Analítico', 
    icon: <BarChart3 size={20} />, 
  },

  // Admin Management
  { 
    href: '/gestao/empresas', 
    label: 'Gestão de Empresas', 
    icon: <Briefcase size={20} />, 
  },
];