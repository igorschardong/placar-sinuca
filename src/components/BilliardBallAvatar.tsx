import React from 'react';

interface BilliardBallAvatarProps {
  number: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCrown?: boolean;
}

export const BilliardBallAvatar: React.FC<BilliardBallAvatarProps> = ({
  number,
  color,
  size = 'md',
  showCrown = false,
}) => {
  // Standard Pool / Sinuca Ball Colors (1-Amarela, 2-Azul, 3-Vermelha, 4-Rosa, 5-Laranja, 6-Verde, 7-Marrom, 8-Preta, 9-15-Listradas)
  const ballColors: Record<number, { bg: string; text: string; stripe?: boolean }> = {
    0: { bg: '#f8fafc', text: '#0f172a' }, // Cue ball (white)
    1: { bg: '#eab308', text: '#0f172a' }, // Yellow
    2: { bg: '#2563eb', text: '#ffffff' }, // Blue
    3: { bg: '#dc2626', text: '#ffffff' }, // Red
    4: { bg: '#ec4899', text: '#ffffff' }, // Rosa / Pink!
    5: { bg: '#ea580c', text: '#ffffff' }, // Orange
    6: { bg: '#16a34a', text: '#ffffff' }, // Green
    7: { bg: '#a16207', text: '#ffffff' }, // Marrom / Castanha
    8: { bg: '#09090b', text: '#ffffff' }, // 8-Ball Black
    9: { bg: '#eab308', text: '#0f172a', stripe: true },
    10: { bg: '#2563eb', text: '#ffffff', stripe: true },
    11: { bg: '#dc2626', text: '#ffffff', stripe: true },
    12: { bg: '#ec4899', text: '#ffffff', stripe: true }, // Rosa stripe
    13: { bg: '#ea580c', text: '#ffffff', stripe: true },
    14: { bg: '#16a34a', text: '#ffffff', stripe: true },
    15: { bg: '#a16207', text: '#ffffff', stripe: true },
  };

  const ballInfo = ballColors[number] || { bg: color || '#2563eb', text: '#ffffff', stripe: false };
  const bgColor = ballColors[number] ? ballColors[number].bg : (color || ballInfo.bg);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  }[size];

  const innerCircleSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }[size];

  return (
    <div className="relative inline-block">
      {showCrown && (
        <div className="absolute -top-3 -right-2 z-10 animate-bounce">
          <span className="text-xl sm:text-2xl drop-shadow-md">👑</span>
        </div>
      )}
      <div
        className={`relative rounded-full flex items-center justify-center font-black shadow-lg overflow-hidden border-2 border-amber-200/40 select-none ${sizeClasses}`}
        style={{
          backgroundColor: bgColor,
          boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.6), 2px 4px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* Glossy 3D Highlight */}
        <div className="absolute top-1 left-2 w-1/3 h-1/3 bg-white/40 rounded-full blur-[1px] pointer-events-none" />

        {/* Stripe Effect for balls 9-15 */}
        {ballInfo.stripe && (
          <div className="absolute inset-y-2 inset-x-0 bg-white/90 z-0 flex items-center justify-center" />
        )}

        {/* Number Circle */}
        <div
          className={`relative z-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold shadow-sm ${innerCircleSize}`}
        >
          {number}
        </div>
      </div>
    </div>
  );
};
