
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveView(AppView.HOME)}
          >
            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">HealAI</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Clinical Intelligence</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <NavTab active={activeView === AppView.HOME} onClick={() => setActiveView(AppView.HOME)} label="Dashboard" />
            <NavTab active={activeView === AppView.TELEHEALTH} onClick={() => setActiveView(AppView.TELEHEALTH)} label="Virtual Care" />
            <NavTab active={activeView === AppView.CHAT} onClick={() => setActiveView(AppView.CHAT)} label="AI Assistant" />
            <NavTab active={activeView === AppView.FACILITIES} onClick={() => setActiveView(AppView.FACILITIES)} label="Nearby Care" />
            <NavTab active={activeView === AppView.HISTORY} onClick={() => setActiveView(AppView.HISTORY)} label="My Health" />
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView(AppView.NOTIFICATIONS)}
              className="relative w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100"
            >
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-black">2</span>
            </button>
            <button 
              onClick={() => setActiveView(AppView.MENTAL_HEALTH)}
              className="hidden md:flex px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              Wellness
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <footer className="md:hidden sticky bottom-6 mx-4 mb-2 bg-slate-900/95 backdrop-blur-xl rounded-3xl py-4 px-2 flex justify-around items-center z-50 shadow-2xl border border-white/10">
        <NavButton icon="🏠" label="Home" active={activeView === AppView.HOME} onClick={() => setActiveView(AppView.HOME)} />
        <NavButton icon="🩺" label="Doctor" active={activeView === AppView.TELEHEALTH} onClick={() => setActiveView(AppView.TELEHEALTH)} />
        <NavButton icon="💬" label="AI Chat" active={activeView === AppView.CHAT} onClick={() => setActiveView(AppView.CHAT)} />
        <NavButton icon="🔔" label="Alerts" active={activeView === AppView.NOTIFICATIONS} onClick={() => setActiveView(AppView.NOTIFICATIONS)} />
        <NavButton icon="📍" label="Map" active={activeView === AppView.FACILITIES} onClick={() => setActiveView(AppView.FACILITIES)} />
      </footer>
    </div>
  );
};

const NavTab = ({ active, onClick, label, isNew }: { active: boolean, onClick: () => void, label: string, isNew?: boolean }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all relative py-1 flex items-center gap-2 ${active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
    {isNew && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
    {active && <span className="absolute -bottom-1 left-0 right-0 h-1 bg-slate-900 rounded-full"></span>}
  </button>
);

interface NavButtonProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-white scale-110' : 'text-white/40'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default Layout;
