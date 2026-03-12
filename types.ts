
export interface RemedyResponse {
  condition: string;
  summary: string;
  homeRemedies: string[];
  quickSolutions: string[];
  whenToSeeDoctor: string[];
  safetyPrecautions: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  HOME = 'home',
  SEARCH = 'search',
  REMEDY = 'remedy',
  CHAT = 'chat',
  MENTAL_HEALTH = 'mental_health',
  HISTORY = 'history',
  FACILITIES = 'facilities',
  TELEHEALTH = 'telehealth',
  FEEDBACK = 'feedback',
  VISION = 'vision',
  TRACKER = 'tracker',
  NOTIFICATIONS = 'notifications'
}

export interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'follow_up';
  time: string;
  date: string;
  status: 'pending' | 'completed' | 'missed';
  details: string;
}

export interface HealthCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  symptoms: string[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  condition: string;
  notes: string;
  type: 'consultation' | 'remedy_search' | 'lab_result' | 'vision_analysis';
}

export interface Consultation {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'voice' | 'video' | 'chat';
  duration?: string;
  status: 'completed' | 'missed' | 'cancelled';
}
