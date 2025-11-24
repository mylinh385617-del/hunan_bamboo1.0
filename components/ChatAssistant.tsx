import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { sendMessageToGemini, generateLibraryContext } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useData } from '../contexts/DataContext';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: '您好，我是简牍文库AI助手。关于湖南出土的简牍，您可以问我任何问题。' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data } = useData(); // Get live data

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    // Generate context from live data
    const liveContext = generateLibraryContext(data);
    
    try {
      const responseText = await sendMessageToGemini(userMsg.text, history, liveContext);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-bamboo-dark flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-ink-black text-bamboo-light p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500" />
              <h3 className="font-serif font-bold">文库助手</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-vermilion transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed shadow-sm font-serif
                    ${msg.role === 'user' 
                      ? 'bg-vermilion text-white rounded-tr-none' 
                      : 'bg-white border border-stone-200 text-ink-black rounded-tl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-stone-200 p-3 rounded-lg rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-vermilion" />
                    <span className="text-xs text-stone-500">查阅文献中...</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="请输入您的问题..."
              className="flex-1 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-vermilion focus:ring-1 focus:ring-vermilion bg-stone-50 font-serif"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-ink-black text-white p-2 rounded-md hover:bg-vermilion transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 font-serif font-bold border-2
          ${isOpen 
            ? 'bg-white text-ink-black border-ink-black rotate-90' 
            : 'bg-vermilion text-white border-vermilion hover:bg-red-800 hover:border-red-800'
          }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className="hidden md:inline">咨询专家</span>}
      </button>
    </div>
  );
};

export default ChatAssistant;