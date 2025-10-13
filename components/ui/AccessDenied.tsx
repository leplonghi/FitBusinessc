import React from 'react';
import { Lock } from 'lucide-react';

interface AccessDeniedProps {
    title?: string;
    message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
    title = "Acesso Restrito", 
    message = "Esta área é reservada para administradores da plataforma. Você não tem as permissões necessárias para visualizar esta página." 
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center justify-center h-full">
            <Lock size={48} className="text-fit-red mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
            <p className="text-fit-gray mt-2 max-w-sm">{message}</p>
        </div>
    );
};

export default AccessDenied;
