import React from "react";

export function Fld({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 4, color: "#333" }}>
        {label}
      </label>
      {children}
    </div>
  );
}