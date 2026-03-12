
import React from 'react';
import { MedicalRecord } from '../types';

const MOCK_RECORDS: MedicalRecord[] = [
  { id: '1', date: '2023-11-15', condition: 'Mild Insomnia', type: 'consultation', notes: 'Suggested 4-7-8 breathing and herbal tea.' },
  { id: '2', date: '2024-01-10', condition: 'Common Cold', type: 'remedy_search', notes: 'Searched for honey-lemon remedies.' },
  { id: '3', date: '2024-02-02', condition: 'Annual Checkup', type: 'lab_result', notes: 'All values within normal range.' },
];

const MedicalHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Medical History</h2>
        <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">
          Download PDF
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_RECORDS.map((record) => (
          <div key={record.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  record.type === 'consultation' ? 'bg-blue-50 text-blue-500' : 
                  record.type === 'lab_result' ? 'bg-purple-50 text-purple-500' : 'bg-orange-50 text-orange-500'
                }`}>
                  {record.type === 'consultation' ? '🩺' : record.type === 'lab_result' ? '🧪' : '📝'}
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">{record.condition}</h4>
                  <p className="text-xs text-slate-400 font-medium uppercase">{record.type}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-400">{record.date}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50 italic">
              "{record.notes}"
            </p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-emerald-100">
        <div>
          <h4 className="font-bold text-lg">Next Appointment</h4>
          <p className="text-emerald-50 opacity-80 text-sm">Thursday, Oct 24th at 10:30 AM</p>
        </div>
        <button className="bg-white text-emerald-600 px-5 py-2 rounded-xl font-bold text-sm">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default MedicalHistory;
