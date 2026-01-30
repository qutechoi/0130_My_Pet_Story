import React from 'react';
import { downloadImage } from '../services/geminiService';

function FrameCard({ frame, frameImage }) {
  const { frameNumber, title, visualDescription, action, dialogue, transition } = frame;

  const handleDownloadImage = () => {
    if (frameImage) {
      const filename = `frame-${frameNumber}-${title.replace(/\s+/g, '-')}.png`;
      downloadImage(frameImage, filename);
    }
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Frame Image */}
      {frameImage && (
        <div className="relative">
          <img src={frameImage} alt={`Frame ${frameNumber} - ${title}`} className="w-full aspect-square object-cover" />
          <button
            onClick={handleDownloadImage}
            className="absolute bottom-2 right-2 size-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ee9d2b]/20 text-[#ee9d2b] text-xs font-bold">
            {frameNumber}
          </span>
          <h3 className="text-white font-bold text-base truncate">{title}</h3>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-[#ee9d2b] font-semibold text-xs uppercase tracking-wider">Visual</span>
            <p className="text-slate-400 mt-0.5 leading-relaxed">{visualDescription}</p>
          </div>
          <div>
            <span className="text-[#ee9d2b] font-semibold text-xs uppercase tracking-wider">Action</span>
            <p className="text-slate-400 mt-0.5 leading-relaxed">{action}</p>
          </div>
          {dialogue && (
            <div>
              <span className="text-[#ee9d2b] font-semibold text-xs uppercase tracking-wider">Mood</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed italic">{dialogue}</p>
            </div>
          )}
          {transition && (
            <div>
              <span className="text-[#ee9d2b] font-semibold text-xs uppercase tracking-wider">Transition</span>
              <p className="text-slate-500 mt-0.5 leading-relaxed">{transition}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FrameCard;
