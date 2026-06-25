import React from "react";

export function Slct({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label className="fld-label">{label}</label>}
      <select value={value} onChange={onChange} className="input-padrao">
        {options}
      </select>
    </div>
  );
}
