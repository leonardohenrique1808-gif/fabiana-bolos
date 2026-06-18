import React, { useState } from "react";
import { Fld }  from "../components/Fld";
import { Btn }  from "../components/Btn";
import { san, maskPh } from "../utils/helpers";

const fs = { width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" };

export function ClientRegisterScreen({ onSave, onBack }) {
  const [f, setF] = useState({ nome: "", telefone: "", aniversario: "" });
  // Somente nome e telefone são obrigatórios — aniversário é opcional
  const ok = f.nome.trim() && f.telefone.trim();

  const handleSave = () => {
    if (!ok) return;
    const novo = san({
      id:          Date.now(),
      nome:        f.nome.trim(),
      telefone:    f.telefone,
      aniversario: f.aniversario || "",
      historico:   [],
      endereco:    "",
    });
    onSave(novo);
  };

  return (
    <div style={{ background: `linear-gradient(160deg,#FFF0F8,#FDF6FB)`, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, boxShadow: "0 4px 20px rgba(233,30,140,.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>🌸</div>
          <h2 style={{ margin: "6px 0 4px", fontWeight: 900 }}>Criar Conta</h2>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Preencha seus dados para fazer pedidos</p>
        </div>

        <Fld label="Nome completo *">
          <input
            value={f.nome}
            onChange={e => setF(x => ({ ...x, nome: e.target.value }))}
            placeholder="Seu nome"
            style={fs}
          />
        </Fld>

        <Fld label="WhatsApp *">
          <input
            value={f.telefone}
            onChange={e => setF(x => ({ ...x, telefone: maskPh(e.target.value) }))}
            placeholder="(31) 99999-9999"
            style={fs}
          />
        </Fld>

        <Fld label="Aniversário 🎂 (opcional)">
          <input
            type="date"
            value={f.aniversario}
            onChange={e => setF(x => ({ ...x, aniversario: e.target.value }))}
            style={fs}
          />
        </Fld>

        <Btn
          ch="Criar conta"
          st={{ marginBottom: 8, opacity: ok ? 1 : 0.5 }}
          disabled={!ok}
          onClick={handleSave}
        />
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
          ← Já tenho conta
        </button>
      </div>
    </div>
  );
}