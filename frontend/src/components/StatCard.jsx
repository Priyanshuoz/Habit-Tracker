import React from 'react';

const COLOR_MAPS = {
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    bar: 'from-indigo-500 to-purple-500',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    bar: 'from-emerald-500 to-indigo-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    bar: 'from-orange-500 to-amber-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    bar: 'from-purple-500 to-pink-500',
  },
};

const StatCard = ({
  title,
  value,
  subValue,
  subtitle,
  icon: Icon,
  colorScheme = 'indigo',
  progressBar,
  footerIcon: FooterIcon,
}) => {
  const colors = COLOR_MAPS[colorScheme] || COLOR_MAPS.indigo;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700/80 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {subValue && (
          <span className={`text-xs font-semibold ${colors.text}`}>
            {subValue}
          </span>
        )}
      </div>

      {typeof progressBar === 'number' && (
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${colors.bar} h-1.5 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, progressBar))}%` }}
          />
        </div>
      )}

      {subtitle && (
        <p className={`text-xs ${colors.text} mt-2 flex items-center gap-1 font-medium`}>
          {FooterIcon && <FooterIcon className="w-3.5 h-3.5" />}
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
};

export default StatCard;
