import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Search, Building, ArrowLeft, User, BarChart2, Activity, Upload } from 'lucide-react';
import { Empresa, Funcionario, RiscoNivel, PlanoExercicio, Setor } from '../../types';
import BulkImportModal from '../ui/BulkImportModal';

const PLANOS_EXERCICIO_BASE: Omit<PlanoExercicio, 'progresso'>[] = [
    { nome: 'Caminhada Diária', meta: '10.000 passos por dia', frequencia: 'Diariamente' },
    { nome: 'Ginástica Laboral', meta: 'Participar de 3 sessões', frequencia: '3x por semana' },
];

const getDefaultFuncionario = (empresa: Empresa): Partial<Funcionario> => ({
    nome: '', email: '', cargo: '',
    empresaId: empresa.empresaId, empresaNome: empresa.nomeEmpresa, setor: empresa.setor,
    dataAdmissao: new Date().toISOString().split('T')[0], fitScore: 75, risco: 'Baixo',
    metricas: { sono: 7, estresse: 40, humor: 4, energia: 4 },
    planoExercicio: { ...PLANOS_EXERCICIO_BASE[0], progresso: 0 },
    metas: [],
});

const FuncionarioModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (funcionarioData: Funcionario) => void;
  funcionarioToEdit: Funcionario | null;
  empresa: Empresa;
}> = ({ isOpen, onClose, onSave, funcionarioToEdit, empresa }) => {
    const [formData, setFormData] = useState<Partial<Funcionario>>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [activeTab, setActiveTab] = useState<'pessoal' | 'saude' | 'plano'>('pessoal');

    React.useEffect(() => {
        if (isOpen) {
            setFormData(funcionarioToEdit ? { ...funcionarioToEdit } : getDefaultFuncionario(empresa));
            setErrors({});
            setActiveTab('pessoal');
        }
    }, [isOpen, funcionarioToEdit, empresa]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { /* ... */ };
    const handleNestedChange = (parent: 'metricas' | 'planoExercicio', field: string, value: string | number) => { /* ... */ };
    const handlePlanoChange = (e: React.ChangeEvent<HTMLSelectElement>) => { /* ... */ };

    const validate = () => { /* ... */ return true; };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validate()) return;
        const finalData = {
            ...getDefaultFuncionario(empresa),
            ...funcionarioToEdit,
            ...formData,
            id: funcionarioToEdit?.id || `f${Date.now()}`,
            avatarUrl: funcionarioToEdit?.avatarUrl || `https://i.pravatar.cc/150?u=f${Date.now()}`,
            historicoFitScore: funcionarioToEdit?.historicoFitScore || [],
        } as Funcionario;
        onSave(finalData);
    };

    const tabClasses = (tabName: typeof activeTab) => `...`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            {/* Modal JSX remains the same */}
        </div>
    );
};

const getRiscoClass = (risco: RiscoNivel) => { /* ... */ };

interface EmpresaFuncionariosViewProps {
    empresa: Empresa;
    funcionarios: Funcionario[];
    onBack: () => void;
    onSaveFuncionario: (func: Funcionario, isEditing: boolean) => void;
    onDeleteFuncionario: (id: string) => void;
    onImportFuncionarios: (newFuncionarios: Funcionario[]) => void;
}

const EmpresaFuncionariosView: React.FC<EmpresaFuncionariosViewProps> = ({ 
    empresa, 
    funcionarios, 
    onBack, 
    onSaveFuncionario, 
    onDeleteFuncionario, 
    onImportFuncionarios 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ cargo: 'all', setor: 'all', risco: 'all' });
    const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
    const [funcionarioToEdit, setFuncionarioToEdit] = useState<Funcionario | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const uniqueCargos = useMemo(() => [...new Set(funcionarios.map(f => f.cargo))], [funcionarios]);
    const uniqueSetores = useMemo(() => [...new Set(funcionarios.map(f => f.setor))], [funcionarios]);

    const filteredFuncionarios = useMemo(() => {
        return funcionarios.filter(f => {
            const searchMatch = searchTerm === '' || f.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const cargoMatch = filters.cargo === 'all' || f.cargo === filters.cargo;
            const setorMatch = filters.setor === 'all' || f.setor === filters.setor;
            const riscoMatch = filters.risco === 'all' || f.risco === filters.risco;
            return searchMatch && cargoMatch && setorMatch && riscoMatch;
        });
    }, [funcionarios, searchTerm, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const handleOpenAddModal = () => {
        setFuncionarioToEdit(null);
        setIsFuncionarioModalOpen(true);
    };

    const handleOpenEditModal = (func: Funcionario) => {
        setFuncionarioToEdit(func);
        setIsFuncionarioModalOpen(true);
    };

    const handleSave = (func: Funcionario) => {
        onSaveFuncionario(func, !!funcionarioToEdit);
        setIsFuncionarioModalOpen(false);
    };

    const handleImport = (importedData: Partial<Funcionario>[]) => {
        const newFuncionarios = importedData.map((data, index) => ({
            ...getDefaultFuncionario(empresa),
            ...data,
            id: `f-import-${Date.now()}-${index}`,
            avatarUrl: `https://i.pravatar.cc/150?u=f-import-${Date.now()}-${index}`,
        } as Funcionario));
        onImportFuncionarios(newFuncionarios);
        setIsImportModalOpen(false);
    };

    return (
        <>
            <div className="space-y-6">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para Gestão de Empresas
                </button>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="flex items-center">
                             <Building size={24} className="text-fit-dark-blue mr-3" />
                             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Funcionários de {empresa.nomeEmpresa}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsImportModalOpen(true)} className="flex items-center bg-gray-100 dark:bg-gray-700 text-fit-dark-blue dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap text-sm">
                                <Upload size={14} className="mr-2" />
                                Importar
                            </button>
                            <button onClick={handleOpenAddModal} className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap text-sm">
                                <Plus size={16} className="mr-2" />
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    {/* Filter controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* ... */}
                    </div>
                    {/* Employee table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                             {/* ... table header ... */}
                            <tbody>
                                {filteredFuncionarios.map(func => (
                                    <tr key={func.id} className="...etc...">
                                        {/* ... table cells ... */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-4">
                                                <button onClick={() => handleOpenEditModal(func)}><Edit size={16} /></button>
                                                <button onClick={() => onDeleteFuncionario(func.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {/* ... empty state ... */}
                    </div>
                 </div>
            </div>
            <FuncionarioModal 
                isOpen={isFuncionarioModalOpen}
                onClose={() => setIsFuncionarioModalOpen(false)}
                onSave={handleSave}
                funcionarioToEdit={funcionarioToEdit}
                empresa={empresa}
            />
            <BulkImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onComplete={handleImport}
            />
        </>
    );
};

export default EmpresaFuncionariosView;
