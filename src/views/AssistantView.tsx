import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  User,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **QuakeGuide AI**, your certified earthquake preparedness and emergency response advisor.\n\nI can answer questions regarding:\n* **72-Hour Survival Kits** and critical supplies\n* **Immediate Safety Actions** (Drop, Cover, Hold On)\n* **Building Retrofitting & Hazard Audits**\n* **Aftershock Protocol & Utility Shutoffs**\n\n*Important Scientific Notice: I do not predict future earthquakes (no scientific method currently can). My mission is to help you prepare before, respond during, and recover after shaking.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputText('');
    setIsTyping(true);

    try {
      const res = await api.askAI(textToSend.trim());
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue generating a response. Remember: if ground shaking begins, immediately **DROP, COVER, and HOLD ON** beneath a sturdy table or desk.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const promptChips = [
    'What should I keep in an emergency kit?',
    'What should I do if I am inside a building?',
    'What should I do during an earthquake while driving?',
    'What should I do after an earthquake?',
    'How can I prepare my house?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Powered by Gemini AI (gemini-3.8-flash)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">QuakeGuide AI Assistant</h1>
            <p className="text-slate-400 text-sm mt-1">
              Authoritative, science-grounded safety advisor trained on international disaster management standards.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-950/30 border border-amber-500/30 px-3 py-1.5 rounded-xl shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Never predicts earthquakes</span>
          </div>
        </div>
      </div>

      {/* Chat Area Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl flex flex-col h-[560px] overflow-hidden">
        {/* Messages scroll pane */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                    isBot
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                      : 'bg-amber-500 text-slate-950 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div
                    className={`text-[10px] text-right font-mono ${
                      isBot ? 'text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs text-slate-400 font-medium">QuakeGuide AI is typing guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex gap-1.5 overflow-x-auto">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask QuakeGuide AI about earthquake safety, home preparation, drills..."
              disabled={isTyping}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
