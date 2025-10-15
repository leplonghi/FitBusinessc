import { Funcionario, Empresa, RiscoNivel, Setor, AuditLog, Papel, PlanoExercicio, Meta, MetaStatus } from '../types';

const NOMES = ['Ana Lima', 'Bruno Costa', 'Carlos Dias', 'Daniela Rocha', 'Eduardo Melo', 'Fernanda Alves', 'Gustavo Borges', 'Helena Faria', 'Igor Ramos', 'Juliana Nunes'];
const SOBRENOMES = ['Silva', 'Pereira', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Gomes', 'Martins'];
const CARGOS_TECNOLOGIA = ['Engenheiro de Software', 'Analista de Dados', 'Designer UX/UI', 'Gerente de Produto', 'DevOps'];
const CARGOS_INDUSTRIA = ['Operador de Máquinas', 'Engenheiro de Produção', 'Técnico de Manutenção', 'Supervisor de Qualidade'];
const CARGOS_LOGISTICA = ['Analista de Logística', 'Coordenador de Transporte', 'Gerente de Armazém'];
const CARGOS_VAREJO = ['Gerente de Loja', 'Vendedor', 'Analista de Estoque'];
const CARGOS_SAUDE = ['Enfermeiro(a)', 'Analista Clínico', 'Coordenador de Atendimento'];

const PLANOS_EXERCICIO: PlanoExercicio[] = [
    { nome: 'Caminhada Diária', meta: '10.000 passos por dia', frequencia: 'Diariamente', progresso: 0 },
    { nome: 'Ginástica Laboral', meta: 'Participar de 3 sessões', frequencia: '3x por semana', progresso: 0 },
    { nome: 'Corrida Leve', meta: 'Correr 5km no total', frequencia: '2x por semana', progresso: 0 },
    { nome: 'Yoga e Meditação', meta: 'Acumular 60 minutos', frequencia: '4x por semana', progresso: 0 },
    { nome: 'Desafio de Hidratação', meta: 'Beber 2L de água por dia', frequencia: 'Diariamente', progresso: 0 },
];

const METAS_BASE = [
    { descricao: 'Completar o curso de Gestão de Estresse', status: 'Em Progresso' },
    { descricao: 'Atingir 10.000 passos diários por 2 semanas', status: 'Não Iniciada' },
    { descricao: 'Melhorar a média de sono para 7h por noite', status: 'Concluída' },
    { descricao: 'Participar de 5 sessões de ginástica laboral', status: 'Em Progresso' },
    { descricao: 'Reduzir o tempo de tela após as 22h', status: 'Não Iniciada' },
];


const EMPRESAS_BASE: Omit<Empresa, 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco' | 'irsHistory'>[] = [
    { 
        empresaId: 'e1', nomeEmpresa: 'InovaTech Soluções', status: 'Ativa', irs: 85, website: 'https://inova.tech',
        cnpj: '33.072.207/0001-60', setor: 'Tecnologia', cultura: 'Ágil e Colaborativa', dataCriacao: '2018-03-15',
        endereco: { rua: 'Av. das Nações Unidas, 12901', bairro: 'Brooklin Paulista', cidade: 'São Paulo, SP', cep: '04578-910' },
        contato: { email: 'contato@inova.tech', telefone: '(11) 98765-4321' }
    },
    { 
        empresaId: 'e2', nomeEmpresa: 'Manufatura Forte', status: 'Ativa', irs: 65, website: 'https://manufaturaforte.com.br',
        cnpj: '44.182.318/0001-71', setor: 'Indústria', cultura: 'Focada em Segurança', dataCriacao: '2010-07-22',
        endereco: { rua: 'Rua da Indústria, 500', bairro: 'Distrito Industrial', cidade: 'Joinville, SC', cep: '89219-500' },
        contato: { email: 'rh@manufaturaforte.com.br', telefone: '(47) 91234-5678' }
    },
    { 
        empresaId: 'e3', nomeEmpresa: 'LogiExpress Brasil', status: 'Ativa', irs: 48,
        cnpj: '55.293.429/0001-82', setor: 'Logística', cultura: 'Orientada a Resultados', dataCriacao: '2015-11-01',
        endereco: { rua: 'Rod. Anhanguera, km 100', bairro: 'Jardim Eulina', cidade: 'Campinas, SP', cep: '13063-400' },
        contato: { email: 'operacoes@logiexpress.com', telefone: '(19) 95555-4444' }
    },
    { 
        empresaId: 'e4', nomeEmpresa: 'Varejo Ponto Certo', status: 'Inativa', irs: 72,
        cnpj: '66.304.530/0001-93', setor: 'Varejo', cultura: 'Foco no Cliente', dataCriacao: '2012-01-30',
        endereco: { rua: 'Rua Sete de Setembro, 1234', bairro: 'Centro', cidade: 'Curitiba, PR', cep: '80010-000' },
        contato: { email: 'suporte@varejopontocerto.com', telefone: '(41) 93333-2222' }
    },
    { 
        empresaId: 'e5', nomeEmpresa: 'Clínica Bem Viver', status: 'Ativa', irs: 92, website: 'https://clinicabemviver.med.br',
        cnpj: '77.415.641/0001-04', setor: 'Saúde', cultura: 'Cuidado e Empatia', dataCriacao: '2020-05-10',
        endereco: { rua: 'Av. Angélica, 2578', bairro: 'Consolação', cidade: 'São Paulo, SP', cep: '01228-200' },
        contato: { email: 'adm@clinicabemviver.med.br', telefone: '(11) 97777-8888' }
    },
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
        const setor = empresaBase.setor;
        
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

            const planoExercicio: PlanoExercicio = {
                ...getRandomItem(PLANOS_EXERCICIO),
                progresso: getRandomInt(0, 100),
            };

            const numMetas = getRandomInt(1, 3);
            const metas: Meta[] = [];
            for (let k = 0; k < numMetas; k++) {
                const metaBase = getRandomItem(METAS_BASE);
                const dataAlvo = new Date();
                dataAlvo.setDate(dataAlvo.getDate() + getRandomInt(15, 60));
                metas.push({
                    id: `m${funcionarioId}-${k}`,
                    descricao: metaBase.descricao,
                    status: metaBase.status as MetaStatus,
                    dataAlvo: dataAlvo.toISOString().split('T')[0],
                });
            }

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
                },
                planoExercicio,
                metas,
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