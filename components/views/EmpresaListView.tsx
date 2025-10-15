import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Users, Search } from 'lucide-react';
import { Empresa } from '../../types';

interface EmpresaListViewProps {
    empresas: Empresa[];
    funcionariosCount: { [key: string]: number };
    onSelectEmpresa: (empresa: Empresa) => void;
    onEditEmpresa: (empresa: Empresa) => void;
    onDeleteEmpresa: (id: string) => void;
}

const EmpresaListView: React.FC<EmpresaListViewProps> = ({ 
    empresas, 
    funcionariosCount,
    onSelectEmpresa, 
    onEditEmpresa, 
    onDeleteEmpresa 
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmpresas = useMemo(() => {
        return empresas.filter(empresa =>
            empresa.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresa.cnpj.includes(searchTerm)
        );
    }, [empresas, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex-grow relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou CNPJ..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">Nome da Empresa</th>
                            <th className="px-6 py-3">CNPJ</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Funcionários</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmpresas.map(empresa => (
                            <tr key={empresa.empresaId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{empresa.nomeEmpresa}</td>
                                <td className="px-6 py-4 font-mono">{empresa.cnpj}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${empresa.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{empresa.status}</span>
                                </td>
                                <td className="px-6 py-4">{funcionariosCount[empresa.empresaId] || 0}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-4">
                                        <button onClick={() => onSelectEmpresa(empresa)} className="text-fit-gray hover:text-fit-dark-blue" title="Gerenciar Funcionários"><Users size={16} /></button>
                                        <button onClick={() => onEditEmpresa(empresa)} className="text-fit-gray hover:text-fit-dark-blue" title="Editar Empresa"><Edit size={16} /></button>
                                        <button onClick={() => onDeleteEmpresa(empresa.empresaId)} className="text-fit-gray hover:text-fit-red" title="Excluir Empresa"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpresaListView;