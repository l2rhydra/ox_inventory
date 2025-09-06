import React, { useMemo } from 'react';

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const getBarColor = (percent: number, isDurability: boolean) => {
    if (isDurability) {
      if (percent > 75) return 'linear-gradient(90deg, #00ff00, #32cd32)';
      if (percent > 50) return 'linear-gradient(90deg, #ffff00, #ffa500)';
      if (percent > 25) return 'linear-gradient(90deg, #ffa500, #ff4500)';
      return 'linear-gradient(90deg, #ff4500, #ff0000)';
    } else {
      if (percent < 50) return 'linear-gradient(90deg, #00ff00, #32cd32)';
      if (percent < 75) return 'linear-gradient(90deg, #ffff00, #ffa500)';
      if (percent < 90) return 'linear-gradient(90deg, #ffa500, #ff4500)';
      return 'linear-gradient(90deg, #ff4500, #ff0000)';
    }
  };

  const barColor = useMemo(() => getBarColor(percent, durability || false), [percent, durability]);

  return (
    <div className={durability ? 'durability-bar' : 'weight-bar'}>
      <div
        style={{
          visibility: percent > 0 ? 'visible' : 'hidden',
          height: '100%',
          width: `${Math.min(percent, 100)}%`,
          background: barColor,
          transition: 'width 0.3s ease, background 0.3s ease',
          position: 'relative',
        }}
      >
        {/* Animated shine effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          animation: percent > 0 ? 'shimmer 2s infinite' : 'none',
        }} />
      </div>
    </div>
  );
};

export default WeightBar;