
import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './ChatInterface';
import { DOCTOR_PROMPT } from '../constants';
import { connectLiveDoctor, createPcmBlob } from '../services/liveService';
import { Consultation } from '../types';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availability: string;
  experience: string;
  prompt: string;
}

const DOCTORS: Doctor[] = [
  {
    id: 'dr-sarah',
    name: 'Dr. Sarah Johnson',
    specialty: 'General Physician',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150',
    availability: 'Online',
    experience: '14 Years',
    prompt: DOCTOR_PROMPT
  },
  {
    id: 'dr-marcus',
    name: 'Dr. Marcus Chen',
    specialty: 'Dermatologist',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150',
    availability: 'Online',
    experience: '9 Years',
    prompt: `You are Dr. Marcus Chen, a specialist Dermatologist. Focus on skin, hair, and nail conditions. ${DOCTOR_PROMPT}`
  },
  {
    id: 'dr-elena',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Pediatrician',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150',
    availability: 'Online',
    experience: '11 Years',
    prompt: `You are Dr. Elena Rodriguez, a compassionate Pediatrician. Focus on child health and wellness. ${DOCTOR_PROMPT}`
  }
];

const CALL_HISTORY: Consultation[] = [
  {
    id: 'c1',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-03-10',
    time: '14:30',
    type: 'video',
    duration: '15:20',
    status: 'completed'
  },
  {
    id: 'c2',
    doctorName: 'Dr. Marcus Chen',
    date: '2024-03-05',
    time: '10:15',
    type: 'chat',
    duration: '25:00',
    status: 'completed'
  },
  {
    id: 'c3',
    doctorName: 'Dr. Elena Rodriguez',
    date: '2024-02-28',
    time: '16:45',
    type: 'voice',
    duration: '08:45',
    status: 'completed'
  }
];

