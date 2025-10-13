
import React, { useState } from 'react';
import { SlidersHorizontal, FileDown } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import InsightCard from '../components/ui/InsightCard';

const RelatoriosInteligentes: React.FC = () => {

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <SlidersHorizontal className="text-fit-dark-blue mr-3" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Gerador de Relatórios Dinâmicos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
            <select id="empresa" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue sm:text-sm rounded-md">
              <option>Todas</option>
              <option>InovaTech Soluções</option>
              <option>Manufatura Forte</option>
            </select>
          </div>
          <div>
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Período</label>
            <select id="periodo" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue sm:text-sm rounded-md">
              <option>Últimos 30 dias</option>
              <option>Últimos 3 meses</option>
              <option>Último ano</option>
            </select>
          </div>
           <div>
            <label htmlFor="setor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Setor</label>
            <select id="setor" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue sm:text-sm rounded-md">
              <option>Todos</option>
              <option>Tecnologia</option>
              <option>Indústria</option>
            </select>
          </div>
          <div>
            <label htmlFor="indicador" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Indicador</label>
            <select id="indicador" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue sm:text-sm rounded-md">
              <option>Todos</option>
              <option>Sono</option>
              <option>Humor</option>
              <option>Risco</option>
            </select>
          </div>
        </div>
         <div className="mt-6 flex justify-end space-x-3">
            <button className="flex items-center bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              <FileDown size={16} className="mr-2" />
              Exportar PDF/CSV
            </button>
          </div>
      </div>
      <InsightCard promptKey="relatorio" title="Resumo do Relatório (Gerado por IA)" />
    </div>
  );
};

export default RelatoriosInteligentes;
