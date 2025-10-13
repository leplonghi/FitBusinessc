import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    ArrowLeft, Building, Users, Activity, BarChart2, AlertTriangle, Search, TrendingDown, X, Edit, Mail, Briefcase, Calendar, Moon, Zap, Smile, ShieldAlert, Filter, UserCheck, BarChartHorizontal, PieChart as PieChartIcon 
} from 'lucide-react';
// Fix: Add BarChart to recharts import to resolve 'BarChart is not defined' error.
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, Bar, BarChart } from 'recharts';
import { Empresa, Funcionario, RiscoNivel, Setor } from '../types';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

// --- HELPER FUNCTIONS & STYLES ---

const getRiscoClass = (risco: RiscoNivel) => {
    switch (risco) {
      case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
};

const PIE_COLORS = ['#E53E3E', '#F6AD55', '#48BB78']; // Alto, Médio, Baixo

// --- MODAL: DETALHES DO FUNCIONÁRIO ---

const FuncionarioDetalheModal: React.FC<{
    funcionario: Funcionario | null;
    onClose: () => void;
}> = ({ funcionario, onClose }) => {
    const { user } = useAuth();
    
    if (!funcionario) return null;

    const canEdit = user?.papel === 'superadmin';

    const { nome, cargo, email, empresaNome, avatarUrl, dataAdmissao, fitScore, risco, historicoFitScore, metricas } = funcionario;

    const metricasData = [
        { subject: 'Sono', value: (metricas.sono / 8) * 100 },
        { subject: 'Estresse', value: 100 - metricas.estresse },
        { subject: 'Humor', value: (metricas.humor / 5) * 100 },
        { subject: 'Energia', value: (metricas.energia / 5) * 100 },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <img src={avatarUrl} alt={nome} className="w-12 h-12 rounded-full" />
                        <div>
                             <h3 className="text-xl font-bold text-gray-800 dark:text-white">{nome}</h3>
                             <p className="text-sm text-fit-gray">{cargo}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {canEdit && (
                            <button className="flex items-center bg-fit-dark-blue text-white px-3 py-1.5 rounded-lg text-sm">
                                <Edit size={14} className="mr-2"/> Editar
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Personal Info & Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-3">
                             <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-2">Informações</h4>
                             <p className="flex items-center text-sm"><Briefcase size={14} className="mr-2 text-fit-gray"/> <strong>Empresa:</strong><span className="ml-2">{empresaNome}</span></p>
                             <p className="flex items-center text-sm"><Mail size={14} className="mr-2 text-fit-gray"/> <strong>Email:</strong><span className="ml-2">{email}</span></p>
                             <p className="flex items-center text-sm"><Calendar size={14} className="mr-2 text-fit-gray"/> <strong>Admissão:</strong><span className="ml-2">{new Date(dataAdmissao).toLocaleDateString('pt-BR')}</span></p>
                        </div>
                         <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            <Card title="FitScore Atual" value={fitScore} icon={<BarChart2 size={20} className="text-fit-dark-blue"/>} />
                            <Card title="Nível de Risco" value={risco} icon={<ShieldAlert size={20} className="text-fit-dark-blue"/>} />
                        </div>
                    </div>
                    
                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white">Evolução do FitScore</h4>
                                <select className="text-xs border-gray-300 rounded-md dark:bg-gray-700">
                                    <option>Últimos 12 meses</option>
                                    <option>Últimos 6 meses</option>
                                </select>
                             </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={historicoFitScore}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                                    <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', { month: 'short' })} tick={{ fontSize: 10 }} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }}/>
                                    <Tooltip />
                                    <Line type="monotone" dataKey="score" name="FitScore" stroke="#0A2342" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Pilares de Bem-estar</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricasData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                    <Radar name={nome} dataKey="value" stroke="#0A2342" fill="#0A2342" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Activity History */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Histórico de Atividades</h4>
                        <p className="text-sm text-center text-fit-gray py-4">Funcionalidade de histórico de participação em programas em desenvolvimento.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- VIEW: DETALHES DA EMPRESA ---

const EmpresaDetalheView: React.FC<{
    empresa: Empresa;
    funcionarios: Funcionario[];
    onBack: () => void;
    showBackButton: boolean;
}> = ({ empresa, funcionarios, onBack, showBackButton }) => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
    
    // Filters State
    const [filters, setFilters] = useState({
        cargo: 'all',
        setor: 'all',
        risco: 'all',
    });

    const uniqueCargos = useMemo(() => [...new Set(funcionarios.map(f => f.cargo))], [funcionarios]);
    const uniqueSetores = useMemo(() => [...new Set(funcionarios.map(f => f.setor))], [funcionarios]);

    const filteredFuncionarios = useMemo(() => {
        return funcionarios.filter(f => {
            const searchMatch = searchTerm === '' || f.nome.toLowerCase().includes(searchTerm.toLowerCase()) || f.email.toLowerCase().includes(searchTerm.toLowerCase());
            const cargoMatch = filters.cargo === 'all' || f.cargo === filters.cargo;
            const setorMatch = filters.setor === 'all' || f.setor === filters.setor;
            const riscoMatch = filters.risco === 'all' || f.risco === filters.risco;
            return searchMatch && cargoMatch && setorMatch && riscoMatch;
        });
    }, [funcionarios, searchTerm, filters]);

    const fitScoreDistribution = useMemo(() => {
        const counts = { 'Alto': 0, 'Médio': 0, 'Baixo': 0 };
        filteredFuncionarios.forEach(f => {
            counts[f.risco]++;
        });
        return [
            { name: 'Alto Risco', value: counts['Alto'] },
            { name: 'Médio Risco', value: counts['Médio'] },
            { name: 'Baixo Risco', value: counts['Baixo'] },
        ];
    }, [filteredFuncionarios]);
    
    const engagementBySector = useMemo(() => {
        const sectors: { [key in Setor]?: { total: number, count: number } } = {};
        filteredFuncionarios.forEach(f => {
             if (!sectors[f.setor]) sectors[f.setor] = { total: 0, count: 0 };
             sectors[f.setor]!.total += f.fitScore; // using fitscore as proxy for engagement
             sectors[f.setor]!.count++;
        });
        return Object.entries(sectors).map(([name, data]) => ({ name, engajamento: Math.round(data.total / data.count) }));
    }, [filteredFuncionarios]);

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    return (
        <>
        <div className="space-y-6">
             {showBackButton && (
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para a lista de empresas
                </button>
             )}

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Building size={40} className="text-fit-dark-blue dark:text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{empresa.nomeEmpresa}</h2>
                         <p className="text-fit-gray mt-1">{empresa.setor} • {empresa.funcionariosAtivos} funcionários</p>
                    </div>
                </div>
            </div>

            {/* Metrics & Charts */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 p-2">Distribuição de FitScore</h3>
                     <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                             <Pie data={fitScoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                                {fitScoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 p-2">Engajamento por Setor</h3>
                    <ResponsiveContainer width="100%" height={200}>
                       <BarChart data={engagementBySector} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                           <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                           <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                           <Tooltip />
                           <Bar dataKey="engajamento" fill="#0A2342" barSize={20} />
                       </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Employee List & Filters */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Painel de Funcionários</h3>
                {/* Filter Bar */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="relative md:col-span-2">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="text" placeholder="Buscar funcionário..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9"/>
                    </div>
                    <select value={filters.cargo} onChange={e => handleFilterChange('cargo', e.target.value)}>
                        <option value="all">Todos os Cargos</option>
                        {uniqueCargos.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                     <select value={filters.risco} onChange={e => handleFilterChange('risco', e.target.value)}>
                        <option value="all">Todos os Riscos</option>
                        <option value="Alto">Alto</option>
                        <option value="Médio">Médio</option>
                        <option value="Baixo">Baixo</option>
                    </select>
                </div>

                {/* Employee Table */}
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left">Nome</th>
                                <th className="px-4 py-2 text-left">Cargo</th>
                                <th className="px-4 py-2 text-center">FitScore</th>
                                <th className="px-4 py-2 text-center">Risco</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFuncionarios.length > 0 ? filteredFuncionarios.map(f => (
                                <tr key={f.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedFuncionario(f)}>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                        <img src={f.avatarUrl} alt={f.nome} className="w-8 h-8 rounded-full" />
                                        {f.nome}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{f.cargo}</td>
                                    <td className="px-4 py-3 text-center font-bold">{f.fitScore}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiscoClass(f.risco)}`}>{f.risco}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">Nenhum funcionário encontrado com os filtros aplicados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <FuncionarioDetalheModal 
            funcionario={selectedFuncionario}
            onClose={() => setSelectedFuncionario(null)}
        />
        </>
    )
}

// --- VIEW: LISTA DE EMPRESAS ---

const EmpresaListView: React.FC<{
    empresas: Empresa[];
    onSelectEmpresa: (id: string) => void;
}> = ({ empresas, onSelectEmpresa }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredEmpresas = useMemo(() => {
        return empresas.filter(e => e.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [empresas, searchTerm]);
    
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Empresas Monitoradas</h2>
                        <p className="text-fit-gray mt-1">Selecione uma empresa para ver detalhes sobre seu bem-estar.</p>
                    </div>
                    <div className="w-full md:w-1/3 relative">
                         <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input type="text" placeholder="Buscar empresa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10"/>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmpresas.map(empresa => (
                    <div 
                        key={empresa.empresaId}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-fit-dark-blue dark:hover:border-fit-orange transition-all cursor-pointer"
                        onClick={() => onSelectEmpresa(empresa.empresaId)}
                    >
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{empresa.nomeEmpresa}</h3>
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-fit-gray">FitScore Médio</span><span className="font-semibold">{empresa.mediaFitScore}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-fit-gray">Alertas</span><span className="font-semibold text-red-500">{empresa.alertasRisco}</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


// Fix: Define props interface to resolve 'Cannot find name 'EmpresasMonitoradasProps'' error.
interface EmpresasMonitoradasProps {
    allEmpresas: Empresa[];
    allFuncionarios: Funcionario[];
}

// --- COMPONENTE PRINCIPAL ---

const EmpresasMonitoradas: React.FC<EmpresasMonitoradasProps> = ({ allEmpresas, allFuncionarios }) => {
    const { user } = useAuth();
    const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const empresasVisiveis = useMemo(() => {
        if (!user) return [];
        if (user.papel === 'superadmin') return allEmpresas;
        if (user.papel === 'Gerente RH' && user.empresaId) {
            return allEmpresas.filter(e => e.empresaId === user.empresaId);
        }
        return [];
    }, [allEmpresas, user]);

    useEffect(() => {
        setIsLoading(true);
        if (user?.papel === 'Gerente RH' && empresasVisiveis.length === 1) {
            setSelectedEmpresaId(empresasVisiveis[0].empresaId);
        } else {
            // Reset selection if user is admin or has no single company
            setSelectedEmpresaId(null);
        }
        setIsLoading(false);
    }, [user, allEmpresas]); // Rerun when user or data changes

    const selectedEmpresa = useMemo(() => {
        return allEmpresas.find(e => e.empresaId === selectedEmpresaId);
    }, [selectedEmpresaId, allEmpresas]);
    
    const funcionariosDaEmpresa = useMemo(() => {
        if (!selectedEmpresaId) return [];
        return allFuncionarios.filter(f => f.empresaId === selectedEmpresaId);
    }, [selectedEmpresaId, allFuncionarios]);
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    // Determine which view to render
    if (selectedEmpresa) {
        return (
            <EmpresaDetalheView 
                empresa={selectedEmpresa} 
                funcionarios={funcionariosDaEmpresa} 
                onBack={() => setSelectedEmpresaId(null)}
                showBackButton={user?.papel === 'superadmin'}
            />
        )
    }
    
    // Default to list view for superadmin
    return <EmpresaListView empresas={empresasVisiveis} onSelectEmpresa={setSelectedEmpresaId} />
}

export default EmpresasMonitoradas;