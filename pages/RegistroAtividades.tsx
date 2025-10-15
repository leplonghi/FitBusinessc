import React, { useState, useMemo } from 'react';
import { Search, History, ArrowUp, ArrowDown, X } from 'lucide-react';
import { generateMockAuditLogs } from '../lib/mockData';
import { AuditLog, Papel } from '../types';
import AccessDenied from '../components/ui/AccessDenied';
import { useAuth } from '../hooks/useAuth.tsx';

type SortableKeys = 'user' | 'action' | 'target' | 'timestamp';

const RegistroAtividades: React.FC = () => {
  const { user } = useAuth();
  const allLogs = useMemo(() => generateMockAuditLogs(), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'timestamp', direction: 'desc' });

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = [...allLogs];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.user.name.toLowerCase().includes(lowercasedTerm) ||
        log.action.toLowerCase().includes(lowercasedTerm) ||
        log.target.name.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of the day
        filtered = filtered.filter(log => new Date(log.timestamp) >= start);
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of the day
        filtered = filtered.filter(log => new Date(log.timestamp) <= end);
    }

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'user') {
            aValue = a.user.name;
            bValue = b.user.name;
        } else if (sortConfig.key === 'target') {
            aValue = a.target.name;
            bValue = b.target.name;
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [allLogs, searchTerm, sortConfig, startDate, endDate]);

  if (user?.papel !== 'superadmin') {
      return <AccessDenied />;
  }
  
  const clearFilters = () => {
      setSearchTerm('');
      setStartDate('');
      setEndDate('');
  };

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

  const getRoleClass = (role: Papel) => {
      return role === 'superadmin' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400';
  }

  return (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
                <History size={24} className="text-fit-dark-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Registro de Atividades (Audit Log)</h2>
            </div>
            <p className="text-fit-gray">
                Visualize todas as ações importantes realizadas na plataforma para fins de segurança e auditoria.
            </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="lg:col-span-2 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por usuário, ação ou alvo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="sr-only">Data de Início</label>
                    <input 
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                 <div>
                    <label htmlFor="endDate" className="sr-only">Data Final</label>
                    <input 
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-end mb-4">
                <button 
                    onClick={clearFilters}
                    className="flex items-center text-sm text-fit-gray hover:text-fit-dark-blue dark:hover:text-white transition-colors"
                >
                    <X size={14} className="mr-1" />
                    Limpar Filtros
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('timestamp')}>
                                <div className="flex items-center gap-2">Data/Hora {getSortIcon('timestamp')}</div>
                            </th>
                             <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('user')}>
                                <div className="flex items-center gap-2">Usuário {getSortIcon('user')}</div>
                            </th>
                             <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('action')}>
                                <div className="flex items-center gap-2">Ação {getSortIcon('action')}</div>
                            </th>
                             <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('target')}>
                                <div className="flex items-center gap-2">Alvo {getSortIcon('target')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedLogs.map(log => (
                            <tr key={log.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{log.user.name}</div>
                                    <div className={`text-xs ${getRoleClass(log.user.role)}`}>{log.user.role}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                        {log.action}
                                    </span>
                                </td>
                                 <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{log.target.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{log.target.type}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default RegistroAtividades;