import { Funcionario, Empresa, RiscoNivel, Setor, AuditLog, Papel } from '../types';

const NOMES = ['Ana Lima', 'Bruno Costa', 'Carlos Dias', 'Daniela Rocha', 'Eduardo Melo', 'Fernanda Alves', 'Gustavo Borges', 'Helena Faria', 'Igor Ramos', 'Juliana Nunes'];
const SOBRENOMES = ['Silva', 'Pereira', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Gomes', 'Martins'];
const CARGOS_TECNOLOGIA = ['Engenheiro de Software', 'Analista de Dados', 'Designer UX/UI', 'Gerente de Produto', 'DevOps'];
const CARGOS_INDUSTRIA = ['Operador de Máquinas', 'Engenheiro de Produção', 'Técnico de Manutenção', 'Supervisor de Qualidade'];
const CARGOS_LOGISTICA = ['Analista de Logística', 'Coordenador de Transporte', 'Gerente de Armazém'];
const CARGOS_VAREJO = ['Gerente de Loja', 'Vendedor', 'Analista de Estoque'];
const CARGOS_SAUDE = ['Enfermeiro(a)', 'Analista Clínico', 'Coordenador de Atendimento'];

const EMPRESAS_BASE: Omit<Empresa, 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco' | 'irsHistory'>[] = [
    { empresaId: 'e1', nomeEmpresa: 'InovaTech Soluções', status: 'Ativa', irs: 85, website: 'https://example.com' },
    { empresaId: 'e2', nomeEmpresa: 'Manufatura Forte', status: 'Ativa', irs: 65, website: 'https://example.com' },
    { empresaId: 'e3', nomeEmpresa: 'LogiExpress Brasil', status: 'Ativa', irs: 48 },
    { empresaId: 'e4', nomeEmpresa: 'Varejo Ponto Certo', status: 'Inativa', irs: 72 },
    { empresaId: 'e5', nomeEmpresa: 'Clínica Bem Viver', status: 'Ativa', irs: 92, website: 'https://example.com' },
];

const SETORES: Setor[] = ['Tecnologia', 'Indústria', 'Logística', 'Varejo', 'Saúde'];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const toKebabCase = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

let mockFuncionarios: Funcionario[] = [];
let mockEmpresas: Empresa[] = [];

const generateIrsHistory = (baseIrs: number): { date: string; irs: number }[] => {
    const history = [];
    let currentIrs = baseIrs;
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        history.push({
            date: date.toISOString().split('T')[0],
            irs: currentIrs,
        });
        currentIrs = getRandomInt(Math.max(20, currentIrs - 10), Math.min(100, currentIrs + 10));
    }
    return history;
};

const generateFuncionarios = () => {
    if (mockFuncionarios.length > 0) return;
    
    let funcionarioId = 1;
    EMPRESAS_BASE.forEach(empresaBase => {
        const numFuncionarios = getRandomInt(50, 150);
        const setor = empresaBase.nomeEmpresa === 'InovaTech Soluções' ? 'Tecnologia' :
                      empresaBase.nomeEmpresa === 'Manufatura Forte' ? 'Indústria' :
                      empresaBase.nomeEmpresa === 'LogiExpress Brasil' ? 'Logística' :
                      empresaBase.nomeEmpresa === 'Varejo Ponto Certo' ? 'Varejo' : 'Saúde';
        
        const cargos = setor === 'Tecnologia' ? CARGOS_TECNOLOGIA :
                       setor === 'Indústria' ? CARGOS_INDUSTRIA :
                       setor === 'Logística' ? CARGOS_LOGISTICA :
                       setor === 'Varejo' ? CARGOS_VAREJO : CARGOS_SAUDE;

        for (let i = 0; i < numFuncionarios; i++) {
            const nome = `${getRandomItem(NOMES)} ${getRandomItem(SOBRENOMES)}`;
            const fitScore = getRandomInt(40, 100);
            let risco: RiscoNivel;
            if (fitScore < 60) risco = 'Alto';
            else if (fitScore < 80) risco = 'Médio';
            else risco = 'Baixo';
            
            const historicoFitScore = Array.from({ length: 12 }, (_, j) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (11 - j));
                return {
                    date: date.toISOString().split('T')[0],
                    score: getRandomInt(Math.max(40, fitScore - 15), Math.min(100, fitScore + 15))
                }
            });

            mockFuncionarios.push({
                id: `f${funcionarioId++}`,
                nome,
                email: `${toKebabCase(nome)}@${toKebabCase(empresaBase.nomeEmpresa)}.com.br`,
                cargo: getRandomItem(cargos),
                setor,
                empresaId: empresaBase.empresaId,
                empresaNome: empresaBase.nomeEmpresa,
                fitScore,
                risco,
                avatarUrl: `https://i.pravatar.cc/150?u=${`f${funcionarioId}`}`,
                dataAdmissao: new Date(2022 - getRandomInt(0, 3), getRandomInt(0, 11), getRandomInt(1, 28)).toISOString().split('T')[0],
                historicoFitScore,
                metricas: {
                    sono: parseFloat((getRandomInt(4, 9) + Math.random()).toFixed(1)),
                    estresse: getRandomInt(10, 80),
                    humor: getRandomInt(1, 5),
                    energia: getRandomInt(1, 5),
                }
            });
        }
    });
};

