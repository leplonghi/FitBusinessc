import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingDown, FileText, TrendingUp, Download } from 'lucide-react';
import InsightCard from '../components/ui/InsightCard.tsx';
import { useData } from '../hooks/useData.tsx';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart, Line as RechartsLine,
  BarChart as RechartsBarChart, Bar as RechartsBar,
  XAxis as RechartsXAxis, YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid, Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from 'recharts';
import { useTheme } from '../hooks/useTheme.tsx';

// FIX: Moved Tab components outside of PainelAnalitico to prevent hook order errors.

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 sm:flex-initial flex items-center justify-center sm:justify-start px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            active
                ? 'bg-fit-dark-blue text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

const AnaliseRiscoTab: React.FC = () => {
    const { empresas } = useData();
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';

    const irsData = useMemo(() => 
        empresas.map(e => ({ name: e.nomeEmpresa.split(' ')[0], irs: e.irs }))
        .sort((a,b) => b.irs - a.irs), [empresas]);
    
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Análise de Risco</h3>
            <InsightCard 
                promptKey="analiseRisco"
                title="Insight de Risco com IA"
            />
             <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Variação do IRS (Índice de Risco de Saúde)</h4>
                 <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={irsData}>
                        <RechartsCartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <RechartsXAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }}/>
                        <RechartsYAxis tick={{ fill: tickColor, fontSize: 12 }} />
                        <RechartsTooltip />
                        <RechartsBar dataKey="irs" name="Índice de Risco de Saúde" fill="#E53E3E" />
                    </RechartsBarChart>
                 </ResponsiveContainer>
             </div>
        </div>
    );
};

const RelatoriosTab: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';
    return (
     <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="flex justify-between items-center">
             <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Relatórios Inteligentes</h3>
             <button className="btn btn-secondary">
                <Download size={16} className="mr-2" /> Exportar
             </button>
        </div>
        <InsightCard 
            promptKey="relatorio"
            title="Resumo Executivo do Mês com IA"
        />
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Métricas Chave do Mês</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold">78</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">FitScore Médio</p>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold">82%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Engajamento</p>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold">48%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nível de Estresse</p>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold">7.1h</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Média de Sono</p>
                </div>
            </div>
        </div>
    </div>
    );
};

const PrevisoesTab: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';

    const previsaoData = [
        { name: 'Atual', fitscore: 78 },
        { name: 'Próx. 30d', fitscore: 75 },
        { name: 'Próx. 60d', fitscore: 72 },
        { name: 'Próx. 90d', fitscore: 74 },
    ];
    return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Previsões e Tendências</h3>
        <InsightCard 
            promptKey="previsao"
            title="Previsão de Engajamento com IA"
        />
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Previsão de FitScore Global (Próximos 90 dias)</h4>
             <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={previsaoData}>
                    <RechartsCartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <RechartsXAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
                    <RechartsYAxis domain={[50, 90]} tick={{ fill: tickColor, fontSize: 12 }}/>
                    <RechartsTooltip />
                    <RechartsLegend wrapperStyle={{ color: tickColor }} />
                    <RechartsLine type="monotone" dataKey="fitscore" name="FitScore Previsto" stroke="#F6AD55" strokeWidth={2} />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    </div>
    );
};

const PainelAnalitico: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'risco' | 'relatorios' | 'previsoes'>('risco');

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                    <BarChart3 size={24} className="text-fit-dark-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Painel Analítico</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    Explore análises aprofundadas, relatórios inteligentes e previsões de tendências geradas por IA para tomar decisões estratégicas.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <TabButton 
                    active={activeTab === 'risco'} 
                    onClick={() => setActiveTab('risco')} 
                    icon={<TrendingDown size={18} />} 
                    label="Análise de Risco" 
                />
                 <TabButton 
                    active={activeTab === 'relatorios'} 
                    onClick={() => setActiveTab('relatorios')} 
                    icon={<FileText size={18} />} 
                    label="Relatórios Inteligentes" 
                />
                 <TabButton 
                    active={activeTab === 'previsoes'} 
                    onClick={() => setActiveTab('previsoes')} 
                    icon={<TrendingUp size={18} />} 
                    label="Previsões e Tendências" 
                />
            </div>

            <div>
                {activeTab === 'risco' && <AnaliseRiscoTab />}
                {activeTab === 'relatorios' && <RelatoriosTab />}
                {activeTab === 'previsoes' && <PrevisoesTab />}
            </div>
        </div>
    );
};

export default PainelAnalitico;