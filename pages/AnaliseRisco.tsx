
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, ShieldCheck, ShieldHalf } from 'lucide-react';
import Card from '../components/ui/Card';
import InsightCard from '../components/ui/InsightCard';
import { generateIrsTimeline, generateMockEmpresas } from '../lib/mockData';

const AnaliseRisco: React.FC = () => {
    const irsTimeline = generateIrsTimeline();
    const empresas = generateMockEmpresas();

    const mediaIrs = Math.round(empresas.reduce((acc, emp) => acc + emp.irs, 0) / empresas.length);
    const empresasAltoRisco = empresas.filter(emp => emp.irs < 50).length;
    const empresasMedioRisco = empresas.filter(emp => emp.irs >= 50 && emp.irs < 80).length;

    const getIrsRiskLevel = (irs: number) => {
        if (irs >= 80) return { label: 'Baixo Risco', color: 'text-fit-green' };
        if (irs >= 50) return { label: 'Médio Risco', color: 'text-fit-orange' };
        return { label: 'Alto Risco', color: 'text-fit-red' };
    };

    const riskLevel = getIrsRiskLevel(mediaIrs);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                    title="Índice de Risco de Saúde (IRS) Médio" 
                    value={mediaIrs} 
                    icon={<TrendingDown className="text-fit-dark-blue" />}
                    change={riskLevel.label}
                    changeType={mediaIrs < 50 ? 'negative' : 'positive'}
                />
                <Card title="Empresas em Alto Risco (IRS < 50)" value={empresasAltoRisco} icon={<ShieldHalf className="text-fit-dark-blue" />} />
                <Card title="Empresas em Médio Risco (IRS 50-79)" value={empresasMedioRisco} icon={<ShieldCheck className="text-fit-dark-blue" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Variação do IRS (Últimos 6 meses)</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={irsTimeline} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tick={{ fill: '#8A94A6', fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#8A94A6', fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="irs" name="IRS Médio" stroke="#F6AD55" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <InsightCard promptKey="analiseRisco" title="Análise Preditiva de Bem-estar (IA)" />
            </div>
        </div>
    );
};

export default AnaliseRisco;
