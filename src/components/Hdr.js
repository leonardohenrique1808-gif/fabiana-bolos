import React from "react";

export function Hdr({ title, onBack }) {
  return (
    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", borderBottom: "1px solid #E5D0EE", background: "#fff" }}>
      <button 
        onClick={onBack} 
        style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#E91E8C" }}
      >
        ←
      </button>
      <span style={{ fontWeight: 900, marginLeft: 10, fontSize: 18, color: "#333" }}>
        {title}
      </span>
    </div>
  );
}