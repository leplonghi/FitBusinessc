import React, { useState, useMemo } from 'react';
import { ArrowLeft, Building, Plus, Trash2, Upload, Search, Edit, AlertCircle } from 'lucide-react';
// FIX: Add .ts extension
import { Empresa, Funcionario } from '../../types.ts';
import BulkImportModal from '../ui/BulkImportModal.tsx';
import FuncionarioDetalheModal from '../modals/FuncionarioDetalheModal.tsx';
// FIX: Add .tsx extension
import { useData } from '../../hooks/useData.tsx';
import { getRiscoClass } from '../../lib/utils.ts';
// FIX: Add .tsx extension
import FuncionarioModal from '../modals/FuncionarioModal.tsx';
import ConfirmationModal from '../ui/ConfirmationModal.tsx';

interface EmpresaFuncionariosViewProps {
    empresa: Empresa;
    onBack: () => void;
}

const EmpresaFuncionariosView: React.FC<EmpresaFuncionariosViewProps> = ({
    empresa,
    onBack,
}) => {
    const { getFuncionariosByEmpresaId, bulkDeleteFuncionarios, addFuncionario } = useData();
    const [error, setError] = useState<string | null>(null);

    const funcionarios = useMemo(() => {
        try {
            setError(null);
            return getFuncionariosByEmpresaId(empresa.empresaId);
        } catch (e) {
            console.error("Erro ao buscar funcionários:", e);
            setError("Ocorreu um erro ao carregar a lista de funcionários. Por favor, tente voltar e selecionar a empresa novamente.");
            return [];
        }
    }, [empresa.empresaId, getFuncionariosByEmpresaId]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFuncionarioIds, setSelectedFuncionarioIds] = useState<string[]>([]);
    
    // UI State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
    const [funcionarioToEdit, setFuncionarioToEdit] = useState<Funcionario | null>(null);
    const [funcionarioToViewId, setFuncionarioToViewId] = useState<string | null>(null);
    const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false);
    
    const funcionarioToView = useMemo(() => {
        if (!funcionarioToViewId) return null;
        return funcionarios.find(f => f.id === funcionarioToViewId) || null;
    }, [funcionarioToViewId, funcionarios]);

    const filteredFuncionarios = useMemo(() => {
        return funcionarios.filter(f =>
            f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.cargo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [funcionarios, searchTerm]);

    const handleOpenAddModal = () => {
        setFuncionarioToEdit(null);
        setIsFuncionarioModalOpen(true);
    };

    const handleOpenEditModal = (func: Funcionario) => {
        setFuncionarioToEdit(func);
        setIsFuncionarioModalOpen(true);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedFuncionarioIds(filteredFuncionarios.map(f => f.id));
        } else {
            setSelectedFuncionarioIds([]);
        }
    };
    
    const handleSelectOne = (id: string) => {
        setSelectedFuncionarioIds(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        bulkDeleteFuncionarios(selectedFuncionarioIds, empresa.empresaId);
        setSelectedFuncionarioIds([]);
        setIsConfirmBulkDeleteOpen(false);
    };

    const handleImportComplete = (imported: Partial<Funcionario>[]) => {
        const newFuncionarios: Omit<Funcionario, 'id'>[] = imported.map((f) => ({
            empresaId: empresa.empresaId,
            empresaNome: empresa.nomeEmpresa,
            nome: f.nome || '',
            email: f.email || '',
            cargo: f.cargo || '',
            setor: empresa.setor,
            avatarUrl: `https://i.pravatar.cc/150?u=${f.email}`,
            dataAdmissao: new Date().toISOString().split('T')[0],
            fitScore: 75,
            risco: 'Médio',
            historicoFitScore: [],
            metricas: { sono: 7, estresse: 50, humor: 4, energia: 4 },
            planoExercicio: { nome: 'Padrão', meta: 'N/A', frequencia: 'N/A', progresso: 0 },
            metas: [],
        }));
        newFuncionarios.forEach(func => addFuncionario(func));
        setIsImportModalOpen(false);
    };

    return (
        <>
            <div className="space-y-6">
                <button onClick={onBack} className="btn btn-secondary">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para Gestão de Empresas
                </button>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Building size={32} className="text-fit-dark-blue dark:text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{empresa.nomeEmpresa}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{funcionarios.length} funcionários</p>
                        </div>
                    </div>
                </div>

                {error ? (
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-red-200 dark:border-red-900/50">
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-400" />
                            <p className="mt-4 text-lg font-semibold text-red-700 dark:text-red-300">Erro ao Carregar Dados</p>
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                            <div className="w-full md:w-1/2 lg:w-1/3 relative">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email ou cargo..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedFuncionarioIds.length > 0 && (
                                    <button onClick={() => setIsConfirmBulkDeleteOpen(true)} className="btn btn-danger">
                                        <Trash2 size={16} className="mr-2" /> Excluir ({selectedFuncionarioIds.length})
                                    </button>
                                )}
                                <button onClick={() => setIsImportModalOpen(true)} className="btn btn-secondary">
                                    <Upload size={16} className="mr-2" /> Importar
                                </button>
                                <button onClick={handleOpenAddModal} className="btn btn-primary">
                                    <Plus size={16} className="mr-2" /> Adicionar
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedFuncionarioIds.length > 0 && selectedFuncionarioIds.length === filteredFuncionarios.length} /></th>
                                        <th scope="col" className="px-6 py-3">Nome</th>
                                        <th scope="col" className="px-6 py-3">Cargo</th>
                                        <th scope="col" className="px-6 py-3">FitScore</th>
                                        <th scope="col" className="px-6 py-3">Risco</th>
                                        <th scope="col" className="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFuncionarios.map(f => (
                                        <tr key={f.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="w-4 p-4"><input type="checkbox" checked={selectedFuncionarioIds.includes(f.id)} onChange={() => handleSelectOne(f.id)} onClick={e => e.stopPropagation()} /></td>
                                            <td onClick={() => setFuncionarioToViewId(f.id)} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">{f.nome}</td>
                                            <td onClick={() => setFuncionarioToViewId(f.id)} className="px-6 py-4 cursor-pointer">{f.cargo}</td>
                                            <td onClick={() => setFuncionarioToViewId(f.id)} className="px-6 py-4 cursor-pointer">{f.fitScore}</td>
                                            <td onClick={() => setFuncionarioToViewId(f.id)} className="px-6 py-4 cursor-pointer"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiscoClass(f.risco)}`}>{f.risco}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleOpenEditModal(f)} className="btn-icon" aria-label="Editar funcionário"><Edit size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredFuncionarios.length === 0 && <p className="text-center py-8 text-gray-500">Nenhum funcionário encontrado.</p>}
                        </div>
                    </div>
                )}
            </div>
            <BulkImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onComplete={handleImportComplete}
            />
            <FuncionarioDetalheModal 
                funcionario={funcionarioToView}
                onClose={() => setFuncionarioToViewId(null)}
            />
            <FuncionarioModal
                isOpen={isFuncionarioModalOpen}
                onClose={() => setIsFuncionarioModalOpen(false)}
                empresa={empresa}
                funcionarioToEdit={funcionarioToEdit}
            />
            <ConfirmationModal
                isOpen={isConfirmBulkDeleteOpen}
                onClose={() => setIsConfirmBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                title="Confirmar Exclusão em Massa"
                message={`Tem certeza que deseja excluir ${selectedFuncionarioIds.length} funcionários? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default EmpresaFuncionariosView;
