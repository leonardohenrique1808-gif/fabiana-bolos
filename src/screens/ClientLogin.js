import React, { useState } from "react";
import { Fld } from "../components/Fld";
import { Btn, BtnS } from "../components/Btn";

export function ClientLoginScreen({ clients, onLogin, onRegister, onBack }) {
  const [f, setF] = useState({ nome: "", telefone: "", aniversario: "" });
  const [err, setErr] = useState("");

  const handleLogin = () => {
    const c = clients.find(x => 
      x.telefone === f.telefone && 
      x.nome.toLowerCase() === f.nome.toLowerCase() &&
      x.aniversario === f.aniversario
    );
    if (c) onLogin(c); else setErr("Dados incorretos ou conta não encontrada.");
  };

  return (
    <div style={{ background: "#FFF9F2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", color: "#4A2C2A" }}>Entrar</h2>
        <Fld label="Nome"><input value={f.nome} onChange={e => setF(x => ({...x, nome: e.target.value}))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #FFC2D1" }} /></Fld>
        <Fld label="WhatsApp"><input value={f.telefone} onChange={e => setF(x => ({...x, telefone: e.target.value}))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #FFC2D1" }} /></Fld>
        <Fld label="Aniversário"><input type="date" value={f.aniversario} onChange={e => setF(x => ({...x, aniversario: e.target.value}))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #FFC2D1" }} /></Fld>
        
        {err && <div style={{ color: "#DC2626", marginBottom: 10, fontSize: 13 }}>{err}</div>}
        
        <Btn ch="Entrar" st={{ marginBottom: 8, background: "#C25975" }} onClick={handleLogin} />
        <BtnS ch="Criar conta" onClick={onRegister} />
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", marginTop: 12, cursor: "pointer" }}>← Voltar</button>
      </div>
    </div>
  );
}