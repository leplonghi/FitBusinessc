import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Search, Building, AlertTriangle, CheckCircle, ArrowDown, ArrowUp, Link as LinkIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { generateMockEmpresas } from '../lib/mockData';
import { Empresa } from '../types';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from '../components/ui/AccessDenied';

// Modal Component to Add/Edit a Company
const CompanyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Omit<Empresa, 'empresaId' | 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco'>) => void;
  companyToEdit: Empresa | null;
}> = ({ isOpen, onClose, onSave, companyToEdit }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'Ativa' | 'Inativa'>('Ativa');
    const [irs, setIrs] = useState(75);
    const [website, setWebsite] = useState('');
    const [nameError, setNameError] = useState('');
    const [websiteError, setWebsiteError] = useState('');

    useEffect(() => {
        if (isOpen && companyToEdit) {
            setName(companyToEdit.nomeEmpresa);
            setStatus(companyToEdit.status);
            setIrs(companyToEdit.irs);
            setWebsite(companyToEdit.website || '');
            setNameError('');
            setWebsiteError('');
        } else {
            // Reset for adding a new company
            setName('');
            setStatus('Ativa');
            setIrs(75);
            setWebsite('');
            setNameError('');
            setWebsiteError('');
        }
    }, [isOpen, companyToEdit]);

    if (!isOpen) return null;

    const isValidUrl = (urlString: string) => {
        try {
            // Use a simple regex for better UX, as new URL() is strict (requires http://)
            const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(urlString);
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let hasErrors = false;
        
        if (!name.trim()) {
            setNameError("O nome da empresa é obrigatório.");
            hasErrors = true;
        } else {
            setNameError('');
        }

        if (website.trim() && !isValidUrl(website)) {
            setWebsiteError("Por favor, insira uma URL válida (ex: https://site.com).");
            hasErrors = true;
        } else {
            setWebsiteError('');
        }

        if (hasErrors) return;

        onSave({ nomeEmpresa: name, status, irs: Number(irs), website });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {companyToEdit ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                            <input 
                                type="text" 
                                id="company-name"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value)
                                    if (nameError) setNameError('');
                                }}
                                className={`mt-1 block w-full px-3 py-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 ${nameError ? 'dark:border-red-500' : 'dark:border-gray-600'} sm:text-sm`}
                                required
                                aria-describedby="company-name-error"
                            />
                            {nameError && <p id="company-name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
                        </div>
                        <div>
                            <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website URL (Opcional)</label>
                            <input
                                type="url"
                                id="company-website"
                                value={website}
                                onChange={e => {
                                    setWebsite(e.target.value)
                                    if (websiteError) setWebsiteError('');
                                }}
                                placeholder="https://suaempresa.com"
                                className={`mt-1 block w-full px-3 py-2 border ${websiteError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 ${websiteError ? 'dark:border-red-500' : 'dark:border-gray-600'} sm:text-sm`}
                                aria-describedby="company-website-error"
                            />
                            {websiteError && <p id="company-website-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{websiteError}</p>}
                        </div>
                        <div>
                            <label htmlFor="company-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select 
                                id="company-status"
                                value={status}
                                onChange={e => setStatus(e.target.value as 'Ativa' | 'Inativa')}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm rounded-md"
                            >
                                <option>Ativa</option>
                                <option>Inativa</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="company-irs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Índice de Risco de Saúde (IRS)</label>
                            <input 
                                type="number" 
                                id="company-irs"
                                value={irs}
                                onChange={e => setIrs(parseInt(e.target.value, 10))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                                min="0"
                                max="100"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-fit-dark-blue border border-transparent rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none">
                            {companyToEdit ? 'Salvar Alterações' : 'Salvar Empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

type SortableKeys = keyof Empresa;
type HeaderKey = SortableKeys | 'irsHistory';

const GestaoEmpresas: React.FC = () => {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Empresa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativa' | 'Inativa'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'nomeEmpresa', direction: 'asc' });


  useEffect(() => {
    setEmpresas(generateMockEmpresas());
  }, []);

  const filteredAndSortedEmpresas = useMemo(() => {
    let filtered = [...empresas];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(e => e.nomeEmpresa.toLowerCase().includes(lowercasedTerm));
    }

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || aValue === null || aValue === '') return 1;
        if (bValue === undefined || bValue === null || bValue === '') return -1;
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
  }, [empresas, searchTerm, statusFilter, sortConfig]);

  if (user?.papel !== 'superadmin') {
      return <AccessDenied />;
  }

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

  const handleOpenAddModal = () => {
    setCompanyToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company: Empresa) => {
    setCompanyToEdit(company);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCompanyToEdit(null);
  };

  const handleSaveCompany = (companyData: Omit<Empresa, 'empresaId' | 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco'>) => {
    if (companyToEdit) {
      // Editing existing company
      setEmpresas(prev => prev.map(emp => 
        emp.empresaId === companyToEdit.empresaId 
          ? { ...emp, ...companyData } 
          : emp
      ));
    } else {
      // Adding new company
      const newCompany: Empresa = {
        ...companyData,
        empresaId: `e${Date.now()}`,
        funcionariosAtivos: 0,
        mediaFitScore: Math.round(Math.random() * 30 + 60),
        taxaEngajamento: Math.round(Math.random() * 25 + 70),
        alertasRisco: 0,
        irsHistory: Array.from({ length: 6 }, () => ({ date: new Date().toISOString(), irs: companyData.irs })),
      };
      setEmpresas(prev => [newCompany, ...prev]);
    }
    handleCloseModal();
  };
  
  const handleDeleteCompany = (empresaId: string) => {
      if (window.confirm("Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.")) {
          setEmpresas(prev => prev.filter(e => e.empresaId !== empresaId));
      }
  };

  const getStatusClass = (status: 'Ativa' | 'Inativa') => {
    return status === 'Ativa' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  };

  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.filter(e => e.status === 'Ativa').length;
  const empresasAltoRisco = empresas.filter(e => e.irs < 50).length;

  const headers: { key: HeaderKey; label: string; sortable: boolean }[] = [
      { key: 'nomeEmpresa', label: 'Nome da Empresa', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'irs', label: 'IRS', sortable: true },
      { key: 'irsHistory', label: 'Tendência IRS (6m)', sortable: false },
      { key: 'website', label: 'Website', sortable: true },
      { key: 'funcionariosAtivos', label: 'Funcionários', sortable: true },
      { key: 'mediaFitScore', label: 'FitScore Médio', sortable: true },
      { key: 'alertasRisco', label: 'Alertas', sortable: true },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total de Empresas" value={totalEmpresas} icon={<Building className="text-fit-dark-blue" />} />
            <Card title="Empresas Ativas" value={empresasAtivas} icon={<CheckCircle className="text-fit-dark-blue" />} />
            <Card title="Empresas em Alto Risco" value={empresasAltoRisco} icon={<AlertTriangle className="text-fit-dark-blue" />} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="w-full md:w-1/2 lg:w-1/3 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por nome da empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Ativa' | 'Inativa')}
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="Ativa">Ativa</option>
                        <option value="Inativa">Inativa</option>
                    </select>
                    <button 
                        onClick={handleOpenAddModal}
                        className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                    >
                        <Plus size={16} className="mr-2" />
                        Adicionar Empresa
                    </button>
                </div>
            </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                    {headers.map(({ key, label, sortable }) => (
                         <th scope="col" className={`px-6 py-3 ${sortable ? 'cursor-pointer' : ''}`} key={key} onClick={() => sortable && requestSort(key as SortableKeys)}>
                            <div className="flex items-center gap-2">
                                {label}
                                {sortable && getSortIcon(key as SortableKeys)}
                            </div>
                         </th>
                    ))}
                  <th scope="col" className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedEmpresas.map((empresa) => (
                  <tr key={empresa.empresaId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {empresa.nomeEmpresa}
                    </th>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(empresa.status)}`}>
                        {empresa.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{empresa.irs}</td>
                    <td className="px-6 py-4">
                      {empresa.irsHistory && empresa.irsHistory.length > 0 ? (
                        <div style={{ width: '120px', height: '40px' }}>
                          <ResponsiveContainer>
                            <LineChart data={empresa.irsHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <Line
                                type="monotone"
                                dataKey="irs"
                                stroke={empresa.irs < 50 ? '#E53E3E' : empresa.irs < 80 ? '#F6AD55' : '#48BB78'}
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {empresa.website ? (
                        <a href={empresa.website} target="_blank" rel="noopener noreferrer" className="text-fit-dark-blue hover:underline dark:text-blue-400 flex items-center gap-1">
                          <LinkIcon size={14} />
                          Visitar
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{empresa.funcionariosAtivos}</td>
                    <td className="px-6 py-4">{empresa.mediaFitScore}</td>
                    <td className="px-6 py-4">{empresa.alertasRisco}</td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => handleOpenEditModal(empresa)} className="text-fit-gray hover:text-fit-dark-blue dark:hover:text-white" aria-label={`Editar ${empresa.nomeEmpresa}`}>
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteCompany(empresa.empresaId)} className="text-fit-gray hover:text-fit-red dark:hover:text-red-400" aria-label={`Excluir ${empresa.nomeEmpresa}`}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CompanyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCompany}
        companyToEdit={companyToEdit}
      />
    </>
  );
};

export default GestaoEmpresas;
