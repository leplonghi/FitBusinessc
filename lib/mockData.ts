import { Empresa, Funcionario, AuditLog, HistoricoFitScore, RiscoNivel } from '../types.ts';

const generateHistoricoFitScore = (baseScore: number): HistoricoFitScore[] => {
  const historico: HistoricoFitScore[] = [];
  let currentScore = baseScore;
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    currentScore += Math.floor(Math.random() * 11) - 5; // Fluctuate by -5 to +5
    currentScore = Math.max(0, Math.min(100, currentScore)); // Clamp between 0 and 100
    historico.push({
      date: date.toISOString().split('T')[0],
      score: currentScore,
    });
  }
  return historico;
};


const MOCK_EMPRESAS: Omit<Empresa, 'empresaId' | 'totalFuncionarios' | 'fitScoreMedio'>[] = [
    {
        nomeEmpresa: "InovaTech Soluções",
        cnpj: "11.222.333/0001-44",
        setor: "Tecnologia",
        status: "Ativa",
        riscoMedio: "Baixo",
        irs: 82,
        endereco: { rua: "Av. Inovação, 123", bairro: "Tecnoparque", cidade: "São Paulo, SP", cep: "01234-567" },
        contato: { email: "contato@inovatech.com", telefone: "(11) 98765-4321" },
    },
    {
        nomeEmpresa: "Manufatura Forte",
        cnpj: "55.666.777/0001-88",
        setor: "Indústria",
        status: "Ativa",
        riscoMedio: "Médio",
        irs: 65,
        endereco: { rua: "Rua da Produção, 456", bairro: "Distrito Industrial", cidade: "Joinville, SC", cep: "89200-000" },
        contato: { email: "contato@manufaturaforte.com.br", telefone: "(47) 91234-5678" },
    },
    {
        nomeEmpresa: "LogiExpress Brasil",
        cnpj: "99.888.777/0001-66",
        setor: "Logística",
        status: "Ativa",
        riscoMedio: "Alto",
        irs: 48,
        endereco: { rua: "Rod. Principal, Km 10", bairro: "Centro Logístico", cidade: "Cajamar, SP", cep: "07750-000" },
        contato: { email: "operacoes@logiexpress.com", telefone: "(11) 95555-1234" },
    },
    {
        nomeEmpresa: "Varejo Total",
        cnpj: "12.345.678/0001-99",
        setor: "Varejo",
        status: "Inativa",
        riscoMedio: "Baixo",
        irs: 77,
        endereco: { rua: "R. Comercial, 789", bairro: "Centro", cidade: "Rio de Janeiro, RJ", cep: "20000-000" },
        contato: { email: "sac@varejototal.com", telefone: "(21) 98888-4444" },
    },
     {
        nomeEmpresa: "Clínica Bem Viver",
        cnpj: "34.567.890/0001-12",
        setor: "Saúde",
        status: "Ativa",
        riscoMedio: "Médio",
        irs: 71,
        endereco: { rua: "Av. Saúde, 101", bairro: "Jardins", cidade: "Belo Horizonte, MG", cep: "30100-000" },
        contato: { email: "adm@clinicabemviver.med.br", telefone: "(31) 97777-3333" },
    },
];

const MOCK_FUNCIONARIOS_POOL: { nome: string; cargo: string; setor: string; fitScore: number; risco: RiscoNivel; sono: number; estresse: number; humor: number; energia: number; dataNascimento: string; genero: 'Masculino' | 'Feminino'; peso: number; altura: number; }[] = [
    // InovaTech
    { nome: 'Carlos Andrade', cargo: 'Engenheiro de Software Sênior', setor: 'Tecnologia', fitScore: 88, risco: 'Baixo', sono: 7.5, estresse: 25, humor: 5, energia: 5, dataNascimento: '1988-05-20', genero: 'Masculino', peso: 82, altura: 180 },
    { nome: 'Beatriz Lima', cargo: 'Designer de Produto', setor: 'Tecnologia', fitScore: 92, risco: 'Baixo', sono: 8, estresse: 20, humor: 5, energia: 5, dataNascimento: '1992-11-15', genero: 'Feminino', peso: 65, altura: 168 },
    { nome: 'Ricardo Souza', cargo: 'Gerente de Projetos', setor: 'Tecnologia', fitScore: 75, risco: 'Médio', sono: 6.5, estresse: 60, humor: 3, energia: 3, dataNascimento: '1985-02-10', genero: 'Masculino', peso: 88, altura: 175 },
    // Manufatura
    { nome: 'Fernanda Costa', cargo: 'Operadora de Máquinas', setor: 'Indústria', fitScore: 65, risco: 'Médio', sono: 7, estresse: 55, humor: 4, energia: 4, dataNascimento: '1995-07-30', genero: 'Feminino', peso: 70, altura: 170 },
    { nome: 'Jorge Martins', cargo: 'Supervisor de Produção', setor: 'Indústria', fitScore: 58, risco: 'Médio', sono: 6, estresse: 70, humor: 3, energia: 3, dataNascimento: '1980-01-25', genero: 'Masculino', peso: 95, altura: 182 },
    { nome: 'Luiza Pereira', cargo: 'Analista de Qualidade', setor: 'Indústria', fitScore: 72, risco: 'Baixo', sono: 7, estresse: 40, humor: 4, energia: 4, dataNascimento: '1998-09-05', genero: 'Feminino', peso: 68, altura: 165 },
    // LogiExpress
    { nome: 'Marcos Almeida', cargo: 'Motorista de Entrega', setor: 'Logística', fitScore: 45, risco: 'Alto', sono: 5.5, estresse: 80, humor: 2, energia: 2, dataNascimento: '1990-03-12', genero: 'Masculino', peso: 85, altura: 178 },
    { nome: 'Patrícia Rocha', cargo: 'Coordenadora de Logística', setor: 'Logística', fitScore: 52, risco: 'Alto', sono: 6, estresse: 75, humor: 3, energia: 3, dataNascimento: '1987-06-22', genero: 'Feminino', peso: 72, altura: 173 },
    { nome: 'Thiago Nunes', cargo: 'Assistente de Armazém', setor: 'Logística', fitScore: 61, risco: 'Médio', sono: 6.5, estresse: 65, humor: 4, energia: 4, dataNascimento: '1999-12-01', genero: 'Masculino', peso: 78, altura: 176 },
    // Varejo Total
    { nome: 'Vanessa Dias', cargo: 'Vendedora', setor: 'Varejo', fitScore: 80, risco: 'Baixo', sono: 7, estresse: 30, humor: 5, energia: 4, dataNascimento: '1993-04-18', genero: 'Feminino', peso: 62, altura: 169 },
    // Clínica Bem Viver
    { nome: 'Dr. Roberto Neves', cargo: 'Médico Clínico', setor: 'Saúde', fitScore: 68, risco: 'Médio', sono: 6.5, estresse: 60, humor: 4, energia: 4, dataNascimento: '1975-10-08', genero: 'Masculino', peso: 90, altura: 185 },
    { nome: 'Juliana Faria', cargo: 'Enfermeira Chefe', setor: 'Saúde', fitScore: 55, risco: 'Alto', sono: 6, estresse: 75, humor: 3, energia: 3, dataNascimento: '1989-08-14', genero: 'Feminino', peso: 67, altura: 166 },
];

