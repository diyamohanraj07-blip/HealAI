
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { startHealthcareChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

interface ChatInterfaceProps {
  customInstruction?: string;
  placeholder?: string;
  themeColor?: string;
  title?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  customInstruction = SYSTEM_PROMPT,
  placeholder = "Ask anything about health...",
  themeColor = "bg-slate-900",
  title = "Clinical Assistant"
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello. I'm the HealAI clinical assistant. How can I provide guidance for your wellbeing today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef<any>(null);

  useEffect(() => {
    chatSession.current = startHealthcareChat(customInstruction);
  }, [customInstruction]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.current.sendMessageStream({ message: input });
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text || '';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "System communication error. Please retry or consult a physician.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg leading-none">{title}</h3>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Secure Connection Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-6 py-4 rounded-[1.75rem] text-base leading-relaxed font-medium shadow-sm ${
              msg.role === 'user' 
                ? `${themeColor} text-white rounded-br-none` 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text || '...'}</div>
              <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-60 ${msg.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-white px-6 py-4 rounded-[1.75rem] rounded-bl-none shadow-sm border border-slate-200">
               <ThinkingDots />
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-slate-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={placeholder}
            className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`w-14 h-14 ${themeColor} text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-xl disabled:grayscale disabled:opacity-30`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-4 font-bold uppercase tracking-[0.2em]">HealAI Patient Privacy Protocol Active</p>
      </div>
    </div>
  );
};

const ThinkingDots: React.FC = () => (
  <div className="flex gap-1.5">
    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
  </div>
);

export default ChatInterface;