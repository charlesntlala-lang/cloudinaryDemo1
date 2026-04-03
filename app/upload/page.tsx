"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";

interface UploadedImage {
  id: number;
  image_url: string;
}

const STORAGE_KEY = "cloudinary_uploaded_images";

export default function UploadPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);

  // Load images from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUploadedImages(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load images from localStorage:", err);
    }
  }, []);

  // Save images to both state and localStorage
  const saveImages = (images: UploadedImage[]) => {
    setUploadedImages(images);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (err) {
      console.error("Failed to save images to localStorage:", err);
    }
  };

  // Handle Cloudinary upload success — save URL to localStorage
  const handleUploadSuccess = async (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;
    setIsUploading(true);
    try {
      const newImage: UploadedImage = { id: Date.now(), image_url: url };
      saveImages([...uploadedImages, newImage]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    saveImages(uploadedImages.filter((img) => img.id !== id));
    if (selectedImage?.id === id) setSelectedImage(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#f0ede8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .upload-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #c9a96e; color: #0a0a0a; border: none; border-radius: 10px;
          padding: 13px 32px; font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 500; cursor: pointer; letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.1s;
        }
        .upload-btn:hover { background: #d4b57c; }
        .upload-btn:active { transform: scale(0.97); }
        .gallery-item {
          position: relative; border-radius: 12px; overflow: hidden; cursor: pointer;
          aspect-ratio: 1; background: #111; border: 1px solid #1e1e1e;
          transition: border-color 0.2s, transform 0.2s;
        }
        .gallery-item:hover { border-color: #c9a96e; transform: translateY(-2px); }
        .gallery-item:hover .delete-btn { opacity: 1; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .delete-btn {
          position: absolute; top: 8px; right: 8px; width: 28px; height: 28px;
          border-radius: 50%; background: rgba(10,10,10,0.85); border: 1px solid #333;
          color: #888; font-size: 13px; cursor: pointer; opacity: 0;
          transition: opacity 0.2s, color 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .delete-btn:hover { color: #e25c5c; }
        .lightbox-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.88);
          display: flex; align-items: center; justify-content: center; z-index: 100; padding: 32px;
        }
        .lightbox-inner { position: relative; max-width: 800px; width: 100%; }
        .lightbox-inner img { width: 100%; border-radius: 12px; display: block; }
        .lightbox-close {
          position: absolute; top: -40px; right: 0; background: transparent;
          border: none; color: #888; font-size: 22px; cursor: pointer; transition: color 0.2s;
        }
        .lightbox-close:hover { color: #f0ede8; }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "24px 40px", display: "flex", alignItems: "baseline", gap: "12px" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 400, color: "#f0ede8", letterSpacing: "-0.01em" }}>Archive</span>
        <span style={{ fontSize: "13px", color: "#444", letterSpacing: "0.08em", textTransform: "uppercase" }}>image vault</span>
      </div>

      <div style={{ padding: "40px", maxWidth: "960px", margin: "0 auto" }}>

        {/* Upload area */}
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", color: "#555", marginBottom: "24px" }}>
            Uploaded via Cloudinary · saved locally across sessions
          </p>
          <CldUploadWidget uploadPreset="demoCloud" onSuccess={handleUploadSuccess}>
            {({ open }) => (
              <button className="upload-btn" onClick={() => open()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Choose image
              </button>
            )}
          </CldUploadWidget>
          {isUploading && (
            <p className="pulse" style={{ fontSize: "13px", color: "#c9a96e", marginTop: "20px", letterSpacing: "0.06em" }}>
              Saving to vault…
            </p>
          )}
        </div>

        {/* Gallery */}
        {uploadedImages.length > 0 ? (
          <div style={{ marginTop: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Saved — {uploadedImages.length} {uploadedImages.length === 1 ? "image" : "images"}
              </p>
              <button
                onClick={() => saveImages([])}
                style={{ background: "transparent", border: "none", color: "#3a3a3a", fontSize: "12px", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseOver={e => (e.currentTarget.style.color = "#e25c5c")}
                onMouseOut={e => (e.currentTarget.style.color = "#3a3a3a")}
              >
                Clear all
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
              {uploadedImages.map((img) => (
                <div key={img.id} className="gallery-item" onClick={() => setSelectedImage(img)}>
                  <img src={img.image_url} alt={`upload-${img.id}`} />
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }} title="Remove">✕</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#2e2e2e", letterSpacing: "0.04em" }}>Your vault is empty</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.image_url} alt="full size" />
          </div>
        </div>
      )}
    </div>
  );
}