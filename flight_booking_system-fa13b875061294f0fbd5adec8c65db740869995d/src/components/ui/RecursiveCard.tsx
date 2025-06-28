import React from 'react';

interface RecursiveCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const RecursiveCard: React.FC<RecursiveCardProps> = ({
  children,
  className = '',
  hover = true,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const classes = `
    card-recursive
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-lg' : ''}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default RecursiveCard;