import React, { useState } from "react";
import { Fld } from "../components/Fld";
import { Btn } from "../components/Btn";
import { maskPh } from "../utils/helpers";
import { pkL } from "../utils/constants";

export function ClientRegisterScreen({ onSave, onBack }) {
  const [f, setF] = useState({ nome: "", telefone: "", aniversario: "" });
  const ok = f.nome && f.telefone;

  return (
    <div style={{ background: `linear-gradient(160deg, ${pkL}, #FDF6FB)`, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fu" style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Criar conta</h2>
        <Fld label="Nome completo *">
          <input value={f.nome} onChange={e => setF(x => ({ ...x, nome: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
        </Fld>
        <Fld label="WhatsApp *">
          <input value={f.telefone} onChange={e => setF(x => ({ ...x, telefone: maskPh(e.target.value) }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
        </Fld>
        <Fld label="Aniversário 🎂">
          <input type="date" value={f.aniversario} onChange={e => setF(x => ({ ...x, aniversario: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
        </Fld>
        
        <Btn ch="Criar conta" st={{ marginBottom: 8, opacity: ok ? 1 : 0.5 }} disabled={!ok} onClick={() => ok && onSave(f)} />
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}>← Já tenho conta</button>
      </div>
    </div>
  );
}