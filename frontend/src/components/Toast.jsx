import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (type === 'loading') return; // Don't auto-close loading toasts
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bgStyles = {
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    info: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
    ai: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300',
    loading: 'bg-blue-500/10 border-blue-500/50 text-blue-400'
  };

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    ai: '🤖',
    loading: (
      <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl animate-slide-up shadow-2xl ${bgStyles[type]}`}>
      <span className="text-xl flex items-center justify-center">{icon[type]}</span>
      <p className="font-bold tracking-wide">{message}</p>
      {type !== 'loading' && (
        <button 
          onClick={onClose} 
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
