# HealAI - Smart Home Remedies & Care

HealAI is an AI-powered healthcare assistant providing instant home remedies, quick solutions for common ailments, and conversational medical guidance. Built with React, TypeScript, and Google's Gemini AI.

## 🚀 Features

- **Symptom Search**: Get instant AI-powered home remedies and medical advice.
- **Telehealth**: Connect with virtual doctors via voice, video, or chat using Gemini Live API.
- **Mental Health Support**: Dedicated conversational agent for mental wellness.
- **Vision Analysis**: Analyze medical images using Gemini's multimodal capabilities.
- **Symptom Tracker**: Keep a log of your health journey.
- **Nearby Facilities**: Locate healthcare providers in your area.
- **Medical History**: Securely store and review your past consultations and records.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Build Tool**: Vite
- **Icons**: Lucide React / Emojis

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/healai.git
   cd healai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
├── components/          # Reusable UI components
├── services/            # API integration services (Gemini, Live API)
├── App.tsx              # Main application entry point
├── types.ts             # TypeScript interfaces and enums
├── constants.tsx        # Application constants and prompts
├── index.tsx            # React DOM rendering
└── vite.config.ts       # Vite configuration
```

## 🛡️ License

This project is licensed under the MIT License.

---
*Disclaimer: HealAI is an AI assistant and should not replace professional medical advice. Always consult with a qualified healthcare provider for serious conditions.*
