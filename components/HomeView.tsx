
import React from 'react';
import { HEALTH_CATEGORIES } from '../constants';
import { HealthCategory, AppView } from '../types';
import SymptomSearch from './SymptomSearch';

interface HomeViewProps {
  onCategorySelect: (category: HealthCategory) => void;
  onSearch: (query: string) => void;
  onNavigate: (view: AppView) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onCategorySelect, onSearch, onNavigate }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-left py-4 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-6 border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Intelligence for Human Health
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Healthcare, <br/><span className="text-slate-400">Simplified.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Personalized medical guidance, evidence-based home remedies, and immediate virtual consultations—all in one secure place.
          </p>
        </div>
        <div className="flex-1 w-full max-w-lg">
          <SymptomSearch onSearch={onSearch} />
        </div>
      </section>

      {/* Primary Diagnostic Tools - Modular Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DiagnosticTile 
          title="Telehealth" 
          desc="Live voice and video calls with certified doctors." 
          icon="🩺" 
          onClick={() => onNavigate(AppView.TELEHEALTH)}
          theme="slate"
          badge="Live Now"
        />
        <DiagnosticTile 
          title="Vision Analysis" 
          desc="AI screening for skin, eye, and throat conditions." 
          icon="📸" 
          onClick={() => onNavigate(AppView.VISION)}
          theme="white"
        />
        <DiagnosticTile 
          title="Care Directory" 
          desc="Find hospitals, clinics, and pharmacies nearby." 
          icon="📍" 
          onClick={() => onNavigate(AppView.FACILITIES)}
          theme="blue"
        />
        <DiagnosticTile 
          title="Health Tracker" 
          desc="Monitor symptom progression and recovery metrics." 
          icon="📊" 
          onClick={() => onNavigate(AppView.TRACKER)}
          theme="purple"
        />
      </section>

      {/* Health Plan Summary */}
      <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-100 flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/3 text-center md:text-left">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Morning Routine</h3>
          <p className="text-slate-400 font-medium text-sm">Next: Vitamin D3 in 20 mins</p>
          <div className="mt-6 flex flex-col gap-3">
             <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">9AM</span>
               <span className="font-bold text-slate-700 text-sm">Medication intake</span>
             </div>
             <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => onNavigate(AppView.TELEHEALTH)}>
               <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs font-black">11A</span>
               <span className="font-bold text-slate-700 text-sm">Live Doctor Consult</span>
             </div>
          </div>
        </div>
        <div className="flex-1 w-full h-px md:h-24 bg-slate-100 md:w-px"></div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-900">Weekly Health Adherence</h4>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Target: 95%</span>
          </div>
          <div className="flex gap-2 h-16 items-end">
            {[40, 70, 45, 90, 85, 95, 20].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-lg relative overflow-hidden h-full">
                <div 
                  className={`absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-1000 ${h > 80 ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Mon • Tue • Wed • Thu • Fri • Sat • Sun</p>
        </div>
      </section>

      {/* Expanded Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Therapeutic Areas</h3>
            <p className="text-sm text-slate-400 font-medium">Browse by specialized medical condition</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {HEALTH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat)}
              className="group p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 text-left"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-slate-900 group-hover:text-white">
                {cat.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">{cat.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cat.symptoms.length} Symptoms</p>
            </button>
          ))}
        </div>
      </section>
      
      {/* Safety Protocol */}
      <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100">🚑</div>
          <div>
            <h4 className="font-bold text-slate-900 text-xl">Emergency Response</h4>
            <p className="text-slate-500 text-sm font-medium">If you are experiencing a life-threatening emergency, call local emergency services immediately.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all">Emergency Contacts</button>
      </div>
    </div>
  );
};

const DiagnosticTile = ({ title, desc, icon, onClick, theme, badge }: { title: string, desc: string, icon: string, onClick: () => void, theme: string, badge?: string }) => {
  const themes: any = {
    slate: "bg-slate-900 text-white border-slate-800 shadow-2xl shadow-slate-900/20",
    white: "bg-white text-slate-900 border-slate-100 shadow-sm shadow-slate-200/50",
    blue: "bg-white text-slate-900 border-blue-50 shadow-sm",
    purple: "bg-white text-slate-900 border-purple-50 shadow-sm"
  };

  return (
    <button 
      onClick={onClick}
      className={`p-8 rounded-[2.5rem] border text-left flex flex-col gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative ${themes[theme]}`}
    >
      {badge && (
        <span className="absolute top-6 right-6 px-2.5 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg animate-pulse">
          {badge}
        </span>
      )}
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-black text-lg">{title}</h4>
      <p className={`text-xs font-medium leading-relaxed ${theme === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
    </button>
  );
};

export default HomeView;
