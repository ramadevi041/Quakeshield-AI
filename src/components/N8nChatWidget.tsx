import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Settings,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api, DEFAULT_N8N_WEBHOOK_URL } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const N8nChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Hello! I am **QuakeGuide AI**, connected via your **n8n AI Workflow**.\n\nAsk me anything about:\n* **72-Hour Survival Kits & Supplies**\n* **Drop, Cover & Hold On Protocols**\n* **Post-Quake Gas & Electric Safety**\n* **Seismic Hazard vs. Prediction Science**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'n8n Cloud Webhook'
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_N8N_WEBHOOK_URL);
  const [showSettings, setShowSettings] = useState(false);
  const [isConfigSaved, setIsConfigSaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputValue('');
    setIsTyping(true);

    try {
      const res = await api.askN8nChatbot(textToSend.trim(), undefined, webhookUrl);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.output,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'During ground shaking, immediately **DROP, COVER, and HOLD ON** beneath a sturdy table or desk. The n8n agent is currently reconnecting.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Safety Fallback'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation reset. I am your **n8n-powered QuakeGuide AI**. How can I help you prepare or stay safe today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'n8n Cloud Webhook'
      }
    ]);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigSaved(true);
    setTimeout(() => {
      setIsConfigSaved(false);
      setShowSettings(false);
    }, 1000);
  };

  const quickPrompts = [
    'What should I pack in an earthquake kit?',
    'What to do during shaking indoors?',
    'How to check for gas leaks?',
    'Difference between prediction and early warning?'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button (When Closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open QuakeGuide AI Chatbot"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask QuakeGuide AI</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950/20 font-black tracking-wider uppercase">
            n8n
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-5rem)] rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-xs sm:text-sm">QuakeGuide AI</h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[9px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    n8n
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[190px]">
                  ramadevi04.app.n8n.cloud
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Webhook Settings"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Webhook Configuration Modal / Drawer */}
          {showSettings && (
            <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>n8n Webhook Configuration</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Live</span>
              </div>
              <form onSubmit={handleSaveSettings} className="space-y-2">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://.../webhook/.../chat"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    Payload: <code>&#123; action, chatInput, sessionId &#125;</code>
                  </span>
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] cursor-pointer"
                  >
                    {isConfigSaved ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
            {messages.map((m) => {
              const isBot = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isBot
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-cyan-500 text-slate-950'
                    }`}
                  >
                    {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed space-y-1 ${
                      isBot
                        ? 'bg-slate-900 border border-slate-800 text-slate-200'
                        : 'bg-amber-500 text-slate-950 font-medium'
                    }`}
                  >
                    <div className="whitespace-pre-line text-[11px] sm:text-xs">{m.text}</div>
                    <div className="flex items-center justify-between text-[9px] pt-0.5 opacity-70">
                      {isBot && m.source && (
                        <span className="font-mono text-amber-400/90">{m.source}</span>
                      )}
                      <span className="ml-auto font-mono">{m.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-2xl border border-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-400 ml-1">n8n workflow thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-1.5 border-t border-slate-800/80 bg-slate-950/70 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-[10px] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask n8n QuakeGuide AI..."
                disabled={isTyping}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
