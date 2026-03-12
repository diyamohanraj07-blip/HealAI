
import React, { useState } from 'react';

interface FeedbackFormProps {
  onClose: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose }) => {
  const [type, setType] = useState<'bug' | 'suggestion' | 'praise'>('suggestion');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend or API.
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200 border border-slate-100 animate-in zoom-in duration-500 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8">
          ✓
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Feedback Received</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          Thank you for helping us improve HealAI. Our clinical engineering team will review your report shortly.
        </p>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out]"></div>
        </div>
        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-200">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Help Us Improve</h2>
          <p className="text-slate-500 font-medium">Your feedback drives our clinical intelligence and user experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Feedback Type</label>
            <div className="grid grid-cols-3 gap-4">
              <TypeButton 
                active={type === 'suggestion'} 
                onClick={() => setType('suggestion')} 
                label="Suggestion" 
                icon="💡" 
              />
              <TypeButton 
                active={type === 'bug'} 
                onClick={() => setType('bug')} 
                label="Bug Report" 
                icon="🐛" 
              />
              <TypeButton 
                active={type === 'praise'} 
                onClick={() => setType('praise')} 
                label="Praise" 
                icon="✨" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Description</label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium placeholder-slate-400 min-h-[150px] resize-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Contact Email (Optional)</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              Submit Feedback
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-white text-slate-400 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TypeButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
      active 
        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
    }`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default FeedbackForm;