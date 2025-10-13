import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { generateMockFuncionarios, generateMockEmpresas } from '../lib/mockData';
import { Funcionario, RiscoNivel, Setor } from '../types';
import { useAuth } from '../hooks/useAuth';

const Funcionarios: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const allFuncionarios = useMemo(() => generateMockFuncionarios(), []);
  const allEmpresas = useMemo(() => generateMockEmpresas(), []);
  const allSetores = useMemo(() => [...new Set(allFuncionarios.map(f => f.setor))], [allFuncionarios]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedSetor, setSelectedSetor] = useState<string>('all');
  const [selectedRisco, setSelectedRisco] = useState<string>('all');

  const filteredFuncionarios = useMemo(() => {
    let funcionarios = allFuncionarios;

    // 1. Role-based pre-filtering
    if (user?.papel !== 'superadmin' && user?.empresaId) {
      funcionarios = funcionarios.filter(f => f.empresaId === user.empresaId);
    }

    // 2. UI Filters
    if (user?.papel === 'superadmin' && selectedCompany !== 'all') {
      funcionarios = funcionarios.filter(f => f.empresaId === selectedCompany);
    }

    if (selectedSetor !== 'all') {
      funcionarios = funcionarios.filter(f => f.setor === selectedSetor);
    }

    if (selectedRisco !== 'all') {
      funcionarios = funcionarios.filter(f => f.risco === selectedRisco);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      funcionarios = funcionarios.filter(f => 
        f.nome.toLowerCase().includes(lowercasedTerm) ||
        f.cargo.toLowerCase().includes(lowercasedTerm)
      );
    }

    return funcionarios;
  }, [allFuncionarios, searchTerm, selectedCompany, selectedSetor, selectedRisco, user]);

  const getRiscoClass = (risco: RiscoNivel) => {
    switch (risco) {
      case 'Alto': return 'bg-red-100 text-red-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lista de Funcionários</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Buscar por nome, cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
          />
        </div>

        {user?.papel === 'superadmin' && (
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
            >
              <option value="all">Todas as Empresas</option>
              {allEmpresas.map(emp => <option key={emp.empresaId} value={emp.empresaId}>{emp.nomeEmpresa}</option>)}
            </select>
          </div>
        )}

        <div>
          <select
            value={selectedSetor}
            onChange={(e) => setSelectedSetor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
          >
            <option value="all">Todos os Setores</option>
            {allSetores.map(setor => <option key={setor} value={setor}>{setor}</option>)}
          </select>
        </div>
        
        <div>
          <select
            value={selectedRisco}
            onChange={(e) => setSelectedRisco(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
          >
            <option value="all">Todos os Riscos</option>
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Funcionário</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Cargo</th>
              {user?.papel === 'superadmin' && <th scope="col" className="px-6 py-3 hidden lg:table-cell">Empresa</th>}
              <th scope="col" className="px-6 py-3">FitScore</th>
              <th scope="col" className="px-6 py-3">Risco</th>
            </tr>
          </thead>
          <tbody>
            {filteredFuncionarios.map((func) => (
              <tr 
                key={func.id} 
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => navigate(`/funcionarios/${func.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={func.avatarUrl} alt={func.nome} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{func.nome}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{func.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">{func.cargo}</td>
                {user?.papel === 'superadmin' && <td className="px-6 py-4 hidden lg:table-cell">{func.empresaNome}</td>}
                <td className="px-6 py-4 font-medium">{func.fitScore}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiscoClass(func.risco)}`}>
                    {func.risco}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funcionarios;
