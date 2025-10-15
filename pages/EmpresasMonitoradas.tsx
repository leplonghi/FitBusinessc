import React, { useState } from 'react';
import { Building } from 'lucide-react';
// FIX: Add .ts extension for type import
import { Empresa } from '../types.ts';
// FIX: Add .tsx extension for hook import
import { useData } from '../hooks/useData.tsx';
// FIX: Add .tsx extension for component import
import EmpresaListView from '../components/views/EmpresaListView.tsx';
// FIX: Add .tsx extension for component import
import EmpresaDetalheView from '../components/views/EmpresaDetalheView.tsx';

export const EmpresasMonitoradas: React.FC = () => {
    const { empresas } = useData();
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    return (
        <>
            {/* Company List View */}
            <div style={{ display: selectedEmpresa ? 'none' : 'block' }}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Building size={24} className="text-fit-dark-blue mr-3" />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Empresas Monitoradas</h2>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Acompanhe a saúde e o bem-estar de todas as empresas cadastradas. Clique em uma empresa para ver detalhes.
                        </p>
                    </div>
                    <EmpresaListView 
                        empresas={empresas}
                        onSelectEmpresa={setSelectedEmpresa}
                        onEditEmpresa={() => {}} 
                        onDeleteEmpresa={() => {}}
                        showActions={false}
                    />
                </div>
            </div>

            {/* Company Detail View */}
            <div style={{ display: selectedEmpresa ? 'block' : 'none' }}>
                {selectedEmpresa && (
                    <EmpresaDetalheView 
                        empresa={selectedEmpresa}
                        onBack={() => setSelectedEmpresa(null)}
                    />
                )}
            </div>
        </>
    );
};