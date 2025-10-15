
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Funcionario, Empresa } from '../../types.ts';
import { useData } from '../../hooks/useData.tsx';

interface FuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresa: Empresa;
  funcionarioToEdit: Funcionario | null;
}

const FuncionarioModal: React.FC<FuncionarioModalProps> = ({ isOpen, onClose, empresa, funcionarioToEdit }) => {
    const { addFuncionario, updateFuncionario } = useData();
    const [formData, setFormData] = useState<{ nome: string; email: string; cargo: string }>({
        nome: '',
        email: '',
        cargo: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            if (funcionarioToEdit) {
                setFormData({
                    nome: funcionarioToEdit.nome,
                    email: funcionarioToEdit.email,
                    cargo: funcionarioToEdit.cargo,
                });
            } else {
                setFormData({ nome: '', email: '', cargo: '' });
            }
            setErrors({});
        }
    }, [isOpen, funcionarioToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key:string]: string } = {};
        if (!formData.nome.trim()) newErrors.nome = "O nome é obrigatório.";
        if (!formData.email.trim()) newErrors.email = "O email é obrigatório.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
        if (!formData.cargo.trim()) newErrors.cargo = "O cargo é obrigatório.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        if (funcionarioToEdit) {
            updateFuncionario({ ...funcionarioToEdit, ...formData });
        } else {
            const newFuncionario: Omit<Funcionario, 'id'> = {
                ...formData,
                empresaId: empresa.empresaId,
                empresaNome: empresa.nomeEmpresa,
                setor: empresa.setor,
                avatarUrl: `https://i.pravatar.cc/150?u=${formData.email}`,
                dataAdmissao: new Date().toISOString().split('T')[0],
                fitScore: 75, // Default value
                risco: 'Médio', // Default value
                historicoFitScore: [],
                metricas: { sono: 7, estresse: 50, humor: 4, energia: 4 }, // Default values
                planoExercicio: { nome: 'Padrão', meta: 'N/A', frequencia: 'N/A', progresso: 0 }, // Default values
                metas: [],
            };
            addFuncionario(newFuncionario);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{funcionarioToEdit ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                        <input name="nome" value={formData.nome} onChange={handleChange} />
                        {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                        <input name="cargo" value={formData.cargo} onChange={handleChange} />
                        {errors.cargo && <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>}
                    </div>
                    <div className="flex justify-end pt-4 border-t dark:border-gray-700 mt-4 space-x-3">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {funcionarioToEdit ? 'Salvar Alterações' : 'Salvar Funcionário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FuncionarioModal;
