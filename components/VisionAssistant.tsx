import React, { useState, useRef, useEffect } from 'react';
import { VisionChat } from '../types.ts';
import { agentChatRequest } from '../services/apiClient.ts';
import { useStudioStore } from '../store.ts';
import Logo from './Logo.tsx';

const VisionAssistant: React.FC = () => {
  const { auth } = useStudioStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<VisionChat[]>([
    {
      role: 'assistant',
      content: `Hello! I am the Figment Studio Assistant. 

I can assist you with:
• Our services (3D Stills, Animations, Scale Models)
• Pricing benchmarks & project timelines
• Design feedback, mood ideas & color styling
• Navigating to instant quotes or booking a consultation

What would you like to explore today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [hasNotification, setHasNotification] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamingContent, isOpen]);

  // Show notification badge on first load after 3 seconds if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const data = base64.split(',')[1];
      setSelectedImage({ data, mimeType: file.type, preview: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (text: string = input) => {
    const finalInput = text || input;
    if ((!finalInput.trim() && !selectedImage) || isLoading) return;

    const userMessage: VisionChat = {
      role: 'user',
      content: finalInput || '[Image analysis request]'
    };
    const currentHistory = [...messages];
    const imageToSend = selectedImage
      ? { data: selectedImage.data, mimeType: selectedImage.mimeType }
      : undefined;

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await agentChatRequest(auth.accessToken, {
        message: finalInput.trim() ? finalInput : 'Analyze this architectural design/concept.',
        history: currentHistory,
        image: imageToSend,
      });

      const fullResponse = response?.reply || '';
      setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not process that request right now. You can also connect with our team directly via hello@figmentstudio.ng or WhatsApp (+234 816 829 9111).'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setHasNotification(false);
  };

  // Floating trigger button (closed state)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={toggleOpen}
          className="relative group p-0 border-0 bg-transparent cursor-pointer focus:outline-none"
          aria-label="Open Studio Assistant"
        >
          {/* Notification dot */}
          {hasNotification && (
            <span className="absolute -top-1 -right-1 size-4 bg-primary rounded-full border-2 border-zinc-950 z-10 animate-bounce shadow-md" />
          )}

          <div className="relative size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_8px_30px_rgba(240,122,58,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20">
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform duration-300">
              auto_awesome
            </span>
          </div>
        </button>
      </div>
    );
  }

  // Chat panel (open state)
  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 fade-in duration-300">
      <div className="bg-zinc-950 rounded-[1.5rem] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col border border-white/10 h-full relative text-text-main">
        {/* Header */}
        <div className="bg-[#181818] p-4 flex items-center justify-between text-white shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo size={20} iconOnly />
            <div className="text-left">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider leading-none text-white">
                Studio Assistant
              </h3>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isLoading ? 'Thinking...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleOpen}
              className="size-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white"
              aria-label="Close chat"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Messages list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/60 custom-scrollbar text-left text-xs"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-[1rem] text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white font-medium rounded-tr-none'
                    : 'bg-[#1E1E1E] text-text-secondary border border-white/5 rounded-tl-none font-normal whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {(isLoading || streamingContent) && (
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 rounded-[1rem] rounded-tl-none bg-[#1E1E1E] text-text-secondary border border-white/5 shadow-sm text-xs font-medium whitespace-pre-wrap">
                {streamingContent || (
                  <span className="flex items-center gap-2 py-1">
                    <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-3 bg-[#181818] border-t border-white/10 relative">
          {selectedImage && (
            <div className="mb-2 flex items-center gap-3 bg-zinc-900 p-2 rounded-xl border border-primary/20">
              <div className="size-10 rounded-lg overflow-hidden shrink-0">
                <img
                  src={selectedImage.preview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] font-bold uppercase text-primary tracking-widest">
                  Image Attached
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-text-muted hover:text-red-400 transition-colors p-1"
                aria-label="Remove attached image"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="size-10 rounded-lg border flex items-center justify-center transition-all bg-zinc-900 border-white/10 text-text-muted hover:text-primary hover:border-primary/40 shrink-0"
              aria-label="Attach reference image"
            >
              <span className="material-symbols-outlined text-lg">image</span>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about estimates, styling, or timelines..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-normal text-white focus:border-primary focus:outline-none transition-all placeholder:text-text-faint"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="bg-primary text-white size-10 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shrink-0"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionAssistant;