export const generateMockData = (): { empresas: Empresa[], funcionarios: Funcionario[] } => {
    const empresas: Empresa[] = [];
    const funcionarios: Funcionario[] = [];

    MOCK_EMPRESAS.forEach((empresaBase, index) => {
        const empresaId = `emp-${index + 1}`;
        const funcionariosDaEmpresa: Funcionario[] = [];
        const pool = MOCK_FUNCIONARIOS_POOL.filter(p => p.setor === empresaBase.setor);

        pool.forEach((funcBase, funcIndex) => {
            const id = `func-${empresaId}-${funcIndex + 1}`;
            const email = `${funcBase.nome.split(' ')[0].toLowerCase()}.${funcBase.nome.split(' ')[1].toLowerCase()}@${empresaBase.nomeEmpresa.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/gi, '')}.com`;
            const funcionario: Funcionario = {
                id,
                nome: funcBase.nome,
                email,
                cargo: funcBase.cargo,
                setor: empresaBase.setor,
                empresaId,
                empresaNome: empresaBase.nomeEmpresa,
                avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
                dataAdmissao: "2022-08-15",
                fitScore: funcBase.fitScore,
                risco: funcBase.risco,
                historicoFitScore: generateHistoricoFitScore(funcBase.fitScore),
                metricas: { sono: funcBase.sono, estresse: funcBase.estresse, humor: funcBase.humor, energia: funcBase.energia },
                planoExercicio: { nome: 'Caminhada Diária', meta: '10.000 passos/dia', frequencia: 'Diária', progresso: Math.floor(Math.random() * 101) },
                metas: [
                    { id: 'm-1', descricao: 'Atingir 10.000 passos por dia', dataAlvo: '2024-12-31', status: 'Em Progresso' }
                ],
                dataNascimento: funcBase.dataNascimento,
                genero: funcBase.genero,
                peso: funcBase.peso,
                altura: funcBase.altura,
            };
            funcionariosDaEmpresa.push(funcionario);
            funcionarios.push(funcionario);
        });

        const fitScoreMedio = Math.round(funcionariosDaEmpresa.reduce((acc, f) => acc + f.fitScore, 0) / funcionariosDaEmpresa.length) || 0;

        empresas.push({
            ...empresaBase,
            empresaId,
            totalFuncionarios: funcionariosDaEmpresa.length,
            fitScoreMedio,
        });
    });

    return { empresas, funcionarios };
};


export const generateMockAuditLogs = (): AuditLog[] => {
    const actions = [
        "visualizou_dashboard", "editou_perfil_funcionario", "adicionou_empresa",
        "removeu_funcionario", "gerou_relatorio", "alterou_status_empresa"
    ];

    const users = [
        { id: 'user-admin-1', name: 'Alice Admin' },
        { id: 'user-rh-2', name: 'Bruno RH' }
    ];

    const { empresas, funcionarios } = generateMockData();

    const targets = [
        ...empresas.map(e => ({ type: 'empresa' as const, id: e.empresaId, name: e.nomeEmpresa })),
        ...funcionarios.map(f => ({ type: 'funcionario' as const, id: f.id, name: f.nome }))
    ];

    const logs: AuditLog[] = [];

    for (let i = 0; i < 50; i++) {
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24));

        logs.push({
            id: `log-${i + 1}`,
            timestamp: timestamp.toISOString(),
            user: users[Math.floor(Math.random() * users.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            target: targets[Math.floor(Math.random() * targets.length)],
        });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};