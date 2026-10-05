import React, { useState, useEffect, useRef } from 'react';
import { consultationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  RotateCcw,
  Shirt,
  Palette,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';

const StyleConsultant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const res = await consultationAPI.getConsultation();
      setMessages(res.data.data.messages || []);
    } catch (err) {
      console.error('Failed to load consultation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    // Optimistic user message
    const userMsg = {
      role: 'user',
      content: text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await consultationAPI.sendMessage(text);
      setMessages(res.data.data.messages || []);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleResetSession = async () => {
    if (confirm('Start a new consultation session?')) {
      try {
        setLoading(true);
        const res = await consultationAPI.resetSession();
        setMessages(res.data.data.messages || []);
      } catch (err) {
        console.error('Failed to reset session:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#000000] text-[#D4D4D4] flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#000000]">
              MAISON AI Stylist
            </h1>
            <p className="text-xs text-[#404040]">
              Calibrated to {user?.activeColorSeason || 'Deep Autumn'} • 24/7 Wardrobe Guidance
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4D4D4] text-xs font-semibold text-[#525252] hover:bg-[#FAFAFA] transition-colors"
          title="Start fresh session"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      {/* Main Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden pt-4">
        {/* Chat Stream Window */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-[#E5E5E5] shadow-sm overflow-hidden h-full">
          {/* Scrollable Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#D4D4D4] border-t-[#000000] rounded-full animate-spin"></div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      isAssistant ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#FFFFFF] border border-[#E5E5E5] text-[#000000] shadow-sm'
                          : 'bg-[#000000] text-[#FFFFFF] shadow-sm'
                      }`}
                    >
                      {/* Stylist Header Badge */}
                      {isAssistant && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#000000] uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>MAISON</span>
                        </div>
                      )}

                      {/* Message Markdown / Text */}
                      <div className="whitespace-pre-line space-y-2">
                        {msg.content}
                      </div>

                      {/* Interactive Style Brief Widget */}
                      {msg.styleBrief && (
                        <div className="mt-4 p-4 rounded-xl bg-white border border-[#D4D4D4] space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#000000]">
                              Curated Style Brief
                            </span>
                            <span className="text-[11px] font-semibold text-[#404040]">
                              {msg.styleBrief.occasion}
                            </span>
                          </div>
                          <p className="text-xs text-[#525252]">
                            <strong>Mood:</strong> {msg.styleBrief.mood}
                          </p>
                          <p className="text-xs text-[#525252]">
                            <strong>Key Rule:</strong> {msg.styleBrief.keyRule}
                          </p>
                          {msg.styleBrief.palette && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.styleBrief.palette.map((color, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAFAFA] text-[#525252]"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Recommended Pieces Carousel */}
                      {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#E5E5E5] space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#000000]">
                            Recommended Closet Pieces:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.recommendedItems.map((piece, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E5E5E5] text-xs"
                              >
                                <Shirt className="w-3.5 h-3.5 text-[#000000]" />
                                <span className="font-semibold">{piece.name}</span>
                                <span className="text-[10px] text-gray-500">({piece.color})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Prompt Chips */}
                    {isAssistant && msg.chips && msg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 max-w-[88%] sm:max-w-[80%]">
                        {msg.chips.map((chip, chipIdx) => (
                          <button
                            key={chipIdx}
                            onClick={() => handleSendMessage(chip)}
                            disabled={sending}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAFAFA] text-[#525252] border border-[#D4D4D4] hover:bg-[#000000] hover:text-[#FFFFFF] hover:border-[#000000] transition-all disabled:opacity-50"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {sending && (
              <div className="flex items-center gap-2 text-xs font-medium text-[#404040] bg-[#FFFFFF] p-3 rounded-2xl border border-[#E5E5E5] w-fit animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
                <span>MAISON is styling your look...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-[#E5E5E5] bg-[#FFFFFF]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask MAISON anything (e.g., 'What should I wear to a dinner party tonight?')..."
                className="flex-grow px-4 py-3 rounded-full border border-[#D4D4D4] focus:border-[#000000] focus:outline-none text-sm text-[#000000] bg-white shadow-sm"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="w-11 h-11 rounded-full bg-[#000000] text-[#FFFFFF] flex items-center justify-center hover:bg-[#171717] transition-colors shadow-sm disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Style Profile Summary */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
              Active Style Profile
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#000000]">
                {user?.name || 'Client'}
              </h3>
              <p className="text-xs text-[#404040]">
                Season: <strong>{user?.activeColorSeason || 'Deep Autumn'}</strong>
              </p>
            </div>

            <div className="pt-2 border-t border-[#E5E5E5] space-y-2">
              <span className="text-xs font-bold text-[#000000] block">
                Target Aesthetics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(user?.stylePreferences?.aesthetics || ['Quiet Luxury', 'Casual Chic']).map(
                  (a, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FAFAFA] text-[#525252] border border-[#D4D4D4]"
                    >
                      {a}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E5E5] space-y-1 text-xs text-[#525252]">
              <p>
                <strong>Silhouette:</strong> {user?.stylePreferences?.bodyType || 'Balanced'}
              </p>
              <p>
                <strong>Tier:</strong> <span className="uppercase font-bold text-[#000000]">{user?.plan || 'Free'}</span>
              </p>
            </div>
          </div>

          {/* Quick Styling Prompt Shortcuts */}
          <div className="bg-[#FAFAFA]/60 rounded-3xl p-5 border border-[#D4D4D4] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#000000]">
              Quick Styling Prompts
            </span>
            <div className="space-y-1.5">
              {[
                'Build a 5-piece travel capsule wardrobe',
                'What shoes go best with wide-leg jeans?',
                'How to dress up a plain white t-shirt',
                'Autumn color harmony rules for my closet',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2 rounded-xl text-xs text-[#525252] hover:bg-white hover:text-[#000000] transition-colors border border-transparent hover:border-[#D4D4D4]"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleConsultant;
