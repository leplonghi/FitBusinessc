
import { RiscoNivel } from '../types.ts';

/**
 * Returns Tailwind CSS classes based on the employee's risk level.
 * @param risco The risk level ('Alto', 'Médio', 'Baixo').
 * @returns A string of CSS classes for styling.
 */
export const getRiscoClass = (risco: RiscoNivel): string => {
    switch (risco) {
      case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
};

/**
 * Formats a string into a Brazilian CNPJ format (XX.XXX.XXX/XXXX-XX).
 * @param value The raw string to be formatted.
 * @returns The formatted CNPJ string.
 */
export const formatCNPJ = (value: string): string => 
    value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);

/**
 * Formats a string into a Brazilian CEP (postal code) format (XXXXX-XXX).
 * @param value The raw string to be formatted.
 * @returns The formatted CEP string.
 */
export const formatCEP = (value: string): string => 
    value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);

/**
 * Formats a string into a Brazilian phone number format ((XX) XXXXX-XXXX).
 * @param value The raw string to be formatted.
 * @returns The formatted phone number string.
 */
export const formatPhone = (value: string): string => 
    value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
