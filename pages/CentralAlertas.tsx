import React from 'react';
import { Bell, ShieldAlert, TrendingUp, Sparkles, AlertCircle, TrendingDown } from 'lucide-react';

interface Alert {
    id: number;
    type: 'Risco' | 'Oportunidade' | 'Tendência';
    title: string;
    description: string;
    company: string;
    date: string;
}

const mockAlerts: Alert[] = [
    {
        id: 1,
        type: 'Risco',
        title: 'Aumento do Nível de Estresse',
        description: 'O setor de Vendas da Manufatura Forte apresentou um aumento de 25% no estresse reportado nas últimas 2 semanas.',
        company: 'Manufatura Forte',
        date: 'Há 2 dias',
    },
    {
        id: 2,
        type: 'Oportunidade',
        title: 'Melhora no Hábito de Sono',
        description: 'Colaboradores da InovaTech Soluções que participaram do desafio de bem-estar aumentaram sua média de sono em 45 minutos.',
        company: 'InovaTech Soluções',
        date: 'Há 5 dias',
    },
    {
        id: 3,
        type: 'Tendência',
        title: 'Queda no Engajamento em Logística',
        description: 'Observada uma tendência de queda de 15% no engajamento geral para empresas do setor de Logística no último mês.',
        company: 'LogiExpress Brasil',
        date: 'Há 1 semana',
    },
     {
        id: 4,
        type: 'Risco',
        title: 'Baixo FitScore em Novos Contratados',
        description: 'Grupo de funcionários admitidos no último trimestre na Clínica Bem Viver apresenta FitScore médio 20% abaixo da média da empresa.',
        company: 'Clínica Bem Viver',
        date: 'Há 2 semanas',
    },
];

const AlertIcon: React.FC<{ type: Alert['type'] }> = ({ type }) => {
    switch (type) {
        case 'Risco':
            return <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full"><AlertCircle className="text-red-600 dark:text-red-300" size={24} /></div>;
        case 'Oportunidade':
            return <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full"><Sparkles className="text-green-600 dark:text-green-300" size={24} /></div>;
        case 'Tendência':
            return <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full"><TrendingUp className="text-yellow-600 dark:text-yellow-300" size={24} /></div>;
        default:
            return null;
    }
};


const CentralAlertas: React.FC = () => {
    return (
        <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                    <Bell size={24} className="text-fit-dark-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Central de Alertas e Insights</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    Monitore proativamente os principais riscos, oportunidades e tendências identificados pela nossa IA em todas as empresas.
                </p>
             </div>

            <div className="space-y-4">
                {mockAlerts.map(alert => (
                    <div key={alert.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-start space-x-4">
                        <AlertIcon type={alert.type} />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{alert.date}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.description}</p>
                            <div className="mt-2">
                                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {alert.company}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CentralAlertas;