import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Activity, BarChart2, AlertTriangle, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import InsightCard from '../components/ui/InsightCard';
import { generateMockEmpresas, generateFitScoreTimeline, generateEngagementByNivel, generateCheckinsBySetor } from '../lib/mockData';
import { useTheme } from '../hooks/useTheme';

const VisaoGeral: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const tooltipBackgroundColor = theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    const empresas = generateMockEmpresas();
    const fitScoreTimeline = generateFitScoreTimeline();
    const engagementByNivel = generateEngagementByNivel();
    const checkinsBySetor = generateCheckinsBySetor();

    const totalFuncionarios = empresas.reduce((sum, e) => sum + e.funcionariosAtivos, 0);
    const mediaFitScoreGlobal = Math.round(empresas.reduce((sum, e) => sum + e.mediaFitScore * e.funcionariosAtivos, 0) / totalFuncionarios);
    const totalAlertas = empresas.reduce((sum, e) => sum + e.alertasRisco, 0);

    const PIE_COLORS = ['#0A2342', '#4A5568', '#718096', '#A0AEC0'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Empresas Ativas" value={empresas.length} icon={<Users className="text-fit-dark-blue" />} />
                <Card title="Funcionários Monitorados" value={totalFuncionarios.toLocaleString('pt-BR')} icon={<Activity className="text-fit-dark-blue" />} />
                <Card title="Média FitScore Global" value={mediaFitScoreGlobal} icon={<BarChart2 className="text-fit-dark-blue" />} change="-6% vs semana passada" changeType="negative" />
                <Card title="Funcionários em Risco" value={`${Math.round((totalAlertas / totalFuncionarios) * 100)}%`} icon={<AlertTriangle className="text-fit-dark-blue" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Evolução do FitScore Médio Global</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={fitScoreTimeline} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, backdropFilter: 'blur(5px)', border: `1px solid ${tooltipBorderColor}`, borderRadius: '0.75rem' }} />
                            <Legend verticalAlign="top" align="right" />
                            <Line type="monotone" dataKey="fitScore" name="FitScore Médio" stroke="#0A2342" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: '#0A2342', fill: '#fff', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <InsightCard promptKey="visaoGeral" title="Insights da Plataforma (IA)" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <Card title="Benchmark de Check-ins por Setor" value="" icon={<></>} isPremium className="!p-0 !shadow-none !border-none">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 px-6">Benchmark de Check-ins por Setor</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={checkinsBySetor} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                               <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
                               <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
                               <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, backdropFilter: 'blur(5px)', border: `1px solid ${tooltipBorderColor}`, borderRadius: '0.75rem' }} />
                               <Legend verticalAlign="top" align="right" />
                               <Bar dataKey="checkins" name="% de Check-ins na Semana" fill="#0A2342" barSize={30} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribuição por Nível Organizacional</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={engagementByNivel} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {engagementByNivel.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, backdropFilter: 'blur(5px)', border: `1px solid ${tooltipBorderColor}`, borderRadius: '0.75rem' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default VisaoGeral;