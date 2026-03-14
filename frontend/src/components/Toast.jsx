import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyles = {
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    info: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
    ai: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
  };

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    ai: '🤖'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl animate-slide-up shadow-2xl ${bgStyles[type]}`}>
      <span className="text-xl">{icon[type]}</span>
      <p className="font-bold tracking-wide">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
