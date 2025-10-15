
import React, { useMemo, useState } from 'react';
import { Edit, X, Mail, Briefcase, Calendar, BarChart2, ShieldAlert, Target, Flag, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line as RechartsLine, CartesianGrid as RechartsCartesianGrid, XAxis as RechartsXAxis, YAxis as RechartsYAxis, Tooltip as RechartsTooltip, RadarChart as RechartsRadarChart, PolarGrid as RechartsPolarGrid, PolarAngleAxis as RechartsPolarAngleAxis, Radar as RechartsRadar } from 'recharts';
// FIX: Add .ts extension
import { Funcionario, Meta, MetaStatus } from '../../types.ts';
import { useTheme } from '../../hooks/useTheme.tsx';
import Card from '../ui/Card.tsx';
import MetaModal from './MetaModal.tsx';
// FIX: Add .tsx extension
import { useData } from '../../hooks/useData.tsx';
import ConfirmationModal from '../ui/ConfirmationModal.tsx';

const GoalStatusBadge: React.FC<{ status: MetaStatus }> = ({ status }) => {
  const statusClasses = {
    'Não Iniciada': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Em Progresso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200',
    'Concluída': 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const FuncionarioDetalheModal: React.FC<{
    funcionario: Funcionario | null;
    onClose: () => void;
}> = ({ funcionario, onClose }) => {
    const { theme } = useTheme();
    const { updateFuncionario } = useData();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';
    const tooltipBackgroundColor = theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
    const [metaToEdit, setMetaToEdit] = useState<Meta | null>(null);
    const [metaToDelete, setMetaToDelete] = useState<string | null>(null);

    if (!funcionario) return null;

    const { nome, cargo, email, empresaNome, avatarUrl, dataAdmissao, fitScore, risco, historicoFitScore, metricas, planoExercicio, metas } = funcionario;

    const handleOpenAddMetaModal = () => {
        setMetaToEdit(null);
        setIsMetaModalOpen(true);
    };

    const handleOpenEditMetaModal = (meta: Meta) => {
        setMetaToEdit(meta);
        setIsMetaModalOpen(true);
    };

    const handleSaveMeta = (metaData: Omit<Meta, 'id'>) => {
        const updatedMetas = metaToEdit
            ? metas.map(m => m.id === metaToEdit.id ? { ...m, ...metaData } : m)
            : [...metas, { ...metaData, id: `m-${Date.now()}` }];
        
        updateFuncionario({ ...funcionario, metas: updatedMetas });
        setIsMetaModalOpen(false);
    };

    const handleDeleteMeta = () => {
        if (!metaToDelete) return;
        const updatedMetas = metas.filter(m => m.id !== metaToDelete);
        updateFuncionario({ ...funcionario, metas: updatedMetas });
        setMetaToDelete(null);
    };

    const metricasData = useMemo(() => [
        { subject: 'Sono', value: (metricas.sono / 8) * 100 },
        { subject: 'Estresse', value: 100 - metricas.estresse },
        { subject: 'Humor', value: (metricas.humor / 5) * 100 },
        { subject: 'Energia', value: (metricas.energia / 5) * 100 },
    ], [metricas]);

    return (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="funcionario-detalhe-title"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <img src={avatarUrl} alt={nome} className="w-12 h-12 rounded-full" />
                        <div>
                             <h3 id="funcionario-detalhe-title" className="text-xl font-bold text-gray-800 dark:text-white">{nome}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{cargo}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="btn btn-primary btn-sm">
                            <Edit size={14} className="mr-2"/> Editar
                        </button>
                        <button onClick={onClose} aria-label="Fechar modal" className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Personal Info & Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-3">
                             <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">Informações</h4>
                             <p className="flex items-start text-sm text-gray-600 dark:text-gray-300"><Briefcase size={14} className="mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0"/> <strong>Empresa:</strong><span className="ml-2">{empresaNome}</span></p>
                             <p className="flex items-start text-sm text-gray-600 dark:text-gray-300"><Mail size={14} className="mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0"/> <strong>Email:</strong><span className="ml-2 break-all">{email}</span></p>
                             <p className="flex items-start text-sm text-gray-600 dark:text-gray-300"><Calendar size={14} className="mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0"/> <strong>Admissão:</strong><span className="ml-2">{new Date(dataAdmissao).toLocaleDateString('pt-BR')}</span></p>
                        </div>
                         <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            <Card title="FitScore Atual" value={fitScore} icon={<BarChart2 size={20} className="text-fit-dark-blue"/>} />
                            <Card title="Nível de Risco" value={risco} icon={<ShieldAlert size={20} className="text-fit-dark-blue"/>} />
                        </div>
                    </div>

                    {/* Exercise Plan */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center"><Target size={18} className="mr-2 text-fit-dark-blue"/> Plano de Atividades</h4>
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                             <p className="text-sm"><strong>Plano:</strong> {planoExercicio.nome} ({planoExercicio.frequencia})</p>
                             <p className="text-sm"><strong>Meta Semanal:</strong> {planoExercicio.meta}</p>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Progresso</span>
                                    <span className="font-medium">{planoExercicio.progresso}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-fit-green h-2.5 rounded-full" style={{ width: `${planoExercicio.progresso}%` }}></div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-800 dark:text-white flex items-center">
                                <Flag size={18} className="mr-2 text-fit-dark-blue" /> Metas Individuais
                            </h4>
                            <button onClick={handleOpenAddMetaModal} className="btn btn-primary btn-sm">
                                <Plus size={14} className="mr-2" /> Adicionar Meta
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-4 py-2">Descrição da Meta</th>
                                        <th scope="col" className="px-4 py-2">Data Alvo</th>
                                        <th scope="col" className="px-4 py-2">Status</th>
                                        <th scope="col" className="px-4 py-2 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metas.map(meta => (
                                        <tr key={meta.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 last:border-b-0">
                                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{meta.descricao}</td>
                                            <td className="px-4 py-2">{new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-4 py-2"><GoalStatusBadge status={meta.status} /></td>
                                            <td className="px-4 py-2 text-right">
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
                    
                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white">Evolução do FitScore</h4>
                                <select className="text-xs">
                                    <option>Últimos 12 meses</option>
                                    <option>Últimos 6 meses</option>
                                </select>
                             </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <RechartsLineChart data={historicoFitScore}>
                                    <RechartsCartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                                    <RechartsXAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', { month: 'short' })} tick={{ fontSize: 10, fill: tickColor }} />
                                    <RechartsYAxis domain={[0, 100]} tick={{ fontSize: 10, fill: tickColor }}/>
                                    <RechartsTooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, backdropFilter: 'blur(5px)', border: `1px solid ${tooltipBorderColor}`, borderRadius: '0.75rem' }} />
                                    <RechartsLine type="monotone" dataKey="score" name="FitScore" stroke="#0A2342" strokeWidth={2} dot={false} />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Pilares de Bem-estar</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                 <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={metricasData}>
                                    <RechartsPolarGrid />
                                    <RechartsPolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: tickColor }} />
                                    <RechartsRadar name={nome} dataKey="value" stroke="#0A2342" fill="#0A2342" fillOpacity={0.6} />
                                </RechartsRadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

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

export default FuncionarioDetalheModal;
