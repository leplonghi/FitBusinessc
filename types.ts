
// FIX: Removed self-referential import that was causing declaration conflicts.

export type RiscoNivel = 'Alto' | 'Médio' | 'Baixo';
export type EmpresaStatus = 'Ativa' | 'Inativa';
export type MetaStatus = 'Não Iniciada' | 'Em Progresso' | 'Concluída';

export interface Endereco {
    rua: string;
    bairro: string;
    cidade: string;
    cep: string;
}

export interface Contato {
    email: string;
    telefone: string;
}

export interface Meta {
    id: string;
    descricao: string;
    dataAlvo: string;
    status: MetaStatus;
}

export interface PlanoExercicio {
    nome: string;
    meta: string;
    frequencia: string;
    progresso: number;
}

export interface Metricas {
    sono: number; // horas
    estresse: number; // percentual
    humor: number; // 1-5
    energia: number; // 1-5
}

export interface HistoricoFitScore {
    date: string;
    score: number;
}

export interface Funcionario {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    setor: string;
    empresaId: string;
    empresaNome: string;
    avatarUrl: string;
    dataAdmissao: string;
    fitScore: number;
    risco: RiscoNivel;
    historicoFitScore: HistoricoFitScore[];
    metricas: Metricas;
    planoExercicio: PlanoExercicio;
    metas: Meta[];
    // Optional fields for detailed profiles
    dataNascimento?: string;
    genero?: 'Masculino' | 'Feminino' | 'Outro';
    peso?: number; // in kg
    altura?: number; // in cm
}

export interface Empresa {
    empresaId: string;
    nomeEmpresa: string;
    cnpj: string;
    setor: string;
    status: EmpresaStatus;
    totalFuncionarios: number;
    fitScoreMedio: number;
    riscoMedio: RiscoNivel;
    irs: number; // Índice de Risco de Saúde
    endereco: Endereco;
    contato: Contato;
    cultura?: string;
    dataCriacao?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  action: string;
  target: {
    type: 'empresa' | 'funcionario' | 'relatorio';
    id: string;
    name: string;
  };
}