const generateEmpresas = () => {
    if (mockEmpresas.length > 0) return;
    generateFuncionarios();

    mockEmpresas = EMPRESAS_BASE.map(empresaBase => {
        const funcionariosDaEmpresa = mockFuncionarios.filter(f => f.empresaId === empresaBase.empresaId);
        const totalFuncionarios = funcionariosDaEmpresa.length;
        if (totalFuncionarios === 0) {
             return {
                ...empresaBase,
                funcionariosAtivos: 0,
                mediaFitScore: 0,
                taxaEngajamento: 0,
                alertasRisco: 0,
                irsHistory: generateIrsHistory(empresaBase.irs),
            };
        }
        
        const mediaFitScore = Math.round(funcionariosDaEmpresa.reduce((sum, f) => sum + f.fitScore, 0) / totalFuncionarios);
        const taxaEngajamento = getRandomInt(70, 95);
        const alertasRisco = funcionariosDaEmpresa.filter(f => f.risco === 'Alto').length;

        return {
            ...empresaBase,
            funcionariosAtivos: totalFuncionarios,
            mediaFitScore,
            taxaEngajamento,
            alertasRisco,
            irsHistory: generateIrsHistory(empresaBase.irs),
        };
    });
};

generateEmpresas();

export const generateMockEmpresas = (): Empresa[] => {
    return mockEmpresas;
};

export const generateMockFuncionarios = (): Funcionario[] => {
    return mockFuncionarios;
};

export const getFuncionarioById = (id: string): Funcionario | undefined => {
    return mockFuncionarios.find(f => f.id === id);
}

export const generateMockAuditLogs = (): AuditLog[] => {
    const logs: AuditLog[] = [];
    const actions = ['criou', 'editou', 'visualizou', 'exportou', 'excluiu'];
    const targetTypes: ('empresa' | 'funcionário' | 'relatório')[] = ['empresa', 'funcionário', 'relatório'];

    for (let i = 0; i < 50; i++) {
        const targetType = getRandomItem(targetTypes);
        const targetName = targetType === 'empresa' 
            ? getRandomItem(mockEmpresas).nomeEmpresa 
            : targetType === 'funcionário' 
            ? getRandomItem(mockFuncionarios).nome 
            : `Relatório de Engajamento Q${getRandomInt(1,4)}`;

        const timestamp = new Date();
        timestamp.setHours(timestamp.getHours() - i * getRandomInt(1, 5));
        
        logs.push({
            id: `log${i}`,
            user: {
                name: i % 5 === 0 ? 'Admin FitBusiness' : `rh@${toKebabCase(getRandomItem(mockEmpresas).nomeEmpresa)}.com`,
                role: i % 5 === 0 ? 'superadmin' : 'Gerente RH',
            },
            action: getRandomItem(actions),
            target: {
                type: targetType,
                name: targetName,
            },
            timestamp: timestamp.toISOString(),
        });
    }
    return logs;
};


export const generateFitScoreTimeline = () => {
    const data = [];
    let currentScore = getRandomInt(70, 80);
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        data.push({
            date: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
            fitScore: currentScore
        });
        currentScore = getRandomInt(Math.max(60, currentScore - 5), Math.min(90, currentScore + 5));
    }
    return data;
};

export const generateEngagementByNivel = () => [
    { name: 'Operacional', value: 400 },
    { name: 'Tático', value: 300 },
    { name: 'Estratégico', value: 300 },
    { name: 'Liderança', value: 200 },
];

export const generateCheckinsBySetor = () => SETORES.map(setor => ({
    name: setor,
    checkins: getRandomInt(60, 95)
}));

export const generateIrsTimeline = () => {
    const data = [];
    let currentIrs = getRandomInt(65, 75);
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        data.push({
            date: date.toLocaleString('default', { month: 'short' }),
            irs: currentIrs
        });
        currentIrs = getRandomInt(Math.max(50, currentIrs - 8), Math.min(90, currentIrs + 8));
    }
    return data;
};

export const generateFitScorePrediction = () => {
    const data = [];
    const today = new Date();
    let lastReal = getRandomInt(73, 78);

    // Historical data
    for (let i = 3; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - (i * 7));
        data.push({
            date: `Semana ${4-i}`,
            real: getRandomInt(lastReal - 3, lastReal + 3),
            previsto: null
        });
    }
    
    data.push({ date: 'Esta Semana', real: lastReal, previsto: lastReal });

    // Prediction data
    let lastPredicted = lastReal;
    for (let i = 1; i <= 4; i++) {
        lastPredicted = getRandomInt(lastPredicted - 3, lastPredicted + 2);
        data.push({
            date: `Semana +${i}`,
            real: null,
            previsto: lastPredicted
        });
    }
    return data;
};

export const generateOtherPredictions = () => {
    const engagementTrend: 'up' | 'down' = Math.random() > 0.5 ? 'up' : 'down';
    return {
        engagementRate: {
            value: getRandomInt(70, 95),
            trend: engagementTrend,
        },
        stressProbability: getRandomInt(10, 40),
        risingRiskSector: getRandomItem(SETORES),
    };
};