import React from 'react';
import ChatWindow from '../components/ChatWindow';
import { useChat } from '../hooks/useChat';
import { phaseToExpressionMap } from '../constants/phases';

const ChatPage = () => {
  const { messages, currentPhase, isThinking, isSpeaking, handleSendMessage } = useChat();

  return (
    /* Full-viewport background */
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 px-4 py-6 font-sans">

      {/* Chatbot window — standard width ~420 px, full height on small screens */}
      <div className="flex flex-col w-full max-w-[420px] h-[90vh] max-h-[780px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">

        {/* Header */}
        <header className="shrink-0 px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
          {/* Online indicator */}
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow shadow-green-300" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 truncate">AI Okān</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">
              Decision-making Support
            </p>
          </div>
        </header>

        {/* Chat content */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            expression={phaseToExpressionMap[currentPhase]}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Footer */}
        <footer className="shrink-0 py-1.5 text-center text-[9px] text-slate-300 border-t border-slate-100 bg-white">
          Powered by AI Okān
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
