import React, { useState, useMemo, useEffect } from 'react';
import { Search, History, ArrowUp, ArrowDown, X } from 'lucide-react';
// FIX: Add .ts extension
import { generateMockAuditLogs } from '../lib/mockData.ts';
import { AuditLog } from '../types.ts';

type SortableKeys = 'user' | 'action' | 'target' | 'timestamp';

const LOGS_PER_PAGE = 10;

const RegistroAtividades: React.FC = () => {
  const allLogs = useMemo(() => generateMockAuditLogs(), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

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
  
  // Reset to the first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedLogs.length / LOGS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
    return filteredAndSortedLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);
  }, [currentPage, filteredAndSortedLogs]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5; 
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        let startPage = Math.max(2, currentPage - halfPagesToShow);
        let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);
        if (currentPage - halfPagesToShow <= 2) {
            endPage = 1 + maxPagesToShow;
        }
        if (currentPage + halfPagesToShow >= totalPages - 1) {
            startPage = totalPages - maxPagesToShow;
        }
        if (startPage > 2) {
            pages.push('...');
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  const clearFilters = () => {
      setSearchTerm('');
      setStartDate('');
      setEndDate('');
      setSortConfig({ key: 'timestamp', direction: 'desc' });
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

  return (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
                <History size={24} className="text-fit-dark-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Registro de Atividades (Audit Log)</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
                Visualize todas as ações importantes realizadas na plataforma para fins de segurança e auditoria.
            </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="lg:col-span-2 relative">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por usuário, ação ou alvo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
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
                    className="btn btn-link"
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
                        {paginatedLogs.map(log => (
                            <tr key={log.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{log.user.name}</div>
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
                         {paginatedLogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t dark:border-gray-700">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Página {currentPage} de {totalPages}
                        <span className="hidden sm:inline"> ({filteredAndSortedLogs.length} resultados)</span>
                    </span>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="btn btn-secondary"
                        >
                            Anterior
                        </button>

                        <div className="hidden sm:flex items-center space-x-1">
                            {pageNumbers.map((page, index) =>
                                typeof page === 'number' ? (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(page)}
                                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span key={index} className="px-3 py-1 text-sm text-gray-500">
                                        {page}
                                    </span>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="btn btn-secondary"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default RegistroAtividades;