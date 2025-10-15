import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import Spinner from './Spinner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    console.log("Feedback Submitted:", feedback);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFeedback('');

      setTimeout(() => {
        onClose();
        setIsSubmitted(false); // Reset for next time
      }, 2000);
    }, 1000);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    // Reset state if modal is closed before success message disappears
    setTimeout(() => {
       setFeedback('');
       setIsSubmitted(false);
    }, 300);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative transform transition-all" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50"
            aria-label="Fechar modal"
            disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Obrigado!</h3>
            <p className="mt-2 text-fit-gray">Seu feedback foi enviado com sucesso.</p>
          </div>
        ) : (
          <>
            <h3 id="feedback-modal-title" className="text-xl font-semibold text-gray-800 dark:text-white">Deixe seu Feedback</h3>
            <p className="mt-1 text-sm text-fit-gray">
              Ajude-nos a melhorar! Suas sugestões, ideias ou relatos de problemas são muito importantes.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={5}
                required
              />
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                    type="button" 
                    onClick={handleClose} 
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={isSubmitting || !feedback.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-fit-dark-blue border border-transparent rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none flex items-center justify-center w-32 disabled:bg-gray-400"
                >
                  {isSubmitting ? <Spinner /> : (
                      <>
                        <Send size={16} className="mr-2" />
                        Enviar
                      </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;