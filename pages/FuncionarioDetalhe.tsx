import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Briefcase, Calendar, BarChart2, TrendingDown, Moon, Zap, Smile, ShieldAlert, Flag, Plus, Trash2, Activity, AlertCircle } from 'lucide-react';
import { LineChart as RechartsLineChart, Line as RechartsLine, XAxis as RechartsXAxis, YAxis as RechartsYAxis, CartesianGrid as RechartsCartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid as RechartsPolarGrid, PolarAngleAxis as RechartsPolarAngleAxis, PolarRadiusAxis as RechartsPolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import Card from '../components/ui/Card.tsx';
import Spinner from '../components/ui/Spinner.tsx';
// FIX: Add .ts extension
import { RiscoNivel, MetaStatus, Meta } from '../types.ts';
import MetaModal from '../components/modals/MetaModal.tsx';
import { useTheme } from '../hooks/useTheme.tsx';
// FIX: Add .tsx extension
import { useData } from '../hooks/useData.tsx';
import ConfirmationModal from '../components/ui/ConfirmationModal.tsx';
import { getRiscoClass } from '../lib/utils.ts';

const GoalStatusBadge: React.FC<{ status: MetaStatus }> = ({ status }) => {
  const statusClasses = {
    'Não Iniciada': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Em Progresso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200',
    'Concluída': 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const FuncionarioDetalhe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getFuncionarioById, updateFuncionario, loading } = useData();
    const funcionario = id ? getFuncionarioById(id) : undefined;

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';

    const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
    const [metaToEdit, setMetaToEdit] = useState<Meta | null>(null);
    const [metaToDelete, setMetaToDelete] = useState<string | null>(null);
    
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
        
        updateFuncionario({ ...funcionario, metas: updatedMetas });
        setIsMetaModalOpen(false);
    };

    const handleDeleteMeta = () => {
        if (!funcionario || !metaToDelete) return;
        const updatedMetas = funcionario.metas.filter(m => m.id !== metaToDelete);
        updateFuncionario({ ...funcionario, metas: updatedMetas });
        setMetaToDelete(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (!funcionario) {
        return <div className="text-center p-8">Funcionário não encontrado.</div>;
    }

    // FIX: Data integrity check to prevent crashes from malformed/incomplete data
    const isDataComplete = funcionario && funcionario.metricas && funcionario.planoExercicio && funcionario.historicoFitScore && funcionario.metas;

    if (!isDataComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <h2 className="mt-4 text-xl font-bold text-red-700 dark:text-red-300">Erro ao Carregar Dados</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Os dados para este funcionário estão incompletos ou corrompidos e não podem ser exibidos. 
                    Por favor, verifique o cadastro ou contate o suporte.
                </p>
                <button onClick={() => navigate(-1)} className="btn btn-secondary mt-6">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar
                </button>
            </div>
        );
    }

    const { nome, cargo, email, empresaNome, avatarUrl, dataAdmissao, fitScore, risco, historicoFitScore, metricas, metas, planoExercicio } = funcionario;

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
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar
                </button>
                <button className="btn btn-primary">
                    <Edit size={14} className="mr-2" />
                    Editar Perfil
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img src={avatarUrl} alt={nome} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700" />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{nome}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiscoClass(risco)}`}>{risco}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{cargo}</p>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />{empresaNome}</span>
                        <span className="flex items-center"><Mail size={14} className="mr-1.5" />{email}</span>
                        <span className="flex items-center"><Calendar size={14} className="mr-1.5" />Admissão: {new Date(dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Activity size={20} className="mr-3 text-fit-dark-blue" /> Plano de Atividades
                </h3>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div><strong>Plano:</strong> {planoExercicio.nome}</div>
                        <div><strong>Meta:</strong> {planoExercicio.meta}</div>
                        <div><strong>Frequência:</strong> {planoExercicio.frequencia}</div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1 font-medium">
                            <span>Progresso</span>
                            <span>{planoExercicio.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-fit-green h-2.5 rounded-full" style={{ width: `${planoExercicio.progresso}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <Flag size={20} className="mr-3 text-fit-dark-blue" /> Metas Individuais
                    </h3>
                    <button onClick={handleOpenAddMetaModal} className="btn btn-primary">
                        <Plus size={14} className="mr-2" /> Adicionar Meta
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Descrição da Meta</th>
                                <th scope="col" className="px-6 py-3">Data Alvo</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metas.map(meta => (
                                <tr key={meta.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{meta.descricao}</td>
                                    <td className="px-6 py-4">{new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><GoalStatusBadge status={meta.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleOpenEditMetaModal(meta)} className="btn-icon" aria-label="Editar meta"><Edit size={16} /></button>
                                            <button onClick={() => setMetaToDelete(meta.id)} className="btn-icon btn-icon-danger" aria-label="Excluir meta"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
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
                        <RechartsLineChart data={historicoFitScore} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <RechartsCartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <RechartsXAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', { month: 'short' })} tick={{ fill: tickColor, fontSize: 12 }} />
                            <RechartsYAxis domain={[0, 100]} tick={{ fill: tickColor, fontSize: 12 }} />
                            <RechartsTooltip />
                            <RechartsLegend wrapperStyle={{ color: tickColor }} />
                            <RechartsLine type="monotone" dataKey="score" name="FitScore" stroke="#0A2342" strokeWidth={2} dot={{ r: 2 }} />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pilares de Bem-estar</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={metricasData}>
                            <RechartsPolarGrid />
                            <RechartsPolarAngleAxis dataKey="subject" tick={{ fill: tickColor, fontSize: 12 }} />
                            <RechartsPolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <RechartsRadar name={nome} dataKey="value" stroke="#0A2342" fill="#0A2342" fillOpacity={0.6} />
                        </RechartsRadarChart>
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
        <ConfirmationModal
            isOpen={!!metaToDelete}
            onClose={() => setMetaToDelete(null)}
            onConfirm={handleDeleteMeta}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
        />
        </>
    );
};

export default FuncionarioDetalhe;