import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
  children?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType, children, className = '' }) => {
  const changeColor = changeType === 'positive' ? 'text-fit-green' : 'text-fit-red';

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col ${className}`}>
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