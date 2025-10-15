import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Briefcase, Calendar, BarChart2, TrendingDown, Moon, Zap, Smile, ShieldAlert, Flag, Plus, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { RiscoNivel, MetaStatus, Funcionario, Meta } from '../types';
import { useAuth } from '../hooks/useAuth.tsx';
import MetaModal from '../components/modals/MetaModal';

const GoalStatusBadge: React.FC<{ status: MetaStatus }> = ({ status }) => {
  const statusClasses = {
    'Não Iniciada': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Em Progresso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Concluída': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

interface FuncionarioDetalheProps {
    allFuncionarios: Funcionario[];
    setAllFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>;
}

const FuncionarioDetalhe: React.FC<FuncionarioDetalheProps> = ({ allFuncionarios, setAllFuncionarios }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const funcionario = id ? allFuncionarios.find(f => f.id === id) : undefined;

    const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
    const [metaToEdit, setMetaToEdit] = useState<Meta | null>(null);

    const canEdit = user && ['superadmin', 'Admin', 'Gerente RH'].includes(user.papel);
    const isOwnProfile = user?.id === funcionario?.id;
    
    const handleOpenAddMetaModal = () => {
        setMetaToEdit(null);
        setIsMetaModalOpen(true);
    };

    const handleOpenEditMetaModal = (meta: Meta) => {
        setMetaToEdit(meta);
        setIsMetaModalOpen(true);
    };

    const handleSaveMeta = (metaData: Omit<Meta, 'id'>) => {
        if (!funcionario) return;
        const updatedMetas = metaToEdit
            ? funcionario.metas.map(m => m.id === metaToEdit.id ? { ...m, ...metaData } : m)
            : [...funcionario.metas, { ...metaData, id: `m-${Date.now()}` }];
        
        const updatedFuncionario = { ...funcionario, metas: updatedMetas };
        setAllFuncionarios(prev => prev.map(f => f.id === funcionario.id ? updatedFuncionario : f));
        setIsMetaModalOpen(false);
    };

    const handleDeleteMeta = (metaId: string) => {
        if (!funcionario) return;
        if (window.confirm("Tem certeza que deseja excluir esta meta?")) {
            const updatedMetas = funcionario.metas.filter(m => m.id !== metaId);
            const updatedFuncionario = { ...funcionario, metas: updatedMetas };
            setAllFuncionarios(prev => prev.map(f => f.id === funcionario.id ? updatedFuncionario : f));
        }
    };

    if (!funcionario) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    const { nome, cargo, email, empresaNome, avatarUrl, dataAdmissao, fitScore, risco, historicoFitScore, metricas, metas } = funcionario;
    
    const getRiscoClass = (riscoNivel: RiscoNivel) => {
        switch (riscoNivel) {
            case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-50 dark:text-red-300';
            case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-50 dark:text-yellow-300';
            default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-300';
        }
    };

    const metricasData = [
        { subject: 'Sono', value: (metricas.sono / 8) * 100, fullMark: 100 },
        { subject: 'Estresse', value: 100 - metricas.estresse, fullMark: 100 },
        { subject: 'Humor', value: (metricas.humor / 5) * 100, fullMark: 100 },
        { subject: 'Energia', value: (metricas.energia / 5) * 100, fullMark: 100 },
    ];
    
    return (
        <>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar
                </button>
                 {canEdit && (
                    <button className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                        <Edit size={14} className="mr-2" />
                        Editar Perfil
                    </button>
                 )}
            </div>

            {user?.papel === 'Funcionário' && isOwnProfile && (
                 <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-md" role="alert">
                    <div className="flex items-center">
                        <ShieldAlert size={20} className="mr-3" />
                        <div>
                            <p className="font-bold">Modo de Consulta</p>
                            <p className="text-sm">Apenas equipes autorizadas podem alterar seus dados — esta área é apenas para consulta.</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img src={avatarUrl} alt={nome} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700" />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{nome}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiscoClass(risco)}`}>{risco}</span>
                    </div>
                    <p className="text-fit-gray mt-1">{cargo}</p>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />{empresaNome}</span>
                        <span className="flex items-center"><Mail size={14} className="mr-1.5" />{email}</span>
                        <span className="flex items-center"><Calendar size={14} className="mr-1.5" />Admissão: {new Date(dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <Flag size={20} className="mr-3 text-fit-dark-blue" /> Metas Individuais
                    </h3>
                    {canEdit && (
                        <button onClick={handleOpenAddMetaModal} className="flex items-center bg-fit-dark-blue text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                            <Plus size={14} className="mr-2" /> Adicionar Meta
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Descrição da Meta</th>
                                <th scope="col" className="px-6 py-3">Data Alvo</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                {canEdit && <th scope="col" className="px-6 py-3 text-right">Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {metas.map(meta => (
                                <tr key={meta.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{meta.descricao}</td>
                                    <td className="px-6 py-4">{new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><GoalStatusBadge status={meta.status} /></td>
                                    {canEdit && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-4">
                                                <button onClick={() => handleOpenEditMetaModal(meta)} className="text-fit-gray hover:text-fit-dark-blue"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteMeta(meta.id)} className="text-fit-gray hover:text-fit-red"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1">
                    <Card title="FitScore Atual" value={fitScore} icon={<BarChart2 className="text-fit-dark-blue" />} className="h-full" />
                 </div>
                 <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card title="Sono (última noite)" value={`${metricas.sono}h`} icon={<Moon className="text-fit-dark-blue" />} change={metricas.sono < 6 ? 'Abaixo do ideal' : 'Bom'} changeType={metricas.sono < 6 ? "negative" : "positive"} />
                    <Card title="Nível de Estresse" value={`${metricas.estresse}%`} icon={<TrendingDown className="text-fit-dark-blue" />} change={metricas.estresse > 60 ? 'Alto' : 'Controlado'} changeType={metricas.estresse > 60 ? "negative" : "positive"}/>
                    <Card title="Nível de Energia" value={`${metricas.energia}/5`} icon={<Zap className="text-fit-dark-blue" />} change={metricas.energia < 3 ? 'Baixo' : 'Bom'} changeType={metricas.energia < 3 ? "negative" : "positive"}/>
                    <Card title="Humor" value={`${metricas.humor}/5`} icon={<Smile className="text-fit-dark-blue" />} change={metricas.humor < 3 ? 'Baixo' : 'Bom'} changeType={metricas.humor < 3 ? "negative" : "positive"}/>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Evolução do FitScore (Últimos 12 meses)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={historicoFitScore} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', { month: 'short' })} tick={{ fill: '#8A94A6', fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#8A94A6', fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="score" name="FitScore" stroke="#0A2342" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pilares de Bem-estar</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricasData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={nome} dataKey="value" stroke="#0A2342" fill="#0A2342" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        <MetaModal 
            isOpen={isMetaModalOpen}
            onClose={() => setIsMetaModalOpen(false)}
            onSave={handleSaveMeta}
            metaToEdit={metaToEdit}
        />
        </>
    );
};

export default FuncionarioDetalhe;