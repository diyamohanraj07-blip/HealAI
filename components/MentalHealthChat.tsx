
import React from 'react';
import ChatInterface from './ChatInterface';
import { MENTAL_HEALTH_PROMPT } from '../constants';

const MentalHealthChat: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-100 overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Mindful Support</h2>
          <p className="text-purple-50 leading-relaxed text-lg opacity-90">A safe, private space to talk about your thoughts and feelings. We're here to listen.</p>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ToolCard title="Breathing Exercises" icon="🌬️" color="bg-blue-50 text-blue-600" />
        <ToolCard title="Mood Tracking" icon="📊" color="bg-emerald-50 text-emerald-600" />
        <ToolCard title="Safe Hotlines" icon="☎️" color="bg-rose-50 text-rose-600" />
      </div>

      <ChatInterface 
        customInstruction={MENTAL_HEALTH_PROMPT} 
        placeholder="How are you feeling today? You can share anything..." 
        themeColor="bg-purple-600"
      />
    </div>
  );
};

const ToolCard = ({ title, icon, color }: { title: string, icon: string, color: string }) => (
  <button className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-sm hover:shadow-md transition-shadow ${color}`}>
    <span className="text-2xl">{icon}</span>
    {title}
  </button>
);

export default MentalHealthChat;