const Telehealth: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connecting' | 'active' | 'chatting'>('idle');
  const [callType, setCallType] = useState<'voice' | 'video' | 'text'>('text');
  const [transcription, setTranscription] = useState('');
  const [timer, setTimer] = useState(0);

  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    let interval: any;
    if (callStatus === 'active') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      setTimer(0);
      setTranscription('');
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stopAllMedia = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
      sessionRef.current = null;
    }
    if (audioContextInRef.current) audioContextInRef.current.close();
    if (audioContextOutRef.current) audioContextOutRef.current.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setCallStatus('idle');
    setSelectedDoctor(null);
  };

  const startChatSession = (doctor: Doctor) => {
    setCallType('text');
    setSelectedDoctor(doctor);
    setCallStatus('chatting');
  };

  const startLiveCall = async (type: 'voice' | 'video', doctor: Doctor) => {
    setCallType(type);
    setCallStatus('ringing');
    setSelectedDoctor(doctor);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setCallStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: type === 'video' ? { facingMode: 'user' } : false 
      });

      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = connectLiveDoctor(doctor.prompt, {
        onOpen: () => {
          setCallStatus('active');
          const source = audioContextInRef.current!.createMediaStreamSource(stream);
          const processor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(processor);
          processor.connect(audioContextInRef.current!.destination);

          if (type === 'video') {
            const interval = setInterval(() => {
              if (videoRef.current && canvasRef.current && sessionRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                canvasRef.current.width = 320; 
                canvasRef.current.height = 240;
                ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob((blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.6);
              } else {
                clearInterval(interval);
              }
            }, 1000);
          }
        },
        onAudioData: (buffer) => {
          if (!audioContextOutRef.current) return;
          const outCtx = audioContextOutRef.current;
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
          const source = outCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(outCtx.destination);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += buffer.duration;
          sourcesRef.current.add(source);
          source.onended = () => sourcesRef.current.delete(source);
        },
        onTranscription: (text, isInterrupted) => {
          if (isInterrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setTranscription('');
          } else {
            setTranscription(prev => (prev + ' ' + text).trim());
          }
        },
        onClose: stopAllMedia,
        onError: (e) => {
          console.error("Live Error:", e);
          stopAllMedia();
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Call initialization failed", err);
      setCallStatus('idle');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      {/* Lobby: Doctor Selection */}
      {callStatus === 'idle' && (
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Virtual Clinic Lobby</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">
              Choose your preferred communication method with our certified clinical staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DOCTORS.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <img src={doc.image} className="w-24 h-24 rounded-[2rem] object-cover ring-8 ring-slate-50 group-hover:ring-emerald-50 transition-all" alt={doc.name} />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-4">{doc.specialty}</p>
                
                <div className="grid grid-cols-1 w-full gap-3 mt-auto">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startLiveCall('voice', doc)}
                      className="flex-1 py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <span>📞</span> Voice
                    </button>
                    <button 
                      onClick={() => startLiveCall('video', doc)}
                      className="flex-1 py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <span>📹</span> Video
                    </button>
                  </div>
                  <button 
                    onClick={() => startChatSession(doc)}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>💬</span> Start Chat Session
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call History Section */}
          <div className="space-y-6 pt-10 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Consultation History</h3>
              <button className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:text-emerald-700 transition-colors">View All</button>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date & Time</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {CALL_HISTORY.map((call) => (
                      <tr key={call.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">👨‍⚕️</div>
                            <span className="font-bold text-slate-900">{call.doctorName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{new Date(call.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{call.time}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {call.type === 'video' ? '📹' : call.type === 'voice' ? '📞' : '💬'}
                            </span>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{call.type}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-mono font-medium text-slate-600">{call.duration}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            call.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                            call.status === 'missed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {call.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ringing/Connecting State */}
      {(callStatus === 'ringing' || callStatus === 'connecting') && selectedDoctor && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
            <img src={selectedDoctor.image} className="w-40 h-40 rounded-[3rem] object-cover relative z-10 border-4 border-white/10" alt={selectedDoctor.name} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{selectedDoctor.name}</h2>
          <p className="text-emerald-400 font-black uppercase tracking-[0.3em] animate-pulse">
            {callStatus === 'ringing' ? 'Calling...' : 'Establishing Secure Line...'}
          </p>
          <button 
            onClick={stopAllMedia}
            className="mt-20 w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Active Call View */}
      {callStatus === 'active' && selectedDoctor && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[80vh]">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex-1 bg-slate-950 rounded-[3rem] overflow-hidden relative shadow-2xl border-4 border-white">
              {callType === 'video' ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                  <div className="w-32 h-32 rounded-3xl bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-5xl mb-8">👤</div>
                  <div className="flex gap-2 h-12 items-center">
                     {[...Array(12)].map((_, i) => (
                       <div key={i} className={`w-1 bg-emerald-500 rounded-full animate-bounce`} style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.08}s` }}></div>
                     ))}
                  </div>
                </div>
              )}
              
              <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Secure Link</div>
                <div className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">{formatTime(timer)}</div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-white">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">{selectedDoctor.name}</p>
                <p className="text-lg font-medium italic line-clamp-2">
                  {transcription || "Establishing dialogue..."}
                </p>
              </div>

              <div className="absolute bottom-8 right-8">
                <button onClick={stopAllMedia} className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col h-full min-h-[400px]">
            <ChatInterface 
              customInstruction={selectedDoctor.prompt} 
              placeholder={`Send message to ${selectedDoctor.name}...`} 
              title="Real-time Chat"
            />
          </div>
        </div>
      )}

      {/* Dedicated Chatting View (Text Only) */}
      {callStatus === 'chatting' && selectedDoctor && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4">
              <img src={selectedDoctor.image} className="w-12 h-12 rounded-2xl object-cover" alt={selectedDoctor.name} />
              <div>
                <h3 className="font-black text-slate-900">{selectedDoctor.name}</h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Chat Session</p>
              </div>
            </div>
            <button 
              onClick={stopAllMedia}
              className="px-6 py-2 bg-slate-50 text-slate-400 font-bold rounded-xl hover:bg-slate-100 transition-all text-xs"
            >
              End Session
            </button>
          </div>
          
          <ChatInterface 
            customInstruction={selectedDoctor.prompt} 
            placeholder={`Type clinical details for ${selectedDoctor.name}...`} 
            title={`Dr. Johnson's Virtual Office`}
          />
        </div>
      )}
    </div>
  );
};

export default Telehealth;
