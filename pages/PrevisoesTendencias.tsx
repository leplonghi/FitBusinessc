
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import InsightCard from '../components/ui/InsightCard';
import { generateFitScorePrediction } from '../lib/mockData';

const PrevisoesTendencias: React.FC = () => {
  const predictionData = generateFitScorePrediction();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-fit-dark-blue mr-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Previsão de FitScore Médio (Próximas 4 semanas)</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={predictionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="date" tick={{ fill: '#8A94A6', fontSize: 12 }} />
              <YAxis domain={[60, 90]} tick={{ fill: '#8A94A6', fontSize: 12 }} />
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
                <p className="text-2xl font-bold text-fit-green">↑ 82%</p>
            </div>
             <div>
                <p className="text-sm text-fit-gray">Probabilidade de Aumento de Estresse</p>
                <p className="text-2xl font-bold text-fit-orange">~ 15%</p>
            </div>
             <div>
                <p className="text-sm text-fit-gray">Setores com Risco Crescente</p>
                <p className="text-2xl font-bold text-fit-red">Logística</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisoesTendencias;
