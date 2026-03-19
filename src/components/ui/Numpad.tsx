interface NumpadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitLabel?: string;
  shake?: boolean;
}

export function Numpad({ value, onChange, onSubmit, disabled, submitLabel = 'Submit', shake }: NumpadProps) {
  const handleKey = (key: string) => {
    if (disabled) return;
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === '±') {
      onChange(value.startsWith('-') ? value.slice(1) : value ? '-' + value : '-');
    } else {
      if (value.length < 6) onChange(value + key);
    }
  };

  return (
    <div className={shake ? 'animate-bounce' : ''}>
      <div className={`bg-purple-950/60 border rounded-xl px-4 py-3 mb-3 text-right font-mono text-2xl font-bold min-h-[52px] transition-colors ${value ? 'text-white border-amber-600/60' : 'text-purple-600 border-purple-600/40'}`}>
        {value || '—'}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {['7','8','9','4','5','6','1','2','3','±','0','⌫'].map(key => (
          <button
            key={key}
            onPointerDown={e => { e.preventDefault(); handleKey(key); }}
            disabled={disabled}
            className={`rounded-xl py-3 text-xl font-bold transition-all active:scale-95 disabled:opacity-40 select-none ${
              key === '⌫' ? 'bg-red-900/60 hover:bg-red-800/60 border border-red-700/50 text-red-300'
              : key === '±' ? 'bg-indigo-800/60 hover:bg-indigo-700/60 border border-indigo-600/50 text-indigo-300'
              : 'bg-purple-800 hover:bg-purple-700 border border-purple-600/50 text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <button
        onPointerDown={e => { e.preventDefault(); if (!disabled && value) onSubmit(); }}
        disabled={disabled || !value}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xl py-3 rounded-xl transition-colors active:scale-95 select-none shadow-lg shadow-amber-900/30"
      >
        {submitLabel}
      </button>
    </div>
  );
}
