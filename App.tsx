
import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import RemedyDisplay from './components/RemedyDisplay';
import ChatInterface from './components/ChatInterface';
import MentalHealthChat from './components/MentalHealthChat';
import MedicalHistory from './components/MedicalHistory';
import NearbyFacilities from './components/NearbyFacilities';
import Telehealth from './components/Telehealth';
import FeedbackForm from './components/FeedbackForm';
import VisionAnalysis from './components/VisionAnalysis';
import SymptomTracker from './components/SymptomTracker';
import NotificationHub from './components/NotificationHub';
import { AppView, RemedyResponse, HealthCategory } from './types';
import { getRemedies } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [currentRemedy, setCurrentRemedy] = useState<RemedyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setActiveView(AppView.REMEDY);
    try {
      const result = await getRemedies(query);
      setCurrentRemedy(result);
    } catch (err) {
      console.error(err);
      setError("We couldn't fetch details for that condition. Please try again or use the chat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategorySelect = (category: HealthCategory) => {
    handleSearch(category.name);
  };

  const navigateTo = useCallback((view: AppView) => {
    setActiveView(view);
    window.scrollTo(0, 0);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Symptoms...</h3>
            <p className="text-slate-500 max-w-xs animate-pulse font-medium">HealAI is consulting medical knowledge bases.</p>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case AppView.REMEDY:
        return currentRemedy ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <button 
              onClick={() => setActiveView(AppView.HOME)}
              className="group flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors font-medium mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <RemedyDisplay remedy={currentRemedy} />
          </div>
        ) : null;
      
      case AppView.TELEHEALTH: return <Telehealth />;
      case AppView.MENTAL_HEALTH: return <MentalHealthChat />;
      case AppView.HISTORY: return <MedicalHistory />;
      case AppView.FACILITIES: return <NearbyFacilities />;
      case AppView.VISION: return <VisionAnalysis />;
      case AppView.TRACKER: return <SymptomTracker />;
      case AppView.NOTIFICATIONS: return <NotificationHub />;
      case AppView.FEEDBACK: return <FeedbackForm onClose={() => setActiveView(AppView.HOME)} />;
      case AppView.CHAT:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Healthcare Assistant</h2>
            <ChatInterface />
          </div>
        );

      case AppView.HOME:
      default:
        return <HomeView onCategorySelect={handleCategorySelect} onSearch={handleSearch} onNavigate={navigateTo} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
