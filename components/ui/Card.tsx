import React, { ReactNode } from 'react';
import { Star } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
  children?: ReactNode;
  className?: string;
  isPremium?: boolean;
}

const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType, children, className = '', isPremium = false }) => {
  const changeColor = changeType === 'positive' ? 'text-fit-green' : 'text-fit-red';

  return (
    <div className={`relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${className}`}>
      {isPremium && (
        <div className="absolute top-4 right-4 bg-fit-orange text-white text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
            <Star size={12} className="mr-1" />
            PREMIUM
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-fit-gray">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColor}`}>
              {change}
            </p>
          )}
        </div>
        <div className="bg-fit-dark-blue bg-opacity-10 dark:bg-white dark:bg-opacity-10 p-3 rounded-full">
          {icon}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Card;