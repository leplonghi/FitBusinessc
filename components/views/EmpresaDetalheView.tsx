
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Users, BarChart2, ShieldAlert } from 'lucide-react';
// FIX: Add .ts extension for type import
import { Empresa } from '../../types.ts';
// FIX: Add .tsx extension for hook import
import { useData } from '../../hooks/useData.tsx';
// FIX: Add .ts extension for util import
import { getRiscoClass } from '../../lib/utils.ts';
// FIX: Add .tsx extension for component import
import Card from '../ui/Card.tsx';

interface EmpresaDetalheViewProps {
    empresa: Empresa;
    onBack: () => void;
}

const EmpresaDetalheView: React.FC<EmpresaDetalheViewProps> = ({ empresa, onBack }) => {
    const { getFuncionariosByEmpresaId } = useData();
    const navigate = useNavigate();
    const funcionarios = useMemo(() => getFuncionariosByEmpresaId(empresa.empresaId), [empresa.empresaId, getFuncionariosByEmpresaId]);

    const handleFuncionarioClick = (funcionarioId: string) => {
        navigate(`/funcionarios/${funcionarioId}`);
    };

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="btn btn-secondary">
                <ArrowLeft size={16} className="mr-2" />
                Voltar para a Lista de Empresas
            </button>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Building size={32} className="text-fit-dark-blue dark:text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{empresa.nomeEmpresa}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{empresa.setor}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card 
                    title="Total de Funcionários" 
                    value={empresa.totalFuncionarios} 
                    icon={<Users className="text-fit-dark-blue" />}
                />
                <Card 
                    title="FitScore Médio" 
                    value={empresa.fitScoreMedio}
                    icon={<BarChart2 className="text-fit-dark-blue" />}
                />
                <Card 
                    title="Nível de Risco Médio" 
                    value={empresa.riscoMedio} 
                    icon={<ShieldAlert className="text-fit-dark-blue" />}
                />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Funcionários</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Cargo</th>
                                <th scope="col" className="px-6 py-3">FitScore</th>
                                <th scope="col" className="px-6 py-3">Risco</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map(f => (
                                <tr key={f.id} onClick={() => handleFuncionarioClick(f.id)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{f.nome}</td>
                                    <td className="px-6 py-4">{f.cargo}</td>
                                    <td className="px-6 py-4">{f.fitScore}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiscoClass(f.risco)}`}>{f.risco}</span></td>
                                </tr>
                            ))}
                             {funcionarios.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">
                                        Nenhum funcionário encontrado para esta empresa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmpresaDetalheView;
