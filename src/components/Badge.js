import React from "react";
import { STATUS_META } from "../utils/constants";

export function Badge({ s }) {
  const m = STATUS_META[s] ?? STATUS_META["Aguardando Caução"];
  return (
    <span style={{ 
      background: m.bg, 
      color: m.text, 
      border: `1px solid ${m.brd}`, 
      borderRadius: 20, 
      padding: "2px 10px", 
      fontSize: 11, 
      fontWeight: 700, 
      whiteSpace: "nowrap" 
    }}>
      {m.em} {s}
    </span>
  );
}