import React, { useState, useMemo } from 'react';
import { TrendingDown, ShieldCheck, ShieldHalf, TrendingUp, SlidersHorizontal, FileDown, BarChart3, LineChart as LineChartIcon, FileText as FileTextIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Card from '../components/ui/Card';
import InsightCard from '../components/ui/InsightCard';
import { generateIrsTimeline, generateMockEmpresas, generateFitScorePrediction, generateOtherPredictions } from '../lib/mockData';
import { useAuth } from '../hooks/useAuth';
import { Empresa } from '../types';

type Tab = 'risco' | 'previsoes' | 'relatorios';

const AnaliseRiscoTab: React.FC<{ empresaId?: string }> = ({ empresaId }) => {
    const allEmpresas = useMemo(() => generateMockEmpresas(), []);

    const dataEmpresas = useMemo(() => {
        return empresaId ? allEmpresas.filter(e => e.empresaId === empresaId) : allEmpresas;
    }, [empresaId, allEmpresas]);
    
    const mediaIrs = dataEmpresas.length > 0 ? Math.round(dataEmpresas.reduce((acc, emp) => acc + emp.irs, 0) / dataEmpresas.length) : 0;
    const empresasAltoRisco = dataEmpresas.filter(emp => emp.irs < 50).length;
    const empresasMedioRisco = dataEmpresas.filter(emp => emp.irs >= 50 && emp.irs < 80).length;

    const irsTimeline = useMemo(() => {
        if (empresaId && dataEmpresas.length === 1 && dataEmpresas[0].irsHistory) {
            return dataEmpresas[0].irsHistory.map(h => ({
                date: new Date(h.date).toLocaleString('default', { month: 'short' }),
                irs: h.irs
            }));
        }
        return generateIrsTimeline();
    }, [empresaId, dataEmpresas]);

    const getIrsRiskLevel = (irs: number) => {
        if (irs >= 80) return { label: 'Baixo Risco' };
        if (irs >= 50) return { label: 'Médio Risco' };
        return { label: 'Alto Risco' };
    };

    const riskLevel = getIrsRiskLevel(mediaIrs);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                    title={empresaId ? "IRS da Empresa" : "IRS Médio Global"}
                    value={mediaIrs} 
                    icon={<TrendingDown />}
                    change={riskLevel.label}
                    changeType={mediaIrs < 50 ? 'negative' : 'positive'}
                />
                <Card title="Empresas em Alto Risco" value={empresasAltoRisco} icon={<ShieldHalf />} />
                <Card title="Empresas em Médio Risco" value={empresasMedioRisco} icon={<ShieldCheck />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold">{empresaId ? "Variação do IRS da Empresa" : "Variação do IRS Global"} (6 meses)</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={irsTimeline}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="irs" name="IRS" stroke="#F6AD55" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <InsightCard promptKey="analiseRisco" title="Análise Preditiva (IA)" />
            </div>
        </div>
    );
};

const PrevisoesTendenciasTab: React.FC<{ empresaId?: string }> = ({ empresaId }) => {
    const predictionData = useMemo(() => generateFitScorePrediction(), [empresaId]);
    const otherPredictions = useMemo(() => generateOtherPredictions(), [empresaId]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Previsão de FitScore {empresaId ? "da Empresa" : "Global"} (4 semanas)</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={predictionData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                            <XAxis dataKey="date" />
                            <YAxis domain={[60, 90]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="real" name="FitScore Real" stroke="#0A2342" strokeWidth={2} connectNulls />
                            <Line type="monotone" dataKey="previsto" name="FitScore Previsto" stroke="#48BB78" strokeWidth={2} strokeDasharray="5 5" connectNulls />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <InsightCard promptKey="previsao" title="Alerta Preditivo (IA)" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Outras Previsões</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-fit-gray">Taxa de Engajamento Estimada</p>
                        <p className={`text-2xl font-bold ${otherPredictions.engagementRate.trend === 'up' ? 'text-fit-green' : 'text-fit-red'}`}>
                            {otherPredictions.engagementRate.trend === 'up' ? '↑' : '↓'} {otherPredictions.engagementRate.value}%
                        </p>
                    </div>
                     <div>
                        <p className="text-sm text-fit-gray">Probabilidade de Aumento de Estresse</p>
                        <p className="text-2xl font-bold text-fit-orange">
                            ~ {otherPredictions.stressProbability}%
                        </p>
                    </div>
                     <div>
                        <p className="text-sm text-fit-gray">Setor com Risco Crescente</p>
                        <p className="text-2xl font-bold text-fit-red">
                            {otherPredictions.risingRiskSector}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RelatoriosInteligentesTab: React.FC<{ empresaId?: string }> = ({ empresaId }) => {
    const allEmpresas = useMemo(() => generateMockEmpresas(), []);
    const currentCompany = useMemo(() => allEmpresas.find(e => e.empresaId === empresaId), [empresaId, allEmpresas]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-6">Gerador de Relatórios</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="empresa" className="block text-sm font-medium">Empresa</label>
                        <select id="empresa" disabled={!!empresaId} value={empresaId || 'Todas'} className="mt-1 w-full" >
                            {empresaId && currentCompany ? (
                                <option value={currentCompany.empresaId}>{currentCompany.nomeEmpresa}</option>
                            ) : (
                                <>
                                <option value="Todas">Todas</option>
                                {allEmpresas.map(e => <option key={e.empresaId} value={e.empresaId}>{e.nomeEmpresa}</option>)}
                                </>
                            )}
                        </select>
                    </div>
                    {/* Other filters */}
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="flex items-center bg-gray-200 px-4 py-2 rounded-lg"><FileDown size={16} className="mr-2"/>Exportar</button>
                </div>
            </div>
            <InsightCard promptKey="relatorio" title="Resumo do Relatório (IA)" />
        </div>
    );
};

const PainelAnalitico: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('risco');
    const empresaIdForClient = user?.papel === 'Gerente RH' ? user.empresaId : undefined;

    const renderContent = () => {
        switch (activeTab) {
            case 'risco': return <AnaliseRiscoTab empresaId={empresaIdForClient} />;
            case 'previsoes': return <PrevisoesTendenciasTab empresaId={empresaIdForClient} />;
            case 'relatorios': return <RelatoriosInteligentesTab empresaId={empresaIdForClient} />;
            default: return null;
        }
    };

    const tabs = [
        { id: 'risco', label: 'Análise de Risco', icon: <BarChart3 size={16} /> },
        { id: 'previsoes', label: 'Previsões', icon: <LineChartIcon size={16} /> },
        { id: 'relatorios', label: 'Relatórios', icon: <FileTextIcon size={16} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <nav className="flex space-x-2 sm:space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === tab.id 
                                ? 'border-fit-dark-blue text-fit-dark-blue dark:border-fit-orange dark:text-fit-orange' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}`}
                        >
                            <span className="mr-2 hidden sm:inline">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

export default PainelAnalitico;