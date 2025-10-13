import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { generateMockEmpresas, generateMockFuncionarios } from '../lib/mockData';
import { ArrowLeft, Search, Mail, Briefcase, Calendar, BarChart2, TrendingDown, Moon, Zap, X, AlertTriangle, Smile, ChevronDown, FileText, Plus, ShieldAlert, Edit, Trash2, Building, CheckCircle, Link as LinkIcon, ArrowUp, ArrowDown as ArrowDownIcon } from 'lucide-react';
import { Empresa, Funcionario, RiscoNivel, Setor } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from '../components/ui/AccessDenied';

// MODALS AND SUB-COMPONENTS START
// ===============================

const getRiscoClass = (risco: RiscoNivel) => {
    switch (risco) {
        case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
};

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle size={48} className="text-fit-red mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Ocorreu um Erro</h3>
        <p className="mt-2 text-sm text-fit-gray">{message}</p>
    </div>
);

const CompanyModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (company: Omit<Empresa, 'empresaId' | 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco'>) => void;
    companyToEdit: Empresa | null;
}> = ({ isOpen, onClose, onSave, companyToEdit }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'Ativa' | 'Inativa'>('Ativa');
    const [irs, setIrs] = useState(75);
    const [website, setWebsite] = useState('');
    const [nameError, setNameError] = useState('');
    const [websiteError, setWebsiteError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (companyToEdit) {
                setName(companyToEdit.nomeEmpresa);
                setStatus(companyToEdit.status);
                setIrs(companyToEdit.irs);
                setWebsite(companyToEdit.website || '');
            } else {
                setName(''); setStatus('Ativa'); setIrs(75); setWebsite('');
            }
            setNameError('');
            setWebsiteError('');
        }
    }, [isOpen, companyToEdit]);

    if (!isOpen) return null;

    const isValidUrl = (urlString: string) => {
        try {
            const pattern = new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i');
            return !!pattern.test(urlString);
        } catch (e) { return false; }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let hasErrors = false;
        if (!name.trim()) { setNameError("O nome da empresa é obrigatório."); hasErrors = true; } else { setNameError(''); }
        if (website.trim() && !isValidUrl(website)) { setWebsiteError("Por favor, insira uma URL válida."); hasErrors = true; } else { setWebsiteError(''); }
        if (hasErrors) return;
        onSave({ nomeEmpresa: name, status, irs: Number(irs), website });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{companyToEdit ? 'Editar Empresa' : 'Adicionar Empresa'}</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label>Nome</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                    </div>
                     <div>
                        <label>Website</label>
                        <input type="url" value={website} onChange={e => setWebsite(e.target.value)} />
                         {websiteError && <p className="text-xs text-red-500">{websiteError}</p>}
                    </div>
                     <div>
                        <label>Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as 'Ativa' | 'Inativa')}>
                            <option>Ativa</option><option>Inativa</option>
                        </select>
                    </div>
                     <div>
                        <label>IRS</label>
                        <input type="number" value={irs} onChange={e => setIrs(Number(e.target.value))} min="0" max="100"/>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">{companyToEdit ? 'Salvar' : 'Adicionar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FuncionarioModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Funcionario, 'id' | 'avatarUrl' | 'historicoFitScore' | 'metricas' | 'risco' | 'empresaNome'>, funcId: string | null) => void;
    funcionarioToEdit: Funcionario | null;
    empresa: Empresa;
}> = ({ isOpen, onClose, onSave, funcionarioToEdit, empresa }) => {
    const [formData, setFormData] = useState({
        nome: '', email: '', cargo: '', setor: 'Tecnologia' as Setor, dataAdmissao: new Date().toISOString().split('T')[0], fitScore: 75,
    });
    useEffect(() => {
        if (isOpen) {
            setFormData(funcionarioToEdit ? {
                nome: funcionarioToEdit.nome, email: funcionarioToEdit.email, cargo: funcionarioToEdit.cargo, setor: funcionarioToEdit.setor, dataAdmissao: funcionarioToEdit.dataAdmissao, fitScore: funcionarioToEdit.fitScore
            } : {
                nome: '', email: '', cargo: '', setor: 'Tecnologia' as Setor, dataAdmissao: new Date().toISOString().split('T')[0], fitScore: 75
            });
        }
    }, [isOpen, funcionarioToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, fitScore: Number(formData.fitScore), empresaId: empresa.empresaId }, funcionarioToEdit?.id || null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-semibold mb-6">{funcionarioToEdit ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Simplified form fields */}
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                    <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Cargo" required />
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">{funcionarioToEdit ? 'Salvar' : 'Adicionar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ... Other modals like FuncionarioDetalheModal, ComparisonModal can be defined here ...


// MAIN VIEWS (LIST AND DETAIL)
// ============================

const EmpresaDetalhe: React.FC<{ 
    empresa: Empresa; 
    onBack: () => void;
    allFuncionarios: Funcionario[];
    onFuncionariosChange: (funcionarios: Funcionario[]) => void;
}> = ({ empresa, onBack, allFuncionarios, onFuncionariosChange }) => {
    const { user } = useAuth();
    const isSuperAdmin = user?.papel === 'superadmin';

    const [funcionariosDaEmpresa, setFuncionariosDaEmpresa] = useState(() => allFuncionarios.filter(f => f.empresaId === empresa.empresaId));
    const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
    const [funcionarioToEdit, setFuncionarioToEdit] = useState<Funcionario | null>(null);

    useEffect(() => {
        setFuncionariosDaEmpresa(allFuncionarios.filter(f => f.empresaId === empresa.empresaId));
    }, [allFuncionarios, empresa.empresaId]);

    const handleSaveFuncionario = (data: Omit<Funcionario, 'id' | 'avatarUrl' | 'historicoFitScore' | 'metricas' | 'risco'| 'empresaNome'>, funcId: string | null) => {
        let updatedFuncionarios;
        // Fix: Explicitly type risco to ensure it matches RiscoNivel.
        const risco: RiscoNivel = data.fitScore < 60 ? 'Alto' : data.fitScore < 80 ? 'Médio' : 'Baixo';
        const completeData = { ...data, empresaNome: empresa.nomeEmpresa, risco };
        if (funcId) {
             updatedFuncionarios = allFuncionarios.map(f => f.id === funcId ? { ...f, ...completeData } : f);
        } else {
            const newFunc: Funcionario = { ...completeData, id: `f${Date.now()}`, avatarUrl: `https://i.pravatar.cc/150?u=f${Date.now()}`, historicoFitScore: [], metricas: { sono: 7, estresse: 50, humor: 4, energia: 4 } };
            updatedFuncionarios = [newFunc, ...allFuncionarios];
        }
        onFuncionariosChange(updatedFuncionarios);
        setIsFuncionarioModalOpen(false);
    };

    const handleDeleteFuncionario = (funcId: string) => {
        if (window.confirm("Tem certeza?")) {
            onFuncionariosChange(allFuncionarios.filter(f => f.id !== funcId));
        }
    };

    return (
        <>
            <div className="space-y-6">
                <button onClick={onBack} className="flex items-center text-sm"><ArrowLeft size={16} className="mr-2"/>Voltar para Empresas</button>
                <h2 className="text-3xl font-bold">{empresa.nomeEmpresa}</h2>
                {user?.papel !== 'superadmin' && (
                     <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-md" role="alert">
                         <p className="font-bold">Modo de Consulta</p>
                         <p className="text-sm">Você está visualizando os dados da sua empresa. A edição de dados é restrita a administradores.</p>
                     </div>
                )}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Funcionários</h3>
                        {isSuperAdmin && <button onClick={() => { setFuncionarioToEdit(null); setIsFuncionarioModalOpen(true);}} className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg"><Plus size={16} className="mr-2"/>Adicionar Funcionário</button>}
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr><th>Nome</th><th>Cargo</th><th>FitScore</th><th>Ações</th></tr>
                            </thead>
                            <tbody>
                                {funcionariosDaEmpresa.map(func => (
                                    <tr key={func.id}>
                                        <td>{func.nome}</td><td>{func.cargo}</td><td>{func.fitScore}</td>
                                        <td>
                                            {isSuperAdmin && (
                                                <>
                                                <button onClick={() => { setFuncionarioToEdit(func); setIsFuncionarioModalOpen(true); }} className="mr-2"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteFuncionario(func.id)}><Trash2 size={16} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <FuncionarioModal isOpen={isFuncionarioModalOpen} onClose={() => setIsFuncionarioModalOpen(false)} onSave={handleSaveFuncionario} funcionarioToEdit={funcionarioToEdit} empresa={empresa} />
        </>
    );
};


const EmpresasMonitoradas: React.FC = () => {
    const { user } = useAuth();
    const [allEmpresas, setAllEmpresas] = useState<Empresa[]>([]);
    const [allFuncionarios, setAllFuncionarios] = useState<Funcionario[]>([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [companyToEdit, setCompanyToEdit] = useState<Empresa | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Ativa' | 'Inativa'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Empresa; direction: 'asc' | 'desc' } | null>({ key: 'nomeEmpresa', direction: 'asc' });

    const isSuperAdmin = user?.papel === 'superadmin';

    useEffect(() => {
        const mockEmpresas = generateMockEmpresas();
        const mockFuncionarios = generateMockFuncionarios();
        setAllEmpresas(mockEmpresas);
        setAllFuncionarios(mockFuncionarios);

        if (!isSuperAdmin && user?.empresaId) {
            const userEmpresa = mockEmpresas.find(e => e.empresaId === user.empresaId);
            setSelectedEmpresa(userEmpresa || null);
        }
    }, [user, isSuperAdmin]);

    const handleSaveCompany = (companyData: Omit<Empresa, 'empresaId' | 'funcionariosAtivos' | 'mediaFitScore' | 'taxaEngajamento' | 'alertasRisco'>) => {
        let updatedEmpresas;
        if (companyToEdit) {
            updatedEmpresas = allEmpresas.map(emp => emp.empresaId === companyToEdit.empresaId ? { ...emp, ...companyData } : emp);
        } else {
            const newCompany: Empresa = { ...companyData, empresaId: `e${Date.now()}`, funcionariosAtivos: 0, mediaFitScore: 70, taxaEngajamento: 80, alertasRisco: 0, irsHistory: [] };
            updatedEmpresas = [newCompany, ...allEmpresas];
        }
        setAllEmpresas(updatedEmpresas);
        setIsCompanyModalOpen(false);
        setCompanyToEdit(null);
    };

    const handleDeleteCompany = (empresaId: string) => {
        if(window.confirm("Tem certeza que deseja excluir esta empresa?")) {
            const updatedEmpresas = allEmpresas.filter(e => e.empresaId !== empresaId);
            setAllEmpresas(updatedEmpresas);
            // Also remove employees of that company
            setAllFuncionarios(allFuncionarios.filter(f => f.empresaId !== empresaId));
        }
    };

    const filteredAndSortedEmpresas = useMemo(() => {
        let filtered = allEmpresas.filter(e => (statusFilter === 'all' || e.status === statusFilter) && e.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()));
        if (sortConfig) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [allEmpresas, searchTerm, statusFilter, sortConfig]);


    if (selectedEmpresa) {
        return <EmpresaDetalhe 
            empresa={selectedEmpresa} 
            onBack={() => isSuperAdmin && setSelectedEmpresa(null)}
            allFuncionarios={allFuncionarios}
            onFuncionariosChange={setAllFuncionarios}
        />;
    }

    if (!isSuperAdmin) {
        return <AccessDenied title="Nenhuma empresa associada" message="Não encontramos uma empresa para seu perfil ou você não tem permissão para ver esta lista." />;
    }

    // Superadmin Company List View
    return (
        <>
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Gestão de Empresas</h3>
                        <button onClick={() => { setCompanyToEdit(null); setIsCompanyModalOpen(true); }} className="flex items-center bg-fit-dark-blue text-white px-4 py-2 rounded-lg">
                            <Plus size={16} className="mr-2" />
                            Adicionar Empresa
                        </button>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead><tr><th>Nome</th><th>Status</th><th>IRS</th><th>Ações</th></tr></thead>
                            <tbody>
                                {filteredAndSortedEmpresas.map(empresa => (
                                    <tr key={empresa.empresaId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedEmpresa(empresa)}>{empresa.nomeEmpresa}</td>
                                        <td>{empresa.status}</td>
                                        <td>{empresa.irs}</td>
                                        <td className="px-6 py-4 text-right">
                                             <button onClick={() => { setCompanyToEdit(empresa); setIsCompanyModalOpen(true); }} className="mr-4"><Edit size={16} /></button>
                                             <button onClick={() => handleDeleteCompany(empresa.empresaId)}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <CompanyModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} onSave={handleSaveCompany} companyToEdit={companyToEdit} />
        </>
    );
};

export default EmpresasMonitoradas;
