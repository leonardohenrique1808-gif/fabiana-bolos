import React from "react";
import { STATUS_UNICO, pk } from "../utils/constants";

export function StatusBar({ status }) {
  const idx = STATUS_UNICO.indexOf(status);
  
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
      {STATUS_UNICO.filter(s => s !== "Cancelado").map((s, i) => (
        <div 
          key={i} 
          style={{ 
            flex: 1, 
            height: 6, 
            borderRadius: 3, 
            background: i === idx ? pk : (i < idx ? "#15803D" : "#E5D0EE") 
          }} 
        />
      ))}
    </div>
  );
}