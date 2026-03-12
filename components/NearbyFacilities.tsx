
import React, { useState, useEffect } from 'react';
import { findNearbyMedical } from '../services/geminiService';

const NearbyFacilities: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; grounding: any[] } | null>(null);
  const [type, setType] = useState<'hospital' | 'pharmacy'>('hospital');

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const res = await findNearbyMedical(type, pos.coords.latitude, pos.coords.longitude);
          setResults(res);
          setLoading(false);
        }, async () => {
          // Fallback if permission denied
          const res = await findNearbyMedical(type);
          setResults(res);
          setLoading(false);
        });
      } else {
        const res = await findNearbyMedical(type);
        setResults(res);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [type]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Medical Map</h2>
        <p className="text-slate-500 text-sm">Find the nearest care centers and pharmacies using real-time location.</p>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setType('hospital')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${type === 'hospital' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
        >
          Hospitals
        </button>
        <button 
          onClick={() => setType('pharmacy')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${type === 'pharmacy' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
        >
          Pharmacies
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Scanning nearby areas...</p>
        </div>
      ) : results ? (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm prose prose-emerald max-w-none">
             <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
               {results.text}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.grounding.map((chunk: any, i: number) => chunk.maps && (
              <a 
                key={i} 
                href={chunk.maps.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-colors group"
              >
                <span className="text-2xl">📍</span>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-emerald-900 truncate">{chunk.maps.title || "View on Maps"}</h4>
                  <p className="text-xs text-emerald-600 font-medium truncate">Open in Google Maps</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NearbyFacilities;
