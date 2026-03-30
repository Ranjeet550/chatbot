import { useState, useCallback } from 'react';
import { PHASE_ORDER } from '../constants/phases';

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    text: 'こんにちは！AI Okānへようこそ。本日はどのようにお手伝いできますか？',
    phase: 'welcome',
  },
];

const PHASE_NAMES_JA = {
  welcome: 'ウェルカム',
  gathering: '情報収集',
  casual: 'カジュアル',
  explanation: '説明',
  proposal: '提案',
  closing: 'クロージング',
  celebration: 'お祝い',
};

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
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [streamingText, setStreamingText] = useState('');

  const streamMessage = useCallback((messageId, fullText, onComplete) => {
    let currentIndex = 0;
    const words = fullText.split(' ');
    
    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const textToShow = words.slice(0, currentIndex + 1).join(' ');
        setStreamingText(textToShow);
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setStreamingMessageId(null);
        setStreamingText('');
        if (onComplete) onComplete();
      }
    }, 80); // 80ms per word for natural reading pace
    
    return () => clearInterval(streamInterval);
  }, []);

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
        text: '', // Start with empty text
        phase: nextPhase,
      };

      // Add the message with empty text first
      setMessages((prev) => [...prev, assistantMsg]);
      setCurrentPhase(nextPhase);
      setIsThinking(false);
      setIsSpeaking(true);
      setStreamingMessageId(assistantMsg.id);

      // Full response text in Japanese
      const phaseNameJa = PHASE_NAMES_JA[nextPhase] || nextPhase;
      const fullText = `これは${phaseNameJa}フェーズのシミュレーション回答です。お手伝いできることはありますか？`;
      
      // Stream the message word by word
      streamMessage(assistantMsg.id, fullText, () => {
        // Update the message with the full text when streaming completes
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsg.id ? { ...msg, text: fullText } : msg
          )
        );
        setIsSpeaking(false);
      });
    }, 2500);
  };

  return { 
    messages, 
    currentPhase, 
    isThinking, 
    isSpeaking, 
    handleSendMessage,
    streamingMessageId,
    streamingText
  };
};
