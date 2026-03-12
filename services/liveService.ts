
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export interface LiveSessionCallbacks {
  onAudioData: (buffer: AudioBuffer) => void;
  onTranscription: (text: string, isInterrupted: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
  onError: (e: any) => void;
}

export const connectLiveDoctor = (
  systemInstruction: string,
  callbacks: LiveSessionCallbacks
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: callbacks.onOpen,
      onmessage: async (message: LiveServerMessage) => {
        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
          const audioBytes = decodeBase64(message.serverContent.modelTurn.parts[0].inlineData.data);
          // We assume a standard output rate of 24000 from Gemini Live
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
          callbacks.onAudioData(buffer);
        }

        if (message.serverContent?.outputTranscription) {
          callbacks.onTranscription(message.serverContent.outputTranscription.text, !!message.serverContent.interrupted);
        }

        if (message.serverContent?.interrupted) {
          callbacks.onTranscription('', true);
        }
      },
      onerror: callbacks.onError,
      onclose: callbacks.onClose,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }, // Friendly, professional voice
      },
      systemInstruction,
    },
  });

  return sessionPromise;
};
