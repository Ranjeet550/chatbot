import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterDisplay from './CharacterDisplay';

const SUGGESTIONS = [
  'Tell me about your product',
  'Is it good for me?',
  'I want to buy!',
];

const ChatWindow = ({ messages, onSendMessage, isThinking, expression, isSpeaking }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">

      {/* ── Single unified scroll area ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-white">

        {/* Character — sticky at top, same bg as chat (no visible panel) */}
        <div className="sticky top-0 z-10 pointer-events-none flex justify-center bg-white">
          <div
            className="h-40 sm:h-48 md:h-52 w-full max-w-xs sm:max-w-sm"
            style={{
              /* Aggressive radial fade — edges dissolve completely into white */
              maskImage:
                'radial-gradient(ellipse 88% 82% at 50% 22%, black 30%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 88% 82% at 50% 22%, black 30%, transparent 75%)',
            }}
          >
            <CharacterDisplay
              expression={expression}
              isThinking={isThinking}
              isSpeaking={isSpeaking}
              compact={true}
            />
          </div>
        </div>

        {/* Messages — start immediately below the character */}
        <div className="px-3 sm:px-5 pb-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                    <Bot size={14} className="text-blue-500" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] sm:max-w-[70%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.role === 'user' && (
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                <Bot size={14} className="text-blue-400 animate-pulse" />
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Suggestion Chips ─────────────────────────────────────────────── */}
      <div className="shrink-0 px-3 sm:px-5 pt-2 pb-1 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-100 bg-white">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => !isThinking && onSendMessage(s)}
            disabled={isThinking}
            className="shrink-0 text-[10px] sm:text-xs bg-slate-50 border border-slate-200 hover:border-violet-400 hover:text-violet-600 text-slate-500 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Input Bar ────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 px-3 sm:px-5 py-3 sm:py-4 border-t border-slate-100 bg-white flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message…"
          disabled={isThinking}
          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/20 focus:border-violet-400 transition-all placeholder:text-slate-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isThinking || !inputText.trim()}
          className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow ${
            inputText.trim() && !isThinking
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white hover:opacity-90'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
