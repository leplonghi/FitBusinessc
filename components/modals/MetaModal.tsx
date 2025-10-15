
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// FIX: Add .ts extension
import { Meta, MetaStatus } from '../../types.ts';

interface MetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metaData: Omit<Meta, 'id'>) => void;
  metaToEdit: Meta | null;
}

const MetaModal: React.FC<MetaModalProps> = ({ isOpen, onClose, onSave, metaToEdit }) => {
    const [formData, setFormData] = useState({
        descricao: '',
        dataAlvo: new Date().toISOString().split('T')[0],
        status: 'Não Iniciada' as MetaStatus,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (metaToEdit) {
                setFormData({
                    descricao: metaToEdit.descricao,
                    dataAlvo: metaToEdit.dataAlvo,
                    status: metaToEdit.status,
                });
            } else {
                setFormData({
                    descricao: '',
                    dataAlvo: new Date().toISOString().split('T')[0],
                    status: 'Não Iniciada' as MetaStatus,
                });
            }
            setError('');
        }
    }, [isOpen, metaToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.descricao.trim()) {
            setError('A descrição da meta é obrigatória.');
            return;
        }
        onSave(formData);
    };

    const metaStatuses: MetaStatus[] = ['Não Iniciada', 'Em Progresso', 'Concluída'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {metaToEdit ? 'Editar Meta' : 'Adicionar Nova Meta'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Atingir 10.000 passos diários por 2 semanas"
                        />
                        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dataAlvo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Alvo</label>
                            <input
                                type="date"
                                id="dataAlvo"
                                name="dataAlvo"
                                value={formData.dataAlvo}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                {metaStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Salvar Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MetaModal;
