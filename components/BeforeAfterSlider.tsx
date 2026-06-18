import React, { useState } from 'react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);

    return (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden group select-none shadow-2xl border border-gray-100 bg-gray-50">
            {/* After Image (Base) */}
            <img src={afterImage} alt="After Render" className="absolute inset-0 w-full h-full object-cover" />

            {/* Before Image (Clipping Mask) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img src={beforeImage} alt="Before Clay Render" className="absolute inset-0 w-full h-full object-cover grayscale opacity-90" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest pointer-events-none">
                    Clay Model (Before)
                </div>
            </div>

            <div className="absolute top-6 right-6 px-4 py-2 bg-primary/80 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest pointer-events-none">
                Final Render (After)
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white flex items-center justify-center pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl text-primary border border-gray-100 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-sm font-black">sync_alt</span>
                </div>
            </div>

            {/* Invisible Range Input */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
            />
        </div>
    );
};

export default BeforeAfterSlider;
