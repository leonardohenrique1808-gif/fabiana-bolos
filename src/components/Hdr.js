import React from "react";
import { pk, pkL } from "../utils/constants";

export function Hdr({ title, onBack, right }) {
  return (
    <div
      className="no-print"
      style={{
        background: "#fff",
        borderBottom: `2px solid ${pkL}`,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onBack}
          style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: pk, padding: 0 }}
        >
          ←
        </button>
        <span style={{ fontWeight: 900, fontSize: 16, color: pk }}>{title}</span>
      </div>
      {right ?? <div />}
    </div>
  );
}