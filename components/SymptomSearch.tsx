
import React, { useState } from 'react';

interface SymptomSearchProps {
  onSearch: (query: string) => void;
}

const SymptomSearch: React.FC<SymptomSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-slate-900/5 rounded-[2rem] blur-2xl group-focus-within:bg-emerald-500/10 transition-colors"></div>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your symptoms..."
            className="w-full px-8 py-6 pr-20 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 outline-none transition-all focus:border-slate-900 text-slate-900 placeholder-slate-400 font-medium text-lg"
          />
          <button
            type="submit"
            className="absolute right-3 top-3 bottom-3 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      <div className="mt-6 flex flex-wrap gap-2 px-2">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 mr-2">Top Inquiries:</span>
        {['Sore Throat', 'Seasonal Allergies', 'Back Pain', 'Insomnia'].map((tag) => (
          <button
            key={tag}
            onClick={() => { setQuery(tag); onSearch(tag); }}
            className="text-xs px-4 py-2 bg-white text-slate-600 rounded-full hover:bg-slate-900 hover:text-white transition-all border border-slate-200 font-bold"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SymptomSearch;