import { useState } from 'react';
import { PHASE_ORDER } from '../constants/phases';

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    text: 'Hello! Welcome to AI Okān. How can I help you today?',
    phase: 'welcome',
  },
];

const getNextPhase = (current) => {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx === PHASE_ORDER.length - 1) return current;
  return PHASE_ORDER[idx + 1];
};

export const useChat = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [currentPhase, setCurrentPhase] = useState('welcome');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSendMessage = (text) => {
    // 1. Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    // 2. Immediate reaction (Specification 3.2) — show thinking state
    setIsThinking(true);

    // 3. Simulate Dify response (Specification 3.1) — ideal 2-3 s
    setTimeout(() => {
      const nextPhase = getNextPhase(currentPhase);

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `This is a simulated response for the ${nextPhase} phase. I'm here to help!`,
        phase: nextPhase,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setCurrentPhase(nextPhase);
      setIsThinking(false);
      setIsSpeaking(true);

      // Stop speaking after a few seconds (lip-sync simulation)
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 2500);
  };

  return { messages, currentPhase, isThinking, isSpeaking, handleSendMessage };
};
