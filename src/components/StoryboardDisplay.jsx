import React, { useState, useEffect } from 'react';
import FrameCard from './FrameCard';
import { downloadImage } from '../services/geminiService';

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

function StoryboardDisplay({ storyboard, originalImage, originalFile, gridImage, onReset }) {
  const { petName, frames } = storyboard;
  const [frameImages, setFrameImages] = useState([]);
  const [showFrames, setShowFrames] = useState(false);

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

  // Build story text from frame dialogues
  const storyParagraphs = frames
    .map((f) => f.dialogue)
    .filter(Boolean);

  const heroImage = gridImage || originalImage;

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
        {/* Hero Image */}
        {heroImage && (
          <div className="w-full">
            <div
              className="relative w-full aspect-[4/5] bg-center bg-no-repeat bg-cover flex flex-col justify-end"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(18,18,18,0) 60%, rgba(18,18,18,1) 100%), url("${heroImage}")`,
              }}
            >
              {/* Metadata Overlay */}
              <div className="px-6 pb-2 flex gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <span className="material-symbols-outlined text-[16px] text-[#ee9d2b]">auto_stories</span>
                  <span className="text-xs font-semibold text-white">{frames.length} frames</span>
                </div>
                {petName && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                    <span className="material-symbols-outlined text-[16px] text-[#ee9d2b]">pets</span>
                    <span className="text-xs font-semibold text-white">{petName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Story Content */}
        <div className="px-6 pt-8">
          <h1 className="text-white tracking-tight text-[32px] font-extrabold leading-tight mb-6">
            The Story of {petName || 'Your Pet'}
          </h1>

          <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-normal">
            {storyParagraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>

        {/* Grid Image Section */}
        {gridImage && (
          <div className="px-6 pt-10">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ee9d2b]">grid_view</span>
              Storyboard Grid
            </h2>
            <img
              src={gridImage}
              alt="Pet storyboard grid"
              className="w-full rounded-2xl shadow-lg border border-white/10"
            />
          </div>
        )}

        {/* Frame Details Toggle */}
        <div className="px-6 pt-8">
          <button
            onClick={() => setShowFrames(!showFrames)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ee9d2b]">movie</span>
              Frame Details
            </span>
            <span className="material-symbols-outlined transition-transform" style={{ transform: showFrames ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>

          {showFrames && (
            <div className="mt-4 space-y-4">
              {frames.map((frame, index) => (
                <FrameCard
                  key={frame.frameNumber}
                  frame={frame}
                  frameImage={frameImages[index] || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Dock */}
      <div className="fixed bottom-0 w-full max-w-md bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent pt-10 pb-6 px-6">
        <div className="flex flex-col gap-3">
          {/* Primary Action */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-full h-14 bg-[#ee9d2b] text-[#121212] text-base font-bold tracking-tight shadow-lg shadow-[#ee9d2b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined font-bold">magic_button</span>
            <span>Generate New Variant</span>
          </button>
          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadGrid}
              className="flex-1 flex items-center justify-center gap-2 rounded-full h-14 bg-white/10 text-white text-base font-bold border border-white/10"
            >
              <span className="material-symbols-outlined">download</span>
              <span>Save Story</span>
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
