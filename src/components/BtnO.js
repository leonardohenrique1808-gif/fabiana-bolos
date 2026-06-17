import React from "react";

export function BtnO({ active, ch, st, ...p }) {
  return (
    <button 
      style={{ 
        background: active ? "#E91E8C" : "#fff",
        color: active ? "#fff" : "#E91E8C",
        border: `1.5px solid ${active ? "#E91E8C" : "#E5D0EE"}`,
        borderRadius: 10,
        padding: "9px 14px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "'Nunito',sans-serif", 
        ...st 
      }} 
      {...p}
    >
      {ch}
    </button>
  );
}