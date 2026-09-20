import React from 'react';
import { useStore } from '../context/StoreContext';

export const Toast = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-extrabold px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-fade-in">
      <span>{toastMessage}</span>
    </div>
  );
};
