import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { generateMockFuncionarios, generateMockEmpresas } from '../lib/mockData';
import { Funcionario, Empresa, RiscoNivel, Setor } from '../types';
import { useAuth } from '../hooks/useAuth.tsx';
import AccessDenied from '../components/ui/AccessDenied';

// Modal Component to Add/Edit a Funcionario
const FuncionarioModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (funcionario: Omit<Funcionario, 'id' | 'avatarUrl' | 'historicoFitScore' | 'metricas' | 'risco'>) => void;
  funcionarioToEdit: Funcionario | null;
  empresas: Empresa[];
}> = ({ isOpen, onClose, onSave, funcionarioToEdit, empresas }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cargo: '',
        empresaId: '',
        setor: 'Tecnologia' as Setor,
        dataAdmissao: new Date().toISOString().split('T')[0],
        fitScore: 75,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen && funcionarioToEdit) {
            setFormData({
                nome: funcionarioToEdit.nome,
                email: funcionarioToEdit.email,
                cargo: funcionarioToEdit.cargo,
                empresaId: funcionarioToEdit.empresaId,
                setor: funcionarioToEdit.setor,
                dataAdmissao: funcionarioToEdit.dataAdmissao,
                fitScore: funcionarioToEdit.fitScore,
            });
            setErrors({});
        } else {
            // Reset for adding a new one
            setFormData({
                nome: '',
                email: '',
                cargo: '',
                empresaId: empresas.length > 0 ? empresas[0].empresaId : '',
                setor: 'Tecnologia' as Setor,
                dataAdmissao: new Date().toISOString().split('T')[0],
                fitScore: 75,
            });
            setErrors({});
        }
    }, [isOpen, funcionarioToEdit, empresas]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nome.trim()) newErrors.nome = "O nome é obrigatório.";
        if (!formData.email.trim()) newErrors.email = "O email é obrigatório.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
        if (!formData.cargo.trim()) newErrors.cargo = "O cargo é obrigatório.";
        if (!formData.empresaId) newErrors.empresaId = "A empresa é obrigatória.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        const empresa = empresas.find(e => e.empresaId === formData.empresaId);
        if (!empresa) return;

        // FIX: The `onSave` callback requires the `metas` property.
        // This also fixes a bug where editing a user would reset their exercise plan and goals.
        onSave({
            ...formData,
            fitScore: Number(formData.fitScore),
            empresaNome: empresa.nomeEmpresa,
            planoExercicio: funcionarioToEdit?.planoExercicio || { nome: 'Caminhada Diária', meta: '10.000 passos por dia', frequencia: 'Diariamente', progresso: 0 },
            metas: funcionarioToEdit?.metas || [],
        });
    };

    const setores: Setor[] = ['Tecnologia', 'Indústria', 'Logística', 'Varejo', 'Saúde'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {funcionarioToEdit ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Form Fields */}
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                        {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                     <div>
                        <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
                        <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} />
                         {errors.cargo && <p className="mt-1 text-xs text-red-500">{errors.cargo}</p>}
                    </div>
                     <div>
                        <label htmlFor="empresaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
                        <select name="empresaId" value={formData.empresaId} onChange={handleChange}>
                            {empresas.map(e => <option key={e.empresaId} value={e.empresaId}>{e.nomeEmpresa}</option>)}
                        </select>
                        {errors.empresaId && <p className="mt-1 text-xs text-red-500">{errors.empresaId}</p>}
                    </div>
                    <div>
                        <label htmlFor="setor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Setor</label>
                         <select name="setor" value={formData.setor} onChange={handleChange}>
                            {setores.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="dataAdmissao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Admissão</label>
                        <input type="date" name="dataAdmissao" value={formData.dataAdmissao} onChange={handleChange} />
                    </div>
                    {/* Submit Buttons */}
                    <div className="mt-6 flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-fit-dark-blue border border-transparent rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none">
                            {funcionarioToEdit ? 'Salvar Alterações' : 'Salvar Funcionário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const GestaoFuncionarios: React.FC = () => {
    const { user } = useAuth();
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [funcionarioToEdit, setFuncionarioToEdit] = useState<Funcionario | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [empresaFilter, setEmpresaFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Funcionario; direction: 'asc' | 'desc' } | null>({ key: 'nome', direction: 'asc' });

    useEffect(() => {
        setFuncionarios(generateMockFuncionarios());
        setEmpresas(generateMockEmpresas());
    }, []);

    const filteredAndSortedFuncionarios = useMemo(() => {
        let filtered = [...funcionarios];
        if (empresaFilter !== 'all') {
            filtered = filtered.filter(f => f.empresaId === empresaFilter);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(f => f.nome.toLowerCase().includes(lower) || f.email.toLowerCase().includes(lower) || f.cargo.toLowerCase().includes(lower));
        }
        if (sortConfig) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [funcionarios, searchTerm, empresaFilter, sortConfig]);

    if (user?.papel !== 'superadmin') {
        return <AccessDenied />;
    }

    const requestSort = (key: keyof Funcionario) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Funcionario) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    const handleOpenAddModal = () => {
        setFuncionarioToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (func: Funcionario) => {
        setFuncionarioToEdit(func);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFuncionarioToEdit(null);
    };

    const handleSaveFuncionario = (data: Omit<Funcionario, 'id' | 'avatarUrl' | 'historicoFitScore' | 'metricas' | 'risco'>) => {
        if (funcionarioToEdit) {
            setFuncionarios(prev => prev.map(f => f.id === funcionarioToEdit.id ? { ...funcionarioToEdit, ...data } : f));
        } else {
            const newFuncionario: Funcionario = {
                ...data,
                id: `f${Date.now()}`,
                risco: data.fitScore < 60 ? 'Alto' : data.fitScore < 80 ? 'Médio' : 'Baixo',
                avatarUrl: `https://i.pravatar.cc/150?u=f${Date.now()}`,
                historicoFitScore: [],
                metricas: { sono: 7, estresse: 40, humor: 4, energia: 4 },
                planoExercicio: data.planoExercicio,
                metas: data.metas,
            };
            setFuncionarios(prev => [newFuncionario, ...prev]);
        }
        handleCloseModal();
    };

    const handleDeleteFuncionario = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
            setFuncionarios(prev => prev.filter(f => f.id !== id));
        }
    };
    
    const getRiscoClass = (risco: RiscoNivel) => {
        switch (risco) {
            case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Gestão de Funcionários</h3>
                    <div className="flex w-full md:w-auto items-center gap-4">
                        <div className="flex-grow relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Buscar funcionário..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <select value={empresaFilter} onChange={e => setEmpresaFilter(e.target.value)}>
                            <option value="all">Todas as Empresas</option>
                            {empresas.map(e => <option key={e.empresaId} value={e.empresaId}>{e.nomeEmpresa}</option>)}
                        </select>
                        <button onClick={handleOpenAddModal} className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">
                            <Plus size={16} className="mr-2" />
                            Adicionar Funcionário
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('nome')}>Nome {getSortIcon('nome')}</th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('empresaNome')}>Empresa {getSortIcon('empresaNome')}</th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('fitScore')}>FitScore {getSortIcon('fitScore')}</th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('risco')}>Risco {getSortIcon('risco')}</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedFuncionarios.map(func => (
                                <tr key={func.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img src={func.avatarUrl} alt={func.nome} className="w-10 h-10 rounded-full mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{func.nome}</p>
                                                <p className="text-xs text-gray-500">{func.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{func.empresaNome}</td>
                                    <td className="px-6 py-4 font-bold">{func.fitScore}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiscoClass(func.risco)}`}>{func.risco}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-4">
                                            <button onClick={() => handleOpenEditModal(func)} className="text-fit-gray hover:text-fit-dark-blue">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteFuncionario(func.id)} className="text-fit-gray hover:text-fit-red">
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

            <FuncionarioModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveFuncionario}
                funcionarioToEdit={funcionarioToEdit}
                empresas={empresas}
            />
        </>
    );
};

export default GestaoFuncionarios;