
import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';

const MOCK_REMINDERS: Reminder[] = [
  { id: '1', title: 'Vitamin D3 (2000 IU)', type: 'medication', time: '09:00 AM', date: 'Daily', status: 'pending', details: 'Take after breakfast' },
  { id: '2', title: 'Post-Cough Check-in', type: 'follow_up', time: '02:00 PM', date: 'Today', status: 'pending', details: 'Record any lingering throat irritation' },
  { id: '3', title: 'Optometry Appointment', type: 'appointment', time: '11:15 AM', date: 'Tomorrow', status: 'pending', details: 'Dr. Miller - Eye Care Center' },
];

const NotificationHub: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification("HealAI Reminders Enabled", {
        body: "You will now receive alerts for medications and appointments.",
        icon: "💊"
      });
    }
  };

  const toggleStatus = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'completed' ? 'pending' : 'completed' } : r
    ));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Permission Banner */}
      {permission !== 'granted' && (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <h2 className="text-2xl font-black mb-2">Enable Push Alerts</h2>
            <p className="text-slate-400 font-medium">Receive real-time notifications for medication intervals and upcoming virtual appointments.</p>
          </div>
          <button 
            onClick={requestPermission}
            className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 whitespace-nowrap"
          >
            Allow Notifications
          </button>
        </div>
      )}

      {/* Main Schedule */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Schedule</h2>
          <p className="text-slate-500 font-medium">Manage your active reminders and daily protocol</p>
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl shadow-sm hover:shadow-md transition-all">
          + New Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reminders.map((reminder) => (
          <div 
            key={reminder.id}
            className={`group p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
              reminder.status === 'completed' 
                ? 'bg-slate-50 border-slate-100 opacity-60' 
                : 'bg-white border-slate-200 hover:border-slate-900 shadow-sm hover:shadow-2xl hover:shadow-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                reminder.type === 'medication' ? 'bg-blue-50 text-blue-500' :
                reminder.type === 'appointment' ? 'bg-purple-50 text-purple-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                {reminder.type === 'medication' ? '💊' : reminder.type === 'appointment' ? '🏥' : '✅'}
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">{reminder.time}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reminder.date}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-black text-slate-900 text-xl mb-1">{reminder.title}</h4>
              <p className="text-sm text-slate-500 font-medium">{reminder.details}</p>
            </div>

            <button 
              onClick={() => toggleStatus(reminder.id)}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                reminder.status === 'completed'
                ? 'bg-slate-200 text-slate-400'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'
              }`}
            >
              {reminder.status === 'completed' ? 'Activity Completed' : 'Mark as Done'}
            </button>
            
            {/* Background Icon Decoration */}
            <div className="absolute -right-4 -bottom-4 text-slate-50 text-8xl font-black select-none pointer-events-none group-hover:scale-110 transition-transform">
              {reminder.type === 'medication' ? 'M' : reminder.type === 'appointment' ? 'A' : 'F'}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics/Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem]">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Adherence Rate</p>
          <p className="text-4xl font-black text-slate-900">92%</p>
          <div className="mt-4 h-1.5 w-full bg-emerald-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Tasks</p>
          <p className="text-4xl font-black text-slate-900">3</p>
          <p className="text-xs text-slate-400 font-medium mt-2">Due by EOD Today</p>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Managed</p>
          <p className="text-4xl font-black text-slate-900">124</p>
          <p className="text-xs text-slate-400 font-medium mt-2">Reminders set this month</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationHub;
