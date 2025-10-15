import React, { useState, useCallback } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Empresa, Funcionario } from '../../types';
import Spinner from './Spinner';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (newFuncionarios: Partial<Funcionario>[]) => void;
}

type ImportStep = 'upload' | 'preview' | 'complete';

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validRows, setValidRows] = useState<Partial<Funcionario>[]>([]);
  const [errorRows, setErrorRows] = useState<{ line: number, message: string, data: string }[]>([]);
  const [fileName, setFileName] = useState('');

  const resetState = useCallback(() => {
    setStep('upload');
    setFile(null);
    setFileName('');
    setIsLoading(false);
    setValidRows([]);
    setErrorRows([]);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    // Delay reset to allow for closing animation
    setTimeout(resetState, 300);
  }, [onClose, resetState]);
  
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,nome,email,cargo\nJoão da Silva,joao.silva@exemplo.com,Engenheiro de Software\nMaria Oliveira,maria.o@exemplo.com,Designer de Produto";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modelo_importacao_funcionarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseAndValidateCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].trim().toLowerCase().split(',').map(h => h.trim());
    
    const requiredHeaders = ['nome', 'email', 'cargo'];
    if (!requiredHeaders.every(h => headers.includes(h))) {
        alert(`O arquivo CSV é inválido. Certifique-se de que ele contém as colunas: ${requiredHeaders.join(', ')}.`);
        return;
    }
    
    const valid: Partial<Funcionario>[] = [];
    const errors: { line: number, message: string, data: string }[] = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const rowData = headers.reduce((obj, header, index) => {
            obj[header as keyof Funcionario] = values[index]?.trim() || '';
            return obj;
        }, {} as any);

        if (!rowData.nome) {
            errors.push({ line: i + 1, message: 'O campo "nome" é obrigatório.', data: line });
        } else if (!rowData.email || !/\S+@\S+\.\S+/.test(rowData.email)) {
            errors.push({ line: i + 1, message: 'Email inválido ou ausente.', data: line });
        } else if (!rowData.cargo) {
            errors.push({ line: i + 1, message: 'O campo "cargo" é obrigatório.', data: line });
        } else {
            valid.push({
                nome: rowData.nome,
                email: rowData.email,
                cargo: rowData.cargo,
            });
        }
    }
    setValidRows(valid);
    setErrorRows(errors);
    setStep('preview');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        alert("Por favor, selecione um arquivo no formato CSV.");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseAndValidateCSV(text);
        setIsLoading(false);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = () => {
    onComplete(validRows);
    setStep('complete');
    setTimeout(handleClose, 2000);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Importar Funcionários em Massa</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {step === 'upload' && (
            <div className="text-center space-y-4">
              <h4 className="font-semibold text-lg">Passo 1: Prepare seus dados</h4>
              <p className="text-fit-gray">Para garantir uma importação sem erros, use nosso modelo CSV. Ele contém as colunas necessárias no formato correto.</p>
              <button onClick={handleDownloadTemplate} className="text-sm font-medium text-fit-dark-blue hover:underline">
                Baixar modelo de importação (.csv)
              </button>
              <div className="mt-4 border-t pt-4 dark:border-gray-600">
                <h4 className="font-semibold text-lg">Passo 2: Envie o arquivo</h4>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <FileText size={48} className="mx-auto text-gray-400"/>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-fit-dark-blue hover:text-opacity-80 focus-within:outline-none">
                                <span>Selecione um arquivo</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">ou arraste e solte aqui</p>
                        </div>
                        <p className="text-xs text-gray-500">Apenas arquivos CSV</p>
                    </div>
                </div>
                 {isLoading && <div className="mt-4"><Spinner /></div>}
                 {fileName && <p className="mt-2 text-sm text-fit-gray">Arquivo selecionado: {fileName}</p>}
              </div>
            </div>
          )}
          
          {step === 'preview' && (
             <div className="space-y-4">
                <h4 className="font-semibold text-lg">Resultados da Validação</h4>
                <div className="flex items-center p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    <CheckCircle size={20} className="mr-3"/>
                    <span>{validRows.length} funcionários prontos para importação.</span>
                </div>
                {errorRows.length > 0 && (
                    <div className="flex items-start p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                         <AlertCircle size={20} className="mr-3 mt-1 flex-shrink-0"/>
                         <div>
                            <strong>{errorRows.length} linhas com erros foram ignoradas.</strong>
                            <ul className="mt-2 text-xs list-disc pl-5 font-mono max-h-32 overflow-y-auto">
                                {errorRows.map(err => (
                                    <li key={err.line}>Linha {err.line}: {err.message} ({err.data.substring(0, 30)}...)</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-between">
                    <button onClick={resetState} className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Enviar Outro Arquivo</button>
                    <button onClick={handleImport} disabled={validRows.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-fit-dark-blue rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                        Confirmar e Importar {validRows.length} Funcionários
                    </button>
                </div>
             </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-fit-green mb-4"/>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Importação Concluída!</h3>
                <p className="mt-2 text-fit-gray">{validRows.length} novos funcionários foram adicionados com sucesso.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
