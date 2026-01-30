import React, { useState } from 'react';

function StoryInput({ imagePreviewUrl, onSubmit, onBack }) {
  const [story, setStory] = useState('');

  const handleSubmit = () => {
    onSubmit(story);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-1 -ml-1" onClick={onBack}>
            <span className="material-symbols-outlined text-slate-600">arrow_back</span>
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Write Your Story</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Image Preview */}
        <section className="flex justify-center">
          <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-md">
            <img
              src={imagePreviewUrl}
              alt="Uploaded pet"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Story Input */}
        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Pet Story
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={"e.g. My golden retriever Max loves playing at the beach. He chases waves, digs holes in the sand, and falls asleep under the umbrella after a long day of fun."}
            className="w-full h-48 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 text-base text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:border-primary/50 focus:bg-white transition-colors"
          />
          <p className="text-xs text-slate-400">
            Describe your pet's story, personality, or a scene you'd like to see. The AI will create a 9-frame storyboard based on your description.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 p-4">
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all bg-primary text-white shadow-primary/30"
          >
            Generate Storyboard
          </button>
        </div>
      </footer>
    </div>
  );
}

export default StoryInput;
