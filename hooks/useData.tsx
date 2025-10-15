import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Empresa, Funcionario } from '../types.ts';
import { generateMockData } from '../lib/mockData.ts';

interface DataContextType {
    empresas: Empresa[];
    funcionarios: Funcionario[];
    loading: boolean;
    getFuncionarioById: (id: string) => Funcionario | undefined;
    getFuncionariosByEmpresaId: (empresaId: string) => Funcionario[];
    addEmpresa: (empresaData: Partial<Empresa>, totalFuncionarios?: number) => Empresa;
    updateEmpresa: (empresaData: Empresa) => void;
    deleteEmpresa: (empresaId: string) => void;
    addFuncionario: (funcionarioData: Omit<Funcionario, 'id'>) => void;
    updateFuncionario: (funcionarioData: Funcionario) => void;
    bulkDeleteFuncionarios: (ids: string[], empresaId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const { empresas: initialEmpresas, funcionarios: initialFuncionarios } = generateMockData();

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [empresas, setEmpresas] = useState<Empresa[]>(initialEmpresas);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios);
    const [loading, setLoading] = useState(false);

    const getFuncionarioById = useCallback((id: string) => funcionarios.find(f => f.id === id), [funcionarios]);
    const getFuncionariosByEmpresaId = useCallback((empresaId: string) => funcionarios.filter(f => f.empresaId === empresaId), [funcionarios]);
    
    const updateEmpresaStats = useCallback((updatedFuncionarios: Funcionario[], empresaIdToUpdate: string) => {
        setEmpresas(prevEmpresas => prevEmpresas.map(emp => {
            if (emp.empresaId === empresaIdToUpdate) {
                const funcs = updatedFuncionarios.filter(f => f.empresaId === empresaIdToUpdate);
                const fitScoreMedio = funcs.length > 0 ? Math.round(funcs.reduce((acc, f) => acc + f.fitScore, 0) / funcs.length) : 0;
                return { ...emp, totalFuncionarios: funcs.length, fitScoreMedio };
            }
            return emp;
        }));
    }, []);

    const addEmpresa = useCallback((empresaData: Partial<Empresa>, totalFuncionarios = 0) => {
        const newEmpresa: Empresa = {
            empresaId: `emp-${Date.now()}`,
            nomeEmpresa: empresaData.nomeEmpresa || 'Nova Empresa',
            cnpj: empresaData.cnpj || '',
            setor: empresaData.setor || 'Tecnologia',
            status: empresaData.status || 'Ativa',
            totalFuncionarios,
            fitScoreMedio: 70,
            riscoMedio: 'Médio',
            irs: empresaData.irs || 70,
            endereco: empresaData.endereco || { rua: '', bairro: '', cidade: '', cep: '' },
            contato: empresaData.contato || { email: '', telefone: '' },
        };
        setEmpresas(prev => [...prev, newEmpresa]);
        return newEmpresa;
    }, []);
    
    const updateEmpresa = useCallback((empresaData: Empresa) => {
        setEmpresas(prev => prev.map(e => e.empresaId === empresaData.empresaId ? empresaData : e));
    }, []);

    const deleteEmpresa = useCallback((empresaId: string) => {
        setEmpresas(prev => prev.filter(e => e.empresaId !== empresaId));
        setFuncionarios(prev => prev.filter(f => f.empresaId !== empresaId));
    }, []);

    const addFuncionario = useCallback((funcionarioData: Omit<Funcionario, 'id'>) => {
        const newFuncionario: Funcionario = {
            id: `func-${Date.now()}-${Math.random()}`,
            ...funcionarioData,
        };
        setFuncionarios(prev => {
            const updated = [...prev, newFuncionario];
            updateEmpresaStats(updated, newFuncionario.empresaId);
            return updated;
        });
    }, [updateEmpresaStats]);

    const updateFuncionario = useCallback((funcionarioData: Funcionario) => {
        setFuncionarios(prev => {
             const updated = prev.map(f => f.id === funcionarioData.id ? funcionarioData : f);
             updateEmpresaStats(updated, funcionarioData.empresaId);
             return updated;
        });
    }, [updateEmpresaStats]);

    const bulkDeleteFuncionarios = useCallback((ids: string[], empresaId: string) => {
        if (!empresaId || ids.length === 0) return;
        setFuncionarios(prev => {
            const updated = prev.filter(f => !ids.includes(f.id));
            updateEmpresaStats(updated, empresaId);
            return updated;
        });
    }, [updateEmpresaStats]);

    const contextValue = useMemo(() => ({
        empresas,
        funcionarios,
        loading,
        getFuncionarioById,
        getFuncionariosByEmpresaId,
        addEmpresa,
        updateEmpresa,
        deleteEmpresa,
        addFuncionario,
        updateFuncionario,
        bulkDeleteFuncionarios,
    }), [
        empresas, 
        funcionarios, 
        loading, 
        getFuncionarioById, 
        getFuncionariosByEmpresaId,
        addEmpresa,
        updateEmpresa,
        deleteEmpresa,
        addFuncionario,
        updateFuncionario,
        bulkDeleteFuncionarios,
    ]);
    
    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};