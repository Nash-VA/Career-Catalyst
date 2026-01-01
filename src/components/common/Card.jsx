import React from 'react';

const Card = ({ children, className = '', hover = false, gradient = false }) => {
  const baseStyles = 'bg-white rounded-2xl p-6 card-shadow transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  const gradientStyles = gradient ? 'gradient-bg text-white' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
