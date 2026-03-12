
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { RemedyResponse, ChatMessage } from "../types";
import { SYSTEM_PROMPT, MENTAL_HEALTH_PROMPT, DOCTOR_PROMPT, VISION_SYSTEM_PROMPT } from "../constants";

export const getRemedies = async (query: string): Promise<RemedyResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest home remedies and quick solutions for: ${query}. Please provide the response in a structured JSON format.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          summary: { type: Type.STRING },
          homeRemedies: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          quickSolutions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          whenToSeeDoctor: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          safetyPrecautions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["condition", "summary", "homeRemedies", "quickSolutions", "whenToSeeDoctor", "safetyPrecautions"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as RemedyResponse;
};

export const analyzeVision = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      },
      { text: "Analyze this clinical image and provide preliminary observations and advice." }
    ],
    config: {
      systemInstruction: VISION_SYSTEM_PROMPT,
    }
  });

  return response.text || "No analysis available.";
};

export const findNearbyMedical = async (type: 'hospital' | 'pharmacy', lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `List the 5 closest ${type === 'hospital' ? 'hospitals and medical centers' : 'pharmacies and medical shops'} to me.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
        }
      }
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const startHealthcareChat = (instruction: string = SYSTEM_PROMPT) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: instruction,
    }
  });
};
