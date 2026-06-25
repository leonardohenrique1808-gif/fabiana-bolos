import React from "react";

/**
 * Fld – campo de formulário genérico.
 * Se nenhum filho for fornecido, renderiza um <input> com todas as
 * props restantes (value, onChange, type, placeholder, etc.).
 */
export function Fld({ label, children, ...p }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label className="fld-label">{label}</label>
      )}
      {children ?? <input className="input-padrao" {...p} />}
    </div>
  );
}
