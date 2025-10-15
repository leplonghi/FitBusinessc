import React, { useState, useMemo } from 'react';
import { Empresa } from '../../types.ts';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { getRiscoClass } from '../../lib/utils.ts';

type SortableKeys = 'nomeEmpresa' | 'setor' | 'totalFuncionarios' | 'fitScoreMedio' | 'riscoMedio';

const EmpresaListView: React.FC<{
    empresas: Empresa[];
    onSelectEmpresa: (empresa: Empresa) => void;
    onEditEmpresa: (empresa: Empresa) => void;
    onDeleteEmpresa: (empresa: Empresa) => void;
    showActions?: boolean;
}> = ({ empresas, onSelectEmpresa, onEditEmpresa, onDeleteEmpresa, showActions = true }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'nomeEmpresa', direction: 'asc' });

    const sortedEmpresas = useMemo(() => {
        let sortableItems = [...empresas];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [empresas, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('nomeEmpresa')}>
                                <div className="flex items-center gap-2">Empresa {getSortIcon('nomeEmpresa')}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('setor')}>
                                <div className="flex items-center gap-2">Setor {getSortIcon('setor')}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('totalFuncionarios')}>
                                <div className="flex items-center gap-2">Funcionários {getSortIcon('totalFuncionarios')}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('fitScoreMedio')}>
                                <div className="flex items-center gap-2">FitScore Médio {getSortIcon('fitScoreMedio')}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('riscoMedio')}>
                                <div className="flex items-center gap-2">Risco Médio {getSortIcon('riscoMedio')}</div>
                            </th>
                            {showActions && <th scope="col" className="px-6 py-3 text-right">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEmpresas.map(empresa => (
                            <tr
                                key={empresa.empresaId}
                                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                onClick={() => onSelectEmpresa(empresa)}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{empresa.nomeEmpresa}</td>
                                <td className="px-6 py-4">{empresa.setor}</td>
                                <td className="px-6 py-4">{empresa.totalFuncionarios}</td>
                                <td className="px-6 py-4">{empresa.fitScoreMedio}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiscoClass(empresa.riscoMedio)}`}>
                                        {empresa.riscoMedio}
                                    </span>
                                </td>
                                {showActions && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEditEmpresa(empresa); }}
                                                className="btn-icon"
                                                aria-label={`Editar ${empresa.nomeEmpresa}`}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteEmpresa(empresa); }}
                                                className="btn-icon btn-icon-danger"
                                                aria-label={`Excluir ${empresa.nomeEmpresa}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpresaListView;