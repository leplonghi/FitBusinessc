import React from 'react';
import { UploadCloud, Zap, Puzzle, Users, Lock } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; tag?: string }> = ({ icon, title, description, tag }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
        <div className="mb-4 text-fit-dark-blue dark:text-fit-orange">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow">{description}</p>
        {tag && (
            <span className="mt-4 text-xs font-bold text-white bg-fit-orange px-3 py-1 rounded-full">{tag}</span>
        )}
    </div>
);

const Integracoes: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Central de Integrações e Onboarding</h2>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Conecte o FitBusiness com suas ferramentas, importe dados com facilidade e explore nossas funcionalidades premium para levar a gestão de bem-estar a um novo nível.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Onboarding e Gestão de Dados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard 
                        icon={<UploadCloud size={32} />}
                        title="Importação de Funcionários em Massa"
                        description="Faça o onboarding de novas empresas de forma rápida e segura. Importe planilhas (CSV, Excel) com os dados dos funcionários para começar a monitorar em minutos."
                        tag="Disponível"
                    />
                     <FeatureCard 
                        icon={<Lock size={32} />}
                        title="Auto-Cadastro para Empresas (Em Breve)"
                        description="Permita que novas empresas se cadastrem e configurem suas contas de forma autônoma, simplificando o processo de vendas e expansão."
                        tag="Em Desenvolvimento"
                    />
                </div>
            </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Integrações Premium e APIs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard 
                        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Google_Fit_logo.svg" alt="Google Fit" className="w-8 h-8" />}
                        title="Google Fit & Apple Health"
                        description="Integre com as principais plataformas de saúde para coletar dados de atividade física e sono de forma automática e segura (com consentimento do usuário)."
                        tag="Premium"
                    />
                     <FeatureCard 
                        icon={<Zap size={32} />}
                        title="API para Sistemas de RH"
                        description="Conecte o FitBusiness aos seus sistemas de RH (HCM) para sincronizar dados de funcionários, automatizar o onboarding e consolidar informações."
                        tag="Premium"
                    />
                     <FeatureCard 
                        icon={<Puzzle size={32} />}
                        title="Webhooks e Automações"
                        description="Crie automações personalizadas. Envie notificações para o Slack ou Microsoft Teams quando um alerta de risco for gerado ou um novo relatório estiver disponível."
                        tag="Premium"
                    />
                </div>
            </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Ecossistema de Parceiros</h3>
                <div className="grid grid-cols-1 gap-6">
                    <FeatureCard 
                        icon={<Users size={32} />}
                        title="Portal de Parceiros (Em Breve)"
                        description="Uma área exclusiva para parceiros (profissionais de saúde, academias, nutricionistas) acessarem dados agregados e anonimizados para propor iniciativas de saúde direcionadas e medir o impacto de suas ações."
                        tag="Planejado"
                    />
                </div>
            </div>

        </div>
    );
};

export default Integracoes;