import React, { useState, useEffect } from 'react';
import { downloadImage } from '../services/geminiService';
import { t } from '../i18n';

function splitGridImage(gridImageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cols = 3;
      const rows = 3;
      const cellW = Math.floor(img.width / cols);
      const cellH = Math.floor(img.height / rows);
      const frames = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const canvas = document.createElement('canvas');
          canvas.width = cellW;
          canvas.height = cellH;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, c * cellW, r * cellH, cellW, cellH, 0, 0, cellW, cellH);
          frames.push(canvas.toDataURL('image/png'));
        }
      }
      resolve(frames);
    };
    img.src = gridImageSrc;
  });
}

function StoryboardDisplay({ storyboard, originalImage, originalFile, gridImage, onReset, lang }) {
  const { storyTitle, petName, frames } = storyboard;
  const [frameImages, setFrameImages] = useState([]);

  useEffect(() => {
    if (gridImage) {
      splitGridImage(gridImage).then(setFrameImages);
    }
  }, [gridImage]);

  const handleDownloadGrid = () => {
    if (gridImage) {
      const filename = `pet-storyboard-${petName || 'pet'}.png`;
      downloadImage(gridImage, filename);
    }
  };

  const heroImage = gridImage || originalImage;
  const displayTitle = storyTitle || (lang === 'ko' ? `${petName || '반려동물'}의 이야기` : `The Story of ${petName || 'Your Pet'}`);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-[#121212] text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top App Bar */}
      <div className="fixed top-0 z-50 w-full max-w-md flex items-center p-4 pb-2 justify-between">
        <button
          onClick={onReset}
          className="flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center justify-end gap-2">
          <button className="flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white cursor-pointer">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-48" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Hero: 3x3 Grid Image */}
        {heroImage && (
          <div className="w-full">
            <div
              className="relative w-full aspect-[4/5] bg-center bg-no-repeat bg-cover flex flex-col justify-end"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(18,18,18,0) 60%, rgba(18,18,18,1) 100%), url("${heroImage}")`,
              }}
            />
          </div>
        )}

        {/* Story Title */}
        <div className="px-6 pt-8">
          <h1 className="text-white tracking-tight text-[28px] font-extrabold leading-tight mb-8">
            {displayTitle}
          </h1>
        </div>

        {/* Frame-by-frame story */}
        <div className="px-6 space-y-8">
          {frames.map((frame, index) => (
            <div key={frame.frameNumber}>
              {/* Frame Image */}
              {frameImages[index] && (
                <img
                  src={frameImages[index]}
                  alt={frame.title}
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg border border-white/10 mb-4"
                />
              )}
              {/* Frame Story Text */}
              {frame.dialogue && (
                <p className="text-slate-300 text-base leading-relaxed">
                  {frame.dialogue}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action Dock */}
      <div className="fixed bottom-0 w-full max-w-md bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent pt-10 pb-6 px-6">
        <div className="flex flex-col gap-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-full h-14 bg-[#ee9d2b] text-[#121212] text-base font-bold tracking-tight shadow-lg shadow-[#ee9d2b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined font-bold">magic_button</span>
            <span>{t(lang, 'generateNewVariant')}</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadGrid}
              className="flex-1 flex items-center justify-center gap-2 rounded-full h-14 bg-white/10 text-white text-base font-bold border border-white/10"
            >
              <span className="material-symbols-outlined">download</span>
              <span>{t(lang, 'saveStory')}</span>
            </button>
            <button className="w-14 flex items-center justify-center rounded-full h-14 bg-white/10 text-white border border-white/10">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryboardDisplay;
