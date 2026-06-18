import React, { useState } from "react";
import { Fld } from "../components/Fld";
import { Btn } from "../components/Btn";

export function ClientRegisterScreen({ onSave, onBack }) {
  const [f, setF] = useState({ nome: "", telefone: "", aniversario: "" });
  const ok = f.nome && f.telefone && f.aniversario;

  return (
    <div style={{ background: "#FFF9F2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", color: "#4A2C2A" }}>Criar Conta</h2>
        
        <Fld label="Nome completo *">
          <input value={f.nome} onChange={e => setF(x => ({ ...x, nome: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #FFC2D1" }} />
        </Fld>
        
        <Fld label="WhatsApp *">
          <input value={f.telefone} onChange={e => setF(x => ({ ...x, telefone: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #FFC2D1" }} />
        </Fld>
        
        <Fld label="Aniversário 🎂 *">
          <input type="date" value={f.aniversario} onChange={e => setF(x => ({ ...x, aniversario: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #FFC2D1" }} />
        </Fld>
        
        <Btn ch="Criar conta" st={{ marginBottom: 8, opacity: ok ? 1 : 0.5, background: "#E598A8" }} disabled={!ok} onClick={() => ok && onSave(f)} />
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}>← Voltar</button>
      </div>
    </div>
  );
}