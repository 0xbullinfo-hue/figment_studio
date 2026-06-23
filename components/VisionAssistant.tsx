import React, { useState, useRef, useEffect } from 'react';
import { VisionChat } from '../types.ts';
import { streamVisionAI } from '../services/geminiService.ts';
import Logo from './Logo.tsx';

interface VisionAssistantProps {
  onClose: () => void;
}

const VisionAssistant: React.FC<VisionAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<VisionChat[]>([
    { role: 'assistant', content: 'Hi, I am Vision AI. Share your idea and I can help with mood, style, and simple design direction. For advanced architecture controls, open ArcViz.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamingContent, isMinimized]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const data = base64.split(',')[1];
      setSelectedImage({
        data,
        mimeType: file.type,
        preview: base64
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (text: string = input) => {
    const finalInput = text || input;
    if ((!finalInput.trim() && !selectedImage) || isLoading) return;

    const userMessage: VisionChat = { role: 'user', content: finalInput || '[Image analysis request]' };
    const currentHistory = [...messages];
    const imageToSend = selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined;

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    setStreamingContent('');

    try {
      let fullResponse = '';
      const stream = streamVisionAI(finalInput || 'Analyze this design image in simple terms.', currentHistory, imageToSend);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'I could not process that right now. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-8 right-8 z-[100] bg-primary text-white size-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-white"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">auto_awesome</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100] w-full max-w-[440px] h-[620px] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="bg-white rounded-[2rem] shadow-[0_30px_70px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-gray-100 h-full relative">
        <div className="bg-[#1a1a1a] p-6 flex items-center justify-between text-white shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Logo size={22} iconOnly />
            <div className="text-left">
              <h3 className="font-display font-black text-base uppercase tracking-widest leading-none">Vision AI</h3>
              <p className="text-primary text-[9px] font-black uppercase tracking-[0.25em] mt-1">Basic Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(true)} className="size-9 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-xl">remove</span>
            </button>
            <button onClick={onClose} className="size-9 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/40 custom-scrollbar text-left">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-3 rounded-[1.25rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-white font-bold rounded-tr-none'
                  : 'bg-white text-slate-800 border border-gray-100 rounded-tl-none font-medium whitespace-pre-wrap'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {(isLoading || streamingContent) && (
            <div className="flex justify-start">
              <div className="max-w-[85%] px-5 py-3 rounded-[1.25rem] rounded-tl-none bg-white text-slate-800 border border-gray-100 shadow-sm text-sm font-medium whitespace-pre-wrap">
                {streamingContent || 'Thinking...'}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          {selectedImage && (
            <div className="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-primary/20">
              <div className="size-12 rounded-lg overflow-hidden">
                <img src={selectedImage.preview} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest">Image Attached</p>
              </div>
              <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">cancel</span>
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="size-12 rounded-xl border flex items-center justify-center transition-all bg-white border-gray-200 text-gray-500 hover:text-primary"
            >
              <span className="material-symbols-outlined">image</span>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Vision AI..."
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="bg-primary text-white size-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionAssistant;
