import React, { useMemo } from 'react';
import { Edit, Building, Mail, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { generateMockEmpresas } from '../lib/mockData';
import Card from '../components/ui/Card';
import AccessDenied from '../components/ui/AccessDenied';

const Perfil: React.FC = () => {
    const { user } = useAuth();
    const allEmpresas = useMemo(() => generateMockEmpresas(), []);

    if (!user) {
        return <AccessDenied message="Você precisa estar logado para ver esta página." />;
    }

    const userEmpresa = useMemo(() => {
        if (user.empresaId) {
            return allEmpresas.find(e => e.empresaId === user.empresaId);
        }
        return null;
    }, [user, allEmpresas]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img src={user.avatarUrl} alt={user.nome} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg" />
                <div className="flex-1 text-center md:text-left">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.nome}</h2>
                     <p className="text-fit-gray mt-1">{user.papel}</p>
                </div>
                 <button className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                    <Edit size={14} className="mr-2" />
                    Editar Perfil
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card 
                    title="Email" 
                    value={user.email} 
                    icon={<Mail className="text-fit-dark-blue" />} 
                    className="col-span-1"
                />
                 <Card 
                    title="Perfil de Acesso" 
                    value={user.papel} 
                    icon={<Shield className="text-fit-dark-blue" />} 
                    className="col-span-1"
                />
                {userEmpresa && (
                    <Card 
                        title="Empresa" 
                        value={userEmpresa.nomeEmpresa} 
                        icon={<Building className="text-fit-dark-blue" />}
                        className="md:col-span-2"
                    />
                )}
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Configurações da Conta</h3>
                <p className="text-fit-gray mt-2">
                    Nesta seção, você poderá gerenciar suas preferências de notificação, alterar sua senha e configurar a autenticação de dois fatores. (Funcionalidade em desenvolvimento).
                </p>
            </div>
        </div>
    );
};

export default Perfil;
