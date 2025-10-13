import { ReactNode } from 'react';

export type Papel = 'Gerente RH' | 'superadmin' | 'Funcionário';

export interface AuditLog {
  id: string;
  user: {
    name: string;
    role: Papel;
  };
  action: string;
  target: {
    type: 'empresa' | 'funcionário' | 'relatório';
    name: string;
  };
  timestamp: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  setor: Setor;
  empresaId: string;
  empresaNome: string;
  fitScore: number;
  risco: RiscoNivel;
  avatarUrl: string;
  dataAdmissao: string;
  historicoFitScore: { date: string; score: number }[];
  metricas: {
    sono: number;
    estresse: number;
    humor: number;
    energia: number;
  };
}

export interface Empresa {
  empresaId: string;
  nomeEmpresa: string;
  status: 'Ativa' | 'Inativa';
  irs: number; // Índice de Risco de Saúde
  funcionariosAtivos: number;
  mediaFitScore: number;
  taxaEngajamento: number;
  alertasRisco: number;
  website?: string;
  irsHistory?: { date: string; irs: number }[];
}

export type RiscoNivel = 'Alto' | 'Médio' | 'Baixo';

export type Setor = 'Tecnologia' | 'Indústria' | 'Logística' | 'Varejo' | 'Saúde';

export interface User {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  avatarUrl: string;
  empresaId?: string; // Optional: superadmin might not have one
}
