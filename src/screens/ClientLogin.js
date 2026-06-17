import React, { useState } from "react";
import { Fld } from "../components/Fld";
import { Btn, BtnS } from "../components/Btn";
import { maskPh } from "../utils/helpers";
import { pkL } from "../utils/constants";

export function ClientLoginScreen({ clients, onLogin, onRegister, onBack }) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [err, setErr] = useState("");

  return (
    <div style={{ background: `linear-gradient(160deg, ${pkL}, #FDF6FB)`, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fu" style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Entrar</h2>
        <Fld label="Nome">
          <input value={nome} onChange={e => { setNome(e.target.value); setErr(""); }} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
        </Fld>
        <Fld label="WhatsApp">
          <input value={tel} onChange={e => { setTel(maskPh(e.target.value)); setErr(""); }} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
        </Fld>
        
        {err && <div style={{ color: "#DC2626", marginBottom: 10, fontSize: 13 }}>{err}</div>}
        
        <Btn ch="Entrar" st={{ marginBottom: 8 }} onClick={() => {
          const c = clients.find(x => x.telefone.replace(/\D/g, "") === tel.replace(/\D/g, "") && x.nome.toLowerCase().trim() === nome.toLowerCase().trim());
          if (c) onLogin(c); else setErr("Dados não encontrados.");
        }} />
        <BtnS ch="Criar conta" onClick={onRegister} />
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", marginTop: 12, cursor: "pointer" }}>← Voltar</button>
      </div>
    </div>
  );
}