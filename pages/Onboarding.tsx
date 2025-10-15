import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Users, Activity, CheckCircle, ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import AccessDenied from '../components/ui/AccessDenied';
import { Empresa, Funcionario, RiscoNivel, Setor } from '../types';
import BulkImportModal from '../components/ui/BulkImportModal';

// MASKING UTILITIES
const formatCNPJ = (value: string) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 18);
const formatCEP = (value: string) => value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
const formatPhone = (value: string) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = [
        { num: 1, title: 'Dados da Empresa', icon: <Building size={20} /> },
        { num: 2, title: 'Cadastro de Funcionários', icon: <Users size={20} /> },
        { num: 3, title: 'Configuração do Programa', icon: <Activity size={20} /> },
    ];

    return (
        <nav className="flex items-center justify-center" aria-label="Progress">
            <ol className="flex items-center space-x-4">
                {steps.map((step, index) => (
                    <li key={step.title}>
                        <div className={`flex items-center ${index < steps.length - 1 ? 'w-40 sm:w-64' : ''}`}>
                            <div className="flex items-center text-sm font-medium">
                                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${ currentStep > step.num ? 'bg-fit-green' : currentStep === step.num ? 'bg-fit-dark-blue' : 'bg-gray-300 dark:bg-gray-600' }`}>
                                    {currentStep > step.num ? <CheckCircle className="h-6 w-6 text-white" /> : <span className="text-white">{step.icon}</span>}
                                </span>
                                <span className="ml-3 hidden sm:block text-gray-700 dark:text-gray-300">{step.title}</span>
                            </div>
                            {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 ml-4"></div>}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

// Step 1: Company Details Form
const Step1Empresa: React.FC<{ onNext: (data: Partial<Empresa>) => void }> = ({ onNext }) => {
    const [formData, setFormData] = useState<Partial<Empresa>>({
        nomeEmpresa: '', status: 'Ativa', irs: 75, cnpj: '', setor: 'Tecnologia',
        endereco: { rua: '', bairro: '', cidade: '', cep: '' },
        contato: { email: '', telefone: '' },
        cultura: '', dataCriacao: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length > 1) {
            const [parentKey, childKey] = keys;
            let processedValue = value;
            if (name === 'endereco.cep') {
                processedValue = formatCEP(value);
            } else if (name === 'contato.telefone') {
                processedValue = formatPhone(value);
            }

            setFormData(prev => ({
                ...prev,
                [parentKey]: {
                    ...(prev[parentKey as keyof Partial<Empresa>] as object),
                    [childKey]: processedValue
                }
            }));
        } else {
            let processedValue = value;
            if (name === 'cnpj') {
                processedValue = formatCNPJ(value);
            }
            setFormData(prev => ({ ...prev, [name]: processedValue }));
        }
    };
    
    return (
        <div className="space-y-4">
            <input name="nomeEmpresa" onChange={handleChange} placeholder="Nome da Empresa" required />
            <input name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" required />
            <h4 className="font-semibold pt-2 border-t dark:border-gray-600">Endereço</h4>
            <input name="endereco.rua" onChange={handleChange} placeholder="Rua e Número" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="endereco.bairro" onChange={handleChange} placeholder="Bairro" />
                <input name="endereco.cidade" onChange={handleChange} placeholder="Cidade e Estado" />
                <input name="endereco.cep" value={formData.endereco?.cep} onChange={handleChange} placeholder="CEP" />
            </div>
            <div className="flex justify-end pt-6">
                <button onClick={() => onNext(formData)} className="bg-fit-dark-blue text-white px-6 py-2 rounded-lg flex items-center hover:bg-opacity-90 transition-colors">
                    Avançar <ArrowRight size={16} className="ml-2"/>
                </button>
            </div>
        </div>
    );
};

// Step 2: Employee Registration
const Step2Funcionarios: React.FC<{ onNext: (data: Partial<Funcionario>[]) => void; onBack: () => void; }> = ({ onNext, onBack }) => {
    const [employees, setEmployees] = useState<Partial<Funcionario>[]>([{ nome: '', email: '', cargo: '' }]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const addRow = () => setEmployees([...employees, { nome: '', email: '', cargo: '' }]);
    const removeRow = (index: number) => setEmployees(employees.filter((_, i) => i !== index));

    const handleInputChange = (index: number, field: keyof Funcionario, value: string) => {
        const updated = [...employees];
        updated[index] = { ...updated[index], [field]: value };
        setEmployees(updated);
    };
    
    const handleImportComplete = (importedFuncionarios: Partial<Funcionario>[]) => {
        // Replace manually added rows with imported data for simplicity
        setEmployees(importedFuncionarios);
        setIsImportModalOpen(false);
    };

    return (
        <>
        <div className="space-y-6">
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p>Importe um arquivo CSV ou adicione os funcionários manualmente abaixo.</p>
                <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="mt-2 bg-white dark:bg-gray-800 text-fit-dark-blue px-4 py-2 rounded-lg border dark:border-gray-600 flex items-center mx-auto hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <Upload size={16} className="mr-2"/> Importar via CSV
                </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {employees.map((emp, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                        <input value={emp.nome} onChange={e => handleInputChange(index, 'nome', e.target.value)} placeholder="Nome do Funcionário" />
                        <input value={emp.email} onChange={e => handleInputChange(index, 'email', e.target.value)} placeholder="Email" />
                        <input value={emp.cargo} onChange={e => handleInputChange(index, 'cargo', e.target.value)} placeholder="Cargo" />
                        <button onClick={() => removeRow(index)} className="text-red-500 justify-self-end hover:text-red-700 transition-colors"><X size={18}/></button>
                    </div>
                ))}
            </div>
            <button onClick={addRow} className="text-sm text-fit-dark-blue font-semibold hover:underline">+ Adicionar Linha</button>
            <div className="flex justify-between pt-6">
                <button onClick={onBack} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg flex items-center hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
                    <ArrowLeft size={16} className="mr-2"/> Voltar
                </button>
                <button onClick={() => onNext(employees)} className="bg-fit-dark-blue text-white px-6 py-2 rounded-lg flex items-center hover:bg-opacity-90 transition-colors">
                    Avançar <ArrowRight size={16} className="ml-2"/>
                </button>
            </div>
        </div>
        <BulkImportModal 
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onComplete={handleImportComplete}
        />
        </>
    );
};

// Step 3: Program Configuration
const Step3Configuracao: React.FC<{ onComplete: (data: any) => void; onBack: () => void; }> = ({ onComplete, onBack }) => {
    const checkboxClass = "h-4 w-4 rounded border-gray-300 text-fit-dark-blue focus:ring-fit-dark-blue dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-fit-orange";
    return (
        <div className="space-y-6 text-center">
            <p className="text-fit-gray">Selecione os programas e configure os parâmetros iniciais de monitoramento.</p>
            <div className="space-y-3 text-left max-w-sm mx-auto">
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" className={checkboxClass} defaultChecked /> 
                    <span>Ginástica Laboral</span>
                </label>
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" className={checkboxClass} defaultChecked /> 
                    <span>Desafio de Passos</span>
                </label>
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" className={checkboxClass} /> 
                    <span>Trilhas de Treinamento Físico</span>
                </label>
            </div>
             <div className="flex justify-between pt-6">
                <button onClick={onBack} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg flex items-center hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
                    <ArrowLeft size={16} className="mr-2"/> Voltar
                </button>
                <button onClick={() => onComplete({})} className="bg-fit-dark-blue text-white px-6 py-2 rounded-lg flex items-center hover:bg-opacity-90 transition-colors">
                    Concluir Onboarding <CheckCircle size={16} className="ml-2"/>
                </button>
            </div>
        </div>
    );
};

const Onboarding: React.FC<{
    setEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
    setFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>;
}> = ({ setEmpresas, setFuncionarios }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [companyData, setCompanyData] = useState<Partial<Empresa>>({});
    const [employeesData, setEmployeesData] = useState<Partial<Funcionario>[]>([]);

    if (user?.papel !== 'superadmin') {
        return <AccessDenied message="Apenas administradores podem realizar o onboarding de novas empresas." />;
    }

    const handleNextStep1 = (data: Partial<Empresa>) => {
        setCompanyData(data);
        setCurrentStep(2);
    };
    
    const handleNextStep2 = (data: Partial<Funcionario>[]) => {
        setEmployeesData(data.filter(emp => emp.nome && emp.email)); // Filter out empty rows
        setCurrentStep(3);
    };

    const handleComplete = (programData: any) => {
        const newCompanyId = `e${Date.now()}`;
        const newCompany: Empresa = {
            ...companyData,
            empresaId: newCompanyId,
            nomeEmpresa: companyData.nomeEmpresa || 'Nova Empresa',
            status: 'Ativa',
            irs: 75,
            funcionariosAtivos: employeesData.length,
            mediaFitScore: 80,
            taxaEngajamento: 90,
            alertasRisco: 0,
        } as Empresa;

        const newFuncionarios: Funcionario[] = employeesData.map((emp, index) => ({
            ...emp,
            id: `f${Date.now()}${index}`,
            empresaId: newCompanyId,
            empresaNome: newCompany.nomeEmpresa,
            fitScore: 78,
            risco: 'Baixo' as RiscoNivel,
            avatarUrl: `https://i.pravatar.cc/150?u=f${Date.now()}${index}`,
            dataAdmissao: new Date().toISOString().split('T')[0],
            historicoFitScore: [],
            metricas: { sono: 8, estresse: 30, humor: 5, energia: 4 },
            planoExercicio: { nome: 'Caminhada Diária', meta: '10.000 passos/dia', frequencia: 'Diária', progresso: 0 },
            setor: newCompany.setor,
            metas: [], // Initialize with empty goals
        } as Funcionario));
        
        setEmpresas(prev => [newCompany, ...prev]);
        setFuncionarios(prev => [...newFuncionarios, ...prev]);

        alert("Onboarding Concluído! Nova empresa adicionada.");
        navigate('/gestao/empresas');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Empresa onNext={handleNextStep1} />;
            case 2: return <Step2Funcionarios onNext={handleNextStep2} onBack={() => setCurrentStep(1)} />;
            case 3: return <Step3Configuracao onComplete={handleComplete} onBack={() => setCurrentStep(2)} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-center text-3xl font-bold">Onboarding de Nova Empresa</h1>
            <Stepper currentStep={currentStep} />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border">
                {renderStep()}
            </div>
        </div>
    );
};

export default Onboarding;