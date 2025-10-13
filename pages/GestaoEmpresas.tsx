import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Search, Building, AlertTriangle, CheckCircle, ArrowDown, ArrowUp, Link as LinkIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { generateMockEmpresas } from '../lib/mockData';
import { Empresa, Setor } from '../types';
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
    // Fix: Use a single state object for the form data to match the Empresa type.
    const initialFormState: Omit<Empresa, 'empresaId' | 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco' | 'irsHistory'> = {
        nomeEmpresa: '',
        status: 'Ativa',
        irs: 75,
        website: '',
        cnpj: '',
        setor: 'Tecnologia',
        cultura: '',
        dataCriacao: new Date().toISOString().split('T')[0],
        endereco: { rua: '', bairro: '', cidade: '', cep: '' },
        contato: { email: '', telefone: '' },
    };
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            if (companyToEdit) {
                 setFormData({
                    nomeEmpresa: companyToEdit.nomeEmpresa,
                    status: companyToEdit.status,
                    irs: companyToEdit.irs,
                    website: companyToEdit.website || '',
                    cnpj: companyToEdit.cnpj,
                    setor: companyToEdit.setor,
                    cultura: companyToEdit.cultura,
                    dataCriacao: companyToEdit.dataCriacao,
                    endereco: companyToEdit.endereco,
                    contato: companyToEdit.contato,
                });
            } else {
                setFormData(initialFormState);
            }
            setErrors({});
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length > 1) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: { ...prev[keys[0] as keyof typeof prev] as object, [keys[1]]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        
        if (!formData.nomeEmpresa.trim()) {
            newErrors.nomeEmpresa = "O nome da empresa é obrigatório.";
        }
        if (formData.website && formData.website.trim() && !isValidUrl(formData.website)) {
            newErrors.website = "Por favor, insira uma URL válida (ex: https://site.com).";
        }
        if (!formData.cnpj.trim()) {
            newErrors.cnpj = "O CNPJ é obrigatório.";
        }
        
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        // Fix: Pass the complete formData object to onSave, ensuring it matches the expected type.
        onSave({ ...formData, irs: Number(formData.irs) });
    };

    const setores: Setor[] = ['Tecnologia', 'Indústria', 'Logística', 'Varejo', 'Saúde'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {companyToEdit ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                            <input 
                                type="text" 
                                id="nomeEmpresa"
                                name="nomeEmpresa"
                                value={formData.nomeEmpresa}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.nomeEmpresa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 ${errors.nomeEmpresa ? 'dark:border-red-500' : 'dark:border-gray-600'} sm:text-sm`}
                                required
                            />
                            {errors.nomeEmpresa && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.nomeEmpresa}</p>}
                        </div>

                        <div>
                            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ</label>
                            <input 
                                type="text" 
                                id="cnpj"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 ${errors.cnpj ? 'dark:border-red-500' : 'dark:border-gray-600'} sm:text-sm`}
                                required
                            />
                            {errors.cnpj && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.cnpj}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website URL (Opcional)</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://suaempresa.com"
                                className={`mt-1 block w-full px-3 py-2 border ${errors.website ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 ${errors.website ? 'dark:border-red-500' : 'dark:border-gray-600'} sm:text-sm`}
                            />
                            {errors.website && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.website}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="setor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Setor</label>
                            <select 
                                id="setor"
                                name="setor"
                                value={formData.setor}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm rounded-md"
                            >
                                {setores.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="dataCriacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Criação</label>
                            <input 
                                type="date"
                                id="dataCriacao"
                                name="dataCriacao"
                                value={formData.dataCriacao}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                            <label htmlFor="cultura" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cultura da Empresa</label>
                            <textarea
                                id="cultura"
                                name="cultura"
                                value={formData.cultura}
                                onChange={handleChange}
                                rows={2}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                            />
                        </div>

                        <h4 className="font-semibold pt-2 border-t dark:border-gray-700">Endereço</h4>
                        <input name="endereco.rua" value={formData.endereco.rua} onChange={handleChange} placeholder="Rua e Número" className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="endereco.bairro" value={formData.endereco.bairro} onChange={handleChange} placeholder="Bairro"  className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            <input name="endereco.cidade" value={formData.endereco.cidade} onChange={handleChange} placeholder="Cidade e Estado"  className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            <input name="endereco.cep" value={formData.endereco.cep} onChange={handleChange} placeholder="CEP"  className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>

                        <h4 className="font-semibold pt-2 border-t dark:border-gray-700">Contato</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="contato.email" type="email" value={formData.contato.email} onChange={handleChange} placeholder="Email de Contato" className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            <input name="contato.telefone" value={formData.contato.telefone} onChange={handleChange} placeholder="Telefone" className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t dark:border-gray-700">
                            <div>
                                <label htmlFor="company-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select 
                                    id="company-status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm rounded-md"
                                >
                                    <option value="Ativa">Ativa</option>
                                    <option value="Inativa">Inativa</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="company-irs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Índice de Risco de Saúde (IRS)</label>
                                <input 
                                    type="number" 
                                    id="company-irs"
                                    name="irs"
                                    value={formData.irs}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fit-dark-blue focus:border-fit-dark-blue dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3 rounded-b-lg">
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
