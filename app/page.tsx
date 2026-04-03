"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Archive <span style={{ opacity: 0.6 }}>IMAGE VAULT</span>
      </div>

      {/* Main Card */}
      <div
        style={{
          background: "#111",
          padding: "60px",
          borderRadius: "16px",
          textAlign: "center",
          width: "400px",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "20px" }}>📁</div>

        <p style={{ opacity: 0.7, marginBottom: "30px" }}>
          Upload images securely and access them anytime
        </p>

        <button
          onClick={() => router.push("/upload")}
          style={{
            padding: "12px 24px",
            background: "#d4af37",
            color: "#000",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Go to Upload →
        </button>
      </div>
    </div>
  );
}