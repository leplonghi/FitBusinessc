import React, { useMemo } from 'react';
import { Users, BarChart2, TrendingUp, TrendingDown, Activity, ShieldAlert } from 'lucide-react';
import Card from '../components/ui/Card.tsx';
import InsightCard from '../components/ui/InsightCard.tsx';
import { useData } from '../hooks/useData.tsx';
import { Empresa } from '../types.ts';

const VisaoGeral: React.FC = () => {
    const { empresas, funcionarios } = useData();

    const totalEmpresas = empresas.length;
    const totalFuncionarios = funcionarios.length;
    const fitScoreMedioGlobal = totalFuncionarios > 0 ? Math.round(funcionarios.reduce((acc, f) => acc + f.fitScore, 0) / totalFuncionarios) : 0;
    const empresasAltoRisco = empresas.filter(e => e.riscoMedio === 'Alto').length;
    
    const destaquesPorSetor = useMemo(() => {
        const setores = new Set(empresas.map(e => e.setor));
        const destaques: { setor: string; fitScoreMedio: number; }[] = [];

        setores.forEach(setor => {
            const funcionariosDoSetor = funcionarios.filter(f => f.setor === setor);
            if (funcionariosDoSetor.length > 0) {
                 const fitScoreMedio = Math.round(funcionariosDoSetor.reduce((acc, f) => acc + f.fitScore, 0) / funcionariosDoSetor.length);
                 destaques.push({ setor, fitScoreMedio });
            }
        });
        
        return destaques.sort((a,b) => b.fitScoreMedio - a.fitScoreMedio);
    }, [empresas, funcionarios]);


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="Empresas Monitoradas" 
                    value={totalEmpresas} 
                    icon={<Activity className="text-fit-dark-blue" />}
                />
                <Card 
                    title="Funcionários Ativos" 
                    value={totalFuncionarios} 
                    icon={<Users className="text-fit-dark-blue" />}
                />
                <Card 
                    title="FitScore Médio Global" 
                    value={fitScoreMedioGlobal}
                    icon={<BarChart2 className="text-fit-dark-blue" />}
                    change="-6% (semana)"
                    changeType="negative"
                />
                <Card 
                    title="Empresas em Risco Alto" 
                    value={empresasAltoRisco} 
                    icon={<ShieldAlert className="text-fit-dark-blue" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <InsightCard 
                        promptKey="visaoGeral" 
                        title="Análise Geral com IA" 
                     />
                </div>
                 <div className="lg:col-span-1">
                     <InsightCard 
                        promptKey="previsao" 
                        title="Alerta Preditivo com IA"
                     />
                 </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Destaques por Setor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                    {destaquesPorSetor.map(destaque => (
                         <div key={destaque.setor}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{destaque.setor}</p>
                            <p className={`text-2xl font-bold flex items-center justify-center ${destaque.fitScoreMedio >= 70 ? 'text-fit-green' : destaque.fitScoreMedio <= 55 ? 'text-fit-red' : 'text-gray-800 dark:text-white'}`}>
                                {destaque.fitScoreMedio} 
                                {destaque.fitScoreMedio >= 70 ? <TrendingUp className="ml-2" size={20} /> : <TrendingDown className="ml-2" size={20} />}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">FitScore Médio</p>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    );
};

export default VisaoGeral;