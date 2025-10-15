import React, { useState } from 'react';
import { Plus, Building, X } from 'lucide-react';
// FIX: Add .ts extension
import { Empresa } from '../types.ts';
// FIX: Add .tsx extension
import EmpresaListView from '../components/views/EmpresaListView.tsx';
import EmpresaFuncionariosView from '../components/views/EmpresaFuncionariosView.tsx';
// FIX: Add .tsx extension
import { useData } from '../hooks/useData.tsx';
import { formatCNPJ } from '../lib/utils.ts';
import ConfirmationModal from '../components/ui/ConfirmationModal.tsx';

// FIX: Moved EmpresaModal outside of GestaoEmpresas to prevent hook order errors.
const EmpresaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (empresaData: Partial<Empresa>) => void;
  empresaToEdit: Empresa | null;
}> = ({ isOpen, onClose, onSave, empresaToEdit }) => {
    const [formData, setFormData] = useState<Partial<Empresa>>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    React.useEffect(() => {
        if (isOpen) {
            setFormData(empresaToEdit || { status: 'Ativa', setor: 'Tecnologia', contato: { telefone: '', email: '' }, endereco: { rua: '', bairro: '', cidade: '', cep: '' } });
            setErrors({});
        }
    }, [isOpen, empresaToEdit]);

    if (!isOpen) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length > 1) {
            const [parentKey, childKey] = keys;
            setFormData(prev => ({
                ...prev,
                [parentKey]: {
                    ...((prev[parentKey as keyof Partial<Empresa>] || {}) as object),
                    [childKey]: value
                }
            }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const validate = () => {
        const newErrors: { [key:string]: string } = {};
        if (!formData.nomeEmpresa?.trim()) newErrors.nomeEmpresa = "O nome é obrigatório.";
        if (!formData.cnpj?.trim()) newErrors.cnpj = "O CNPJ é obrigatório.";
        else if (formData.cnpj.length !== 18) newErrors.cnpj = "CNPJ inválido.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{empresaToEdit ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Empresa</label>
                            <input name="nomeEmpresa" value={formData.nomeEmpresa || ''} onChange={handleChange} />
                            {errors.nomeEmpresa && <p className="text-xs text-red-500 mt-1">{errors.nomeEmpresa}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ</label>
                            <input name="cnpj" value={formData.cnpj || ''} onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'cnpj', value: formatCNPJ(e.target.value) } })} />
                            {errors.cnpj && <p className="text-xs text-red-500 mt-1">{errors.cnpj}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setor</label>
                            <select name="setor" value={formData.setor || 'Tecnologia'} onChange={handleChange}>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Indústria">Indústria</option>
                                <option value="Logística">Logística</option>
                                <option value="Varejo">Varejo</option>
                                <option value="Saúde">Saúde</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select name="status" value={formData.status || 'Ativa'} onChange={handleChange}>
                                <option value="Ativa">Ativa</option>
                                <option value="Inativa">Inativa</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-2">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Endereço</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua e Número</label>
                                <input name="endereco.rua" value={formData.endereco?.rua || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</label>
                                <input name="endereco.bairro" value={formData.endereco?.bairro || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade e Estado</label>
                                <input name="endereco.cidade" value={formData.endereco?.cidade || ''} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                     <div className="pt-2">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Contato</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de Contato</label>
                                <input type="email" name="contato.email" value={formData.contato?.email || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                                <input name="contato.telefone" value={formData.contato?.telefone || ''} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t dark:border-gray-700 mt-4 space-x-3">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {empresaToEdit ? 'Salvar Alterações' : 'Salvar Empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GestaoEmpresas: React.FC = () => {
    const { empresas, addEmpresa, updateEmpresa, deleteEmpresa } = useData();
    const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
    const [empresaToEdit, setEmpresaToEdit] = useState<Empresa | null>(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);

    const handleOpenAddEmpresaModal = () => {
        setEmpresaToEdit(null);
        setIsEmpresaModalOpen(true);
    };

    const handleOpenEditEmpresaModal = (empresa: Empresa) => {
        setEmpresaToEdit(empresa);
        setIsEmpresaModalOpen(true);
    };
    
    const handleSaveEmpresa = (empresaData: Partial<Empresa>) => {
        if (empresaToEdit) {
            updateEmpresa({ ...empresaToEdit, ...empresaData });
        } else {
            addEmpresa(empresaData);
        }
        setIsEmpresaModalOpen(false);
    };

    const handleDeleteEmpresa = () => {
        if (empresaToDelete) {
            deleteEmpresa(empresaToDelete.empresaId);
            setEmpresaToDelete(null);
        }
    };

    return (
        <>
            {/* Main container to ensure a stable component tree */}
            <div>
                {/* Company List View */}
                <div style={{ display: selectedEmpresa ? 'none' : 'block' }}>
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center">
                                    <Building size={24} className="text-fit-dark-blue mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestão de Empresas</h2>
                                </div>
                                <button onClick={handleOpenAddEmpresaModal} className="btn btn-primary">
                                    <Plus size={16} className="mr-2" />
                                    Adicionar Empresa
                                </button>
                            </div>
                        </div>
                        <EmpresaListView
                            empresas={empresas}
                            onSelectEmpresa={setSelectedEmpresa}
                            onEditEmpresa={handleOpenEditEmpresaModal}
                            onDeleteEmpresa={(empresa) => setEmpresaToDelete(empresa)}
                        />
                    </div>
                </div>

                {/* Employee Management View */}
                <div style={{ display: selectedEmpresa ? 'block' : 'none' }}>
                    {selectedEmpresa && (
                        <EmpresaFuncionariosView
                            empresa={selectedEmpresa}
                            onBack={() => setSelectedEmpresa(null)}
                        />
                    )}
                </div>
            </div>
            
            <EmpresaModal
                isOpen={isEmpresaModalOpen}
                onClose={() => setIsEmpresaModalOpen(false)}
                onSave={handleSaveEmpresa}
                empresaToEdit={empresaToEdit}
            />
            <ConfirmationModal
                isOpen={!!empresaToDelete}
                onClose={() => setEmpresaToDelete(null)}
                onConfirm={handleDeleteEmpresa}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir a empresa "${empresaToDelete?.nomeEmpresa}"? Esta ação não pode ser desfeita e excluirá todos os seus funcionários.`}
            />
        </>
    );
};

export default GestaoEmpresas;