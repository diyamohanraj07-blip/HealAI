
import React, { useState, useRef } from 'react';
import { analyzeVision } from '../services/geminiService';

const VisionAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setImage(dataUrl);
      
      // Stop stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setStreamActive(false);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const res = await analyzeVision(base64, 'image/jpeg');
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-black mb-4">Vision Diagnostic</h2>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Capture a clear photo of a skin rash, eye redness, or throat. Our AI will analyze the visible indicators.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-xl overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
          {!image && !streamActive && (
            <button 
              onClick={startCamera}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 border border-slate-100">📸</div>
              <span className="font-black text-slate-900">Activate Camera</span>
            </button>
          )}

          {streamActive && (
            <div className="w-full relative">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl shadow-lg h-[400px] object-cover" />
              <button 
                onClick={captureImage}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-slate-900 shadow-xl"
              />
            </div>
          )}

          {image && !loading && !result && (
            <div className="w-full text-center space-y-6">
              <img src={image} className="w-full rounded-2xl shadow-lg h-[300px] object-cover mb-4" />
              <div className="flex gap-4">
                <button 
                  onClick={runAnalysis}
                  className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl"
                >
                  Analyze Image
                </button>
                <button 
                  onClick={() => setImage(null)}
                  className="px-6 bg-slate-100 text-slate-500 font-bold rounded-2xl"
                >
                  Retake
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-black text-slate-900 animate-pulse">Running Neural Analysis...</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 flex flex-col h-full min-h-[400px]">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Analysis Findings
          </h3>
          <div className="flex-1 text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
            {result || "Awaiting image capture and analysis... Results will appear here with clinical observations."}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Disclaimer: This analysis is for informational purposes only. Consult a professional for formal diagnosis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionAnalysis;
