import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    ArrowLeft, Building, Users, Activity, BarChart2, AlertTriangle, Search, TrendingDown, X, Edit, Mail, Briefcase, Calendar, Moon, Zap, Smile, ShieldAlert, Filter, UserCheck, BarChartHorizontal, PieChart as PieChartIcon, Target 
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

    const { nome, cargo, email, empresaNome, avatarUrl, dataAdmissao, fitScore, risco, historicoFitScore, metricas, planoExercicio } = funcionario;

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

                    {/* Exercise Plan */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center"><Target size={18} className="mr-2 text-fit-dark-blue"/> Plano de Atividades</h4>
                        <div className="space-y-2">
                             <p className="text-sm"><strong>Plano:</strong> {planoExercicio.nome} ({planoExercicio.frequencia})</p>
                             <p className="text-sm"><strong>Meta Semanal:</strong> {planoExercicio.meta}</p>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Progresso</span>
                                    <span>{planoExercicio.progresso}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-fit-green h-2.5 rounded-full" style={{ width: `${planoExercicio.progresso}%` }}></div>
                                </div>
                             </div>
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 flex flex-col">
                    <h3 className="font-semibold text-gray-800 dark:text-white p-2">Distribuição de Risco</h3>
                    <div className="flex-grow w-full h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={fitScoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3}>
                                    {fitScoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)', border: '1px solid #E2E8F0', borderRadius: '0.75rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="text-center">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{filteredFuncionarios.length}</p>
                                <p className="text-xs text-fit-gray">Funcionários</p>
                             </div>
                        </div>
                    </div>
                    <div className="flex justify-center pt-2 space-x-4">
                      {fitScoreDistribution.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center text-xs text-fit-gray">
                          <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                          <span>{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white p-2">Engajamento por Setor</h3>
                    <ResponsiveContainer width="100%" height={240}>
                       <BarChart data={engagementBySector} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                           <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#8A94A6' }} />
                           <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: '#8A94A6' }} />
                           <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)', border: '1px solid #E2E8F0', borderRadius: '0.75rem' }} cursor={{ fill: 'rgba(242, 244, 248, 0.5)' }}/>
                           <Bar dataKey