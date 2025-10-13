
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import Spinner from './Spinner';

interface InsightCardProps {
    promptKey: 'visaoGeral' | 'analiseRisco' | 'relatorio' | 'previsao';
    title: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ promptKey, title }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setLoading(true);
            const text = await geminiService.generateInsight(promptKey);
            setInsight(text);
            setLoading(false);
        };
        fetchInsight();
    }, [promptKey]);
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex items-center mb-4">
                <Sparkles className="text-fit-orange mr-3" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
            </div>
            {loading ? (
                <div className="h-24">
                    <Spinner />
                </div>
            ) : (
                <p className="text-sm text-fit-gray dark:text-gray-300 leading-relaxed">
                    {insight}
                </p>
            )}
        </div>
    );
};

export default InsightCard;
