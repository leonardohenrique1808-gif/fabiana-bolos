import React from "react";

const fs = {
  width: "100%",
  border: "1px solid #E5D0EE",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  outline: "none",
  background: "#fff",
  fontFamily: "'Nunito',sans-serif",
  boxSizing: "border-box",
};

/**
 * Fld – campo de formulário genérico.
 * Se nenhum filho for fornecido, renderiza um <input> com todas as props passadas.
 */
export function Fld({ label, children, ...p }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 700, color: "#6B4C7A", marginBottom: 4, display: "block" }}>
          {label}
        </label>
      )}
      {children ?? <input style={fs} {...p} />}
    </div>
  );
}