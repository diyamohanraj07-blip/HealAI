
import { HealthCategory } from './types';

export const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: '🫁',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    symptoms: ['Cough', 'Cold', 'Sore Throat', 'Asthma']
  },
  {
    id: 'ortho',
    name: 'Orthopedics',
    icon: '🦴',
    color: 'bg-slate-50 text-slate-700 border-slate-100',
    symptoms: ['Joint Pain', 'Fractures', 'Back Stiffness']
  },
  {
    id: 'neuro',
    name: 'Neurology',
    icon: '🧠',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    symptoms: ['Migraine', 'Dizziness', 'Numbness']
  },
  {
    id: 'women',
    name: "Women's Health",
    icon: '🚺',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    symptoms: ['Cycle Tracking', 'Pregnancy', 'Wellness']
  },
  {
    id: 'vision_care',
    name: 'Ophthalmology',
    icon: '👁️',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    symptoms: ['Eye Strain', 'Redness', 'Blurry Vision']
  },
  {
    id: 'dental',
    name: 'Dental',
    icon: '🦷',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
    symptoms: ['Gum Sensitivity', 'Toothache', 'Cavities']
  },
  {
    id: 'digestive',
    name: 'Digestive',
    icon: '🍱',
    color: 'bg-green-50 text-green-700 border-green-100',
    symptoms: ['Acid Reflux', 'Bloating', 'Indigestion']
  },
  {
    id: 'wellness',
    name: 'Mental Health',
    icon: '🧘',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    symptoms: ['Anxiety', 'Burnout', 'Sleep Hygiene']
  }
];

export const SYSTEM_PROMPT = `You are HealAI, a world-class AI Clinical Consultant. 
Provide empathetic, evidence-based medical information. 
IMPORTANT:
- Always state you are an AI, not a doctor.
- Use structured layouts for remedies.
- Highlight emergency "Red Flags" in bold.`;

export const VISION_SYSTEM_PROMPT = `You are a clinical image analyst for HealAI. 
Analyze medical images (skin, eyes, throat) provided by users. 
Your goal is to provide preliminary observations and suggest potential home care or specialist referrals. 
DISCLAIMER: This is not a formal diagnosis. Do not use definitive language.`;

export const MENTAL_HEALTH_PROMPT = `You are a compassionate Mental Wellness Guide. Use a soothing tone and provide grounding techniques.`;

export const DOCTOR_PROMPT = `You are Dr. Sarah Johnson, a virtual Attending Physician for HealAI.
In this LIVE VOICE/VIDEO session:
1. Greet the patient warmly and professionally.
2. Ask one clarifying question at a time about their symptoms.
3. If video is active, ask them to show you specific areas if relevant (e.g., "Could you hold the camera closer to your throat?").
4. Listen carefully to their vocal tone and pace for signs of distress.
5. Provide immediate triage guidance and always conclude with appropriate medical safety warnings.
6. Keep your responses concise and conversational, as this is a real-time interaction.
7. Remind them you are an AI assistant and to seek physical emergency care for life-threatening symptoms.`;
