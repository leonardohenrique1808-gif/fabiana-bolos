import React, { useState } from "react";
import { Btn, BtnS } from "./Btn";
import { UPSELL, pk, pkL } from "../utils/constants";
import { fmtR } from "../utils/helpers";

export function UpsellModal({ onAdd, onSkip }) {
  const [sel, setSel] = useState([]);
  const toggle = (id) => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const total = sel.reduce((s, id) => s + (UPSELL.find(u => u.id === id)?.preco || 0), 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }} className="no-print">
      <div className="fu" style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 28 }}>✨</div>
          <h3 style={{ fontWeight: 900, fontSize: 18 }}>Que tal adicionar?</h3>
        </div>
        
        {UPSELL.map(u => (
          <div 
            key={u.id} 
            onClick={() => toggle(u.id)} 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              border: `2px solid ${sel.includes(u.id) ? pk : "#E5D0EE"}`, 
              borderRadius: 12, 
              padding: "11px 14px", 
              marginBottom: 8, 
              cursor: "pointer", 
              background: sel.includes(u.id) ? pkL : "#fff" 
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{u.nome}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{u.desc}</div>
            </div>
            <div style={{ fontWeight: 900, color: pk }}>+{fmtR(u.preco)}</div>
          </div>
        ))}
        
        {sel.length > 0 && (
          <div style={{ background: pkL, borderRadius: 10, padding: "8px 14px", marginBottom: 12, fontWeight: 800, color: pk }}>
            Adicional: +{fmtR(total)}
          </div>
        )}
        
        <Btn 
          ch={sel.length > 0 ? "✅ Adicionar e confirmar →" : "Confirmar sem adicionais →"} 
          onClick={() => onAdd(UPSELL.filter(u => sel.includes(u.id)))} 
        />
        <BtnS ch="Pular" st={{ marginTop: 8 }} onClick={onSkip} />
      </div>
    </div>
  );
}