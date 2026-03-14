import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, Paperclip, Loader2, User, Bot, 
  MapPin, Calendar, Sparkles, Navigation 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addConversation, setActiveConversation } from '../store/conversationsSlice';
import API from '../services/api';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const HomePage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const { user } = useSelector(state => state.auth);
  const { activeId } = useSelector(state => state.conversations);
  const dispatch = useDispatch();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let currentConvId = activeId;
      
      // If no active conversation, create one
      if (!currentConvId) {
        const convRes = await API.post('/conversations', { title: input.substring(0, 30) });
        currentConvId = convRes.data.id;
        dispatch(addConversation(convRes.data));
        dispatch(setActiveConversation(currentConvId));
      }

      const res = await API.post('/ai/chat', { 
        conversationId: currentConvId, 
        message: input 
      });
      
      // Res contains [userMsgFromDB, assistantMsgFromDB]
      setMessages(prev => [...prev, res.data[1]]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* GREETING SECTION */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-blue-50 p-4 rounded-2xl mb-6 shadow-sm">
            <Sparkles className="text-blue-600" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Where to next, {user?.name?.split(' ')[0] || 'Traveler'}?
          </h1>
          <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
            I'm your AI travel planner. Ask me to plan a trip, find hidden gems, or check the weather anywhere in the world.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-xl">
            {[
              { icon: <MapPin size={18} />, text: 'Plan a 5-day trip to Tokyo' },
              { icon: <Navigation size={18} />, text: 'Find cafes in Paris' },
              { icon: <Calendar size={18} />, text: 'Budget itinerary for Bali' },
              { icon: <Sparkles size={18} />, text: 'Weekend getaway in NYC' }
            ].map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s.text)}
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl text-left text-sm font-medium text-slate-700 hover:border-blue-500 hover:shadow-md hover:shadow-blue-50 transition-all active:scale-[0.98]"
              >
                <div className="bg-slate-50 p-2 rounded-lg text-slate-500 group-hover:text-blue-500">{s.icon}</div>
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES AREA */}
      {messages.length > 0 && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Bot size={18} />
                </div>
              )}
              <div className={`
                max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}
              `}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-sm font-bold text-xs uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHAT INPUT AREA */}
      <div className="p-6 bg-transparent">
        <form 
          onSubmit={handleSendMessage}
          className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xl shadow-slate-200/50 flex items-center gap-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all"
        >
          <button type="button" className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder={listening ? "Listening..." : "Ask me anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium py-2 px-1"
          />
          <button 
            type="button" 
            onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening()}
            className={`p-2 transition-colors ${listening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}
          >
            <Mic size={20} />
          </button>
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none text-white p-2.5 rounded-xl transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium tracking-wide uppercase">
          TrippyGo AI can make mistakes. Boost your plans with human verification.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
