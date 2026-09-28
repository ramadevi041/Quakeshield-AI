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
  Zap,
  Settings,
  ExternalLink
} from 'lucide-react';
import { api, DEFAULT_N8N_WEBHOOK_URL } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const AssistantView: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'n8n' | 'gemini'>('n8n');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **QuakeGuide AI**, powered by your **n8n AI Cloud Agent**.\n\nI am trained to assist you with:\n* **72-Hour Emergency Survival Kits** and storage guidelines\n* **Immediate Shaking Protocols** (Drop, Cover, Hold On)\n* **Secondary Hazard Mitigation** (Gas leaks, power cutoffs, water valves)\n* **Seismic Science Clarification** (Why earthquakes cannot be predicted)\n\nHow can I help you prepare or safeguard your family today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'n8n Cloud Webhook Agent'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_N8N_WEBHOOK_URL);
  const [showConfig, setShowConfig] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

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
      if (activeEngine === 'n8n') {
        const res = await api.askN8nChatbot(textToSend.trim(), undefined, webhookUrl);
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: res.output,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: res.source
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const res = await api.askAI(textToSend.trim());
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Gemini 3.8 Flash'
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'During ground shaking, immediately **DROP, COVER, and HOLD ON** beneath a sturdy table or desk. Please verify the n8n webhook connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Emergency Fallback'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('Testing webhook connection...');
    try {
      const res = await api.askN8nChatbot('Ping test connection', undefined, webhookUrl);
      if (res && res.output) {
        setTestStatus('Success! n8n chatbot is online and responding.');
      } else {
        setTestStatus('Received response from n8n webhook.');
      }
    } catch (err: any) {
      setTestStatus(`Connection error: ${err.message}`);
    }
    setTimeout(() => setTestStatus(null), 5000);
  };

  const promptChips = [
    'What should I keep in an emergency kit?',
    'What should I do if I am inside a building during a quake?',
    'What should I do during an earthquake while driving?',
    'How do I check for gas leaks after shaking?',
    'Can earthquakes be predicted?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Engine Switcher */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Connected to n8n AI Chatbot Webhook</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-950/30 border border-amber-500/30 px-3 py-1 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Never predicts future earthquakes</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">QuakeGuide AI Assistant</h1>
            <p className="text-slate-400 text-sm mt-1">
              Authoritative, science-grounded safety advisor trained on disaster management guidelines.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveEngine('n8n')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEngine === 'n8n'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>n8n Chatbot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>
            <button
              onClick={() => setActiveEngine('gemini')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEngine === 'gemini'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8</span>
            </button>
          </div>
        </div>

        {/* n8n Webhook Info Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
            <span className="text-slate-400">Target Webhook:</span>
            <span className="font-mono text-white truncate max-w-sm sm:max-w-md bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {webhookUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTestConnection}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
            >
              Test Ping
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Config</span>
            </button>
          </div>
        </div>

        {testStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{testStatus}</span>
          </div>
        )}

        {showConfig && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Webhook Endpoint Settings</span>
            </h4>
            <div className="space-y-1">
              <label htmlFor="assistant-n8n-webhook-input" className="text-slate-400 text-[11px]">n8n Webhook URL</label>
              <input
                id="assistant-n8n-webhook-input"
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Payload format: <code>&#123; "action": "sendMessage", "chatInput": "&lt;query&gt;", "sessionId": "&lt;id&gt;" &#125;</code>
            </p>
          </div>
        )}
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
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isBot
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                      : 'bg-amber-500 text-slate-950 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div className="flex items-center justify-between text-[10px] pt-1 opacity-70">
                    {isBot && m.source && (
                      <span className="font-mono text-amber-400 font-semibold">{m.source}</span>
                    )}
                    <span className="ml-auto font-mono text-slate-400">{m.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs text-slate-400 font-medium">
                  {activeEngine === 'n8n' ? 'n8n AI agent is generating advice...' : 'QuakeGuide AI is thinking...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex gap-1.5 overflow-x-auto no-scrollbar">
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
              placeholder="Ask about 72-hr kits, safe spots, gas shutoff, or tsunami evacuations..."
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
