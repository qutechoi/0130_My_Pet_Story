import React, { useState, useRef } from 'react';
import { validateImageFile, fileToDataURL } from '../utils/imageProcessor';

function ImageUploader({ onImageSelect, onGenerate, isLoading }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentFileName(file.name);

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      setIsUploading(false);
      return;
    }

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const dataUrl = await fileToDataURL(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      const newImage = {
        id: Date.now(),
        file,
        preview: dataUrl,
        name: file.name,
      };

      setUploadedImages((prev) => [newImage, ...prev]);

      // Auto-select the newly uploaded image
      const newSelected = new Set(selectedImages);
      newSelected.add(newImage.id);
      setSelectedImages(newSelected);

      // Set as current image for generation
      onImageSelect(file, dataUrl);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentFileName('');
      }, 500);
    } catch (err) {
      setError('An error occurred while loading the image.');
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileName('');
      console.error(err);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);

    // Use the first selected image for generation
    const firstSelectedId = Array.from(newSelected)[0];
    const selectedImage = uploadedImages.find(img => img.id === firstSelectedId);
    if (selectedImage) {
      onImageSelect(selectedImage.file, selectedImage.preview);
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.size === uploadedImages.length) {
      setSelectedImages(new Set());
    } else {
      const allIds = new Set(uploadedImages.map(img => img.id));
      setSelectedImages(allIds);
    }
  };

  const handleGenerate = () => {
    if (selectedImages.size > 0) {
      onGenerate();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-1 -ml-1" onClick={() => window.history.back()}>
            <span className="material-symbols-outlined text-slate-600">close</span>
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Add Visual Assets</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">cloud_upload</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* Upload Dropzone */}
        <section>
          <div
            className={`relative group border-2 border-dashed rounded-2xl bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center transition-colors ${
              isDragging
                ? 'border-primary/50 bg-primary/5'
                : 'border-slate-200 hover:border-primary/50 hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="size-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">Drop brand assets here</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">Supports PNG, JPG, or SVG up to 20MB</p>
            <button
              onClick={handleClick}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-primary/20"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleFileInputChange}
            />
          </div>
        </section>

        {/* Recently Uploaded */}
        {uploadedImages.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recently Uploaded</h2>
              <button
                onClick={handleSelectAll}
                className="text-primary text-sm font-semibold"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url(${image.preview})` }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-active:bg-black/20 transition-colors" />
                  <div className="absolute top-2 right-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      className="rounded border-white/40 bg-black/20 text-primary focus:ring-primary size-5 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
              {/* More placeholder */}
              <div className="aspect-square rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-300">more_horiz</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 p-4 space-y-4">
        {/* Upload Progress */}
        {isUploading && currentFileName && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Uploading "{currentFileName}"</span>
              <span className="text-primary">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={selectedImages.size === 0 || isLoading}
            className={`px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all ${
              selectedImages.size > 0 && !isLoading
                ? 'bg-primary text-white shadow-primary/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Done
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ImageUploader;
