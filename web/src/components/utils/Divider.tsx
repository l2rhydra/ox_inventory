import React from 'react';

const Divider: React.FC = () => {
  return (
    <div 
      className="divider"
      style={{
        background: 'linear-gradient(90deg, transparent, #ff0000, transparent)',
        height: '1px',
        margin: '12px 0',
        opacity: 0.6
      }}
    />
  );
};

export default Divider;