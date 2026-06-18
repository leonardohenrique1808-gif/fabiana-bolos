import React, { useState } from "react";
import { Fld }      from "../components/Fld";
import { Btn, BtnS }from "../components/Btn";
import { maskPh }   from "../utils/helpers";
import { pkL }      from "../utils/constants";

const fs = { width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" };

export function ClientLoginScreen({ clients, onLogin, onRegister, onBack }) {
  const [nome, setNome] = useState("");
  const [tel,  setTel]  = useState("");
  const [err,  setErr]  = useState("");

  const handleLogin = () => {
    // Normaliza dígitos para comparar telefones independente de máscara
    const telDigits = tel.replace(/\D/g, "");
    const c = clients.find(x =>
      x.telefone.replace(/\D/g, "") === telDigits &&
      x.nome.toLowerCase().trim()   === nome.toLowerCase().trim()
    );
    if (c) onLogin(c);
    else setErr("Nome ou WhatsApp incorretos. Verifique seus dados.");
  };

  return (
    <div style={{ background: `linear-gradient(160deg,#FFF0F8,#FDF6FB)`, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, boxShadow: "0 4px 20px rgba(233,30,140,.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>🔐</div>
          <h2 style={{ margin: "6px 0 4px", fontWeight: 900 }}>Entrar</h2>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Use o nome e WhatsApp do cadastro</p>
        </div>

        <Fld label="Nome completo">
          <input
            value={nome}
            onChange={e => { setNome(e.target.value); setErr(""); }}
            placeholder="Seu nome"
            style={fs}
          />
        </Fld>

        <Fld label="WhatsApp">
          <input
            value={tel}
            onChange={e => { setTel(maskPh(e.target.value)); setErr(""); }}
            placeholder="(31) 99999-9999"
            style={fs}
          />
        </Fld>

        {err && <div style={{ color: "#DC2626", fontSize: 13, marginBottom: 10 }}>{err}</div>}

        <Btn ch="Entrar" st={{ marginBottom: 8 }} onClick={handleLogin} />
        <BtnS ch="Criar conta" onClick={onRegister} />
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", marginTop: 12, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}