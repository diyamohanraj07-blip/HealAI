
import React, { useState } from 'react';

const SymptomTracker: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: 1, date: 'Today', level: 4, symptom: 'Joint Pain', status: 'Stable' },
    { id: 2, date: 'Yesterday', level: 7, symptom: 'Headache', status: 'Improving' },
    { id: 3, date: 'Oct 22', level: 2, symptom: 'Cough', status: 'Recovered' }
  ]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Symptom Velocity</h2>
          <p className="text-slate-500 font-medium">Tracking your recovery progression</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200">Log Symptom</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Recovery Score" value="84%" trend="up" color="emerald" />
        <MetricCard label="Sleep Efficiency" value="7.2h" trend="stable" color="blue" />
        <MetricCard label="Activity Level" value="2.4k" trend="down" color="amber" />
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Symptom</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity (1-10)</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-slate-900">{log.date}</td>
                <td className="px-8 py-6 text-slate-600 font-medium">{log.symptom}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900" style={{ width: `${log.level * 10}%` }}></div>
                    </div>
                    <span className="font-black text-slate-900 text-xs">{log.level}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    log.status === 'Improving' ? 'bg-emerald-100 text-emerald-700' : 
                    log.status === 'Recovered' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, color }: { label: string, value: string, trend: 'up' | 'down' | 'stable', color: 'emerald' | 'blue' | 'amber' }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[color]} flex flex-col gap-2 shadow-sm`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-4xl font-black text-slate-900">{value}</span>
        <div className="text-xl">
          {trend === 'up' && '↗️'}
          {trend === 'down' && '↘️'}
          {trend === 'stable' && '➡️'}
        </div>
      </div>
    </div>
  );
};

export default SymptomTracker;
