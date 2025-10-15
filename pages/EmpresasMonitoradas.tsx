import React, { useState, useMemo, useEffect } from 'react';
import { 
    ArrowLeft, Building, Users, Search, X, Mail, Briefcase, Calendar, ShieldAlert, Target, BarChart2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Bar, BarChart as RechartsBarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Empresa, Funcionario, RiscoNivel, Setor } from '../types';
import { useAuth } from '../hooks/useAuth.tsx';
import { useTheme } from '../hooks/useTheme';
import Spinner from '../components/ui/Spinner';
import FuncionarioDetalheModal from '../components/modals/FuncionarioDetalheModal';

// --- HELPER FUNCTIONS & STYLES ---

const getRiscoClass = (risco: RiscoNivel) => {
    switch (risco) {
      case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
};

const PIE_COLORS = ['#E53E3E', '#F6AD55', '#48BB78']; // Alto, Médio, Baixo

// --- VIEW: DETALHES DA EMPRESA ---

const EmpresaDetalheView: React.FC<{
    empresa: Empresa;
    funcionarios: Funcionario[];
    onBack: () => void;
    showBackButton: boolean;
    setAllFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>;
}> = ({ empresa, funcionarios, onBack, showBackButton, setAllFuncionarios }) => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const tooltipBackgroundColor = theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
    
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
             sectors[f.setor]!.total += f.fitScore;
             sectors[f.setor]!.count++;
        });
        return Object.entries(sectors).map(([name, data]) => ({ name, engajamento: Math.round(data.total / data.count) }));
    }, [filteredFuncionarios]);
    
    const currentSelectedFuncionarioData = useMemo(() => {
        if (!selectedFuncionario) return null;
        return funcionarios.find(f => f.id === selectedFuncionario.id) || null;
    }, [selectedFuncionario, funcionarios]);

    return (
        <>
        <div className="space-y-6">
             {showBackButton && (
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para a lista de empresas
                </button>
             )}

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

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 flex flex-col">
                    <h3 className="font-semibold text-gray-800 dark:text-white p-2">Distribuição de Risco</h3>
                    <div className="flex-grow w-full h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={fitScoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3}>
                                    {fitScoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, backdropFilter: 'blur(5px)', border: `1px solid ${tooltipBorderColor}`, borderRadius: '0.75rem' }} />
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
                       <RechartsBarChart data={engagementBySector} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                           <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: tickColor }} />
                           <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: tickColor }} />
                           <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, backdropFilter: 'blur(5px)', border: `1px solid ${tooltipBorderColor}`, borderRadius: '0.75rem' }} cursor={{ fill: 'rgba(242, 244, 248, 0.5)' }}/>
                           <Bar dataKey="engajamento" name="Engajamento" fill="#0A2342" />
                       </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Lista de Funcionários</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Cargo</th>
                                <th scope="col" className="px-6 py-3">FitScore</th>
                                <th scope="col" className="px-6 py-3">Risco</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFuncionarios.map(f => (
                                <tr key={f.id} onClick={() => setSelectedFuncionario(f)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{f.nome}</td>
                                    <td className="px-6 py-4">{f.cargo}</td>
                                    <td className="px-6 py-4">{f.fitScore}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiscoClass(f.risco)}`}>{f.risco}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <FuncionarioDetalheModal 
            funcionario={currentSelectedFuncionarioData} 
            onClose={() => setSelectedFuncionario(null)} 
            setAllFuncionarios={setAllFuncionarios}
        />
        </>
    );
};

// --- VIEW: LISTA DE EMPRESAS ---

const EmpresaListView: React.FC<{
    empresas: Empresa[];
    onSelectEmpresa: (empresa: Empresa) => void;
}> = ({ empresas, onSelectEmpresa }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Empresas Monitoradas</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Empresa</th>
                            <th scope="col" className="px-6 py-3">Funcionários</th>
                            <th scope="col" className="px-6 py-3">FitScore Médio</th>
                            <th scope="col" className="px-6 py-3">Alertas de Risco</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map(empresa => (
                            <tr key={empresa.empresaId} onClick={() => onSelectEmpresa(empresa)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{empresa.nomeEmpresa}</td>
                                <td className="px-6 py-4">{empresa.funcionariosAtivos}</td>
                                <td className="px-6 py-4">{empresa.mediaFitScore}</td>
                                <td className="px-6 py-4">{empresa.alertasRisco}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface EmpresasMonitoradasProps {
    allEmpresas: Empresa[];
    setAllEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
    allFuncionarios: Funcionario[];
    setAllFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>;
}

export const EmpresasMonitoradas: React.FC<EmpresasMonitoradasProps> = ({ allEmpresas, allFuncionarios, setAllFuncionarios }) => {
    const { user } = useAuth();
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    useEffect(() => {
        if (user?.papel === 'Gerente RH' && user.empresaId) {
            const userEmpresa = allEmpresas.find(e => e.empresaId === user.empresaId);
            setSelectedEmpresa(userEmpresa || null);
        } else if (user?.papel === 'superadmin') {
            setSelectedEmpresa(null); // Reset when navigating as superadmin
        }
    }, [user, allEmpresas]);

    if (!allEmpresas.length || !allFuncionarios.length) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (selectedEmpresa) {
        const empresaFuncionarios = allFuncionarios.filter(f => f.empresaId === selectedEmpresa.empresaId);
        return (
            <EmpresaDetalheView
                empresa={selectedEmpresa}
                funcionarios={empresaFuncionarios}
                onBack={() => setSelectedEmpresa(null)}
                showBackButton={user?.papel === 'superadmin'}
                setAllFuncionarios={setAllFuncionarios}
            />
        );
    }

    if (user?.papel === 'superadmin') {
        return <EmpresaListView empresas={allEmpresas} onSelectEmpresa={setSelectedEmpresa} />;
    }

    return (
        <div className="text-center p-8">
            <h3 className="text-lg font-semibold">Nenhuma empresa selecionada.</h3>
            <p className="text-fit-gray">Se você é um Gerente de RH, seus dados da empresa podem não estar disponíveis.</p>
        </div>
    );
};