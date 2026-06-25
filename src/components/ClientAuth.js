import React, { useState } from "react";
import { Fld }       from "./Fld";
import { Btn, BtnS } from "./Btn";
import { san, maskPh } from "../utils/helpers";

export function ClientAuth({
  mode = "login",
  clients,
  onLogin,
  onRegister,
  onSave,
  onBack,
}) {
  const isLogin = mode === "login";

  const [nome,        setNome]        = useState("");
  const [tel,         setTel]         = useState("");
  const [aniversario, setAniversario] = useState("");
  const [err,         setErr]         = useState("");

  const ok = nome.trim() && tel.trim();

  const handleSubmit = () => {
    if (!ok) return;

    if (isLogin) {
      const telDigits = tel.replace(/\D/g, "");
      const c = (clients ?? []).find(
        x =>
          x.telefone.replace(/\D/g, "") === telDigits &&
          x.nome.toLowerCase().trim()   === nome.toLowerCase().trim()
      );
      if (c) onLogin(c);
      else setErr("Nome ou WhatsApp incorretos. Verifique seus dados.");
    } else {
      const novo = san({
        id:          Date.now(),
        nome:        nome.trim(),
        telefone:    tel,
        aniversario: aniversario || "",
        historico:   [],
        endereco:    "",
      });
      onSave(novo);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card fu">

        {/* Ícone + título */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>{isLogin ? "🔐" : "🌸"}</div>
          <h2 style={{ margin: "6px 0 4px", fontWeight: 900 }}>
            {isLogin ? "Entrar" : "Criar Conta"}
          </h2>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            {isLogin
              ? "Use o nome e WhatsApp do cadastro"
              : "Preencha seus dados para fazer pedidos"}
          </p>
        </div>

        {/* Campos comuns */}
        <Fld label={`Nome completo${isLogin ? "" : " *"}`}>
          <input
            className="input-padrao"
            value={nome}
            onChange={e => { setNome(e.target.value); setErr(""); }}
            placeholder="Seu nome"
          />
        </Fld>

        <Fld label={`WhatsApp${isLogin ? "" : " *"}`}>
          <input
            className="input-padrao"
            value={tel}
            onChange={e => { setTel(maskPh(e.target.value)); setErr(""); }}
            placeholder="(31) 99999-9999"
          />
        </Fld>

        {/* Aniversário — só no registro */}
        {!isLogin && (
          <Fld label="Aniversário 🎂 (opcional)">
            <input
              type="date"
              className="input-padrao"
              value={aniversario}
              onChange={e => setAniversario(e.target.value)}
            />
          </Fld>
        )}

        {/* Erro */}
        {err && (
          <div style={{ color: "#DC2626", fontSize: 13, marginBottom: 10 }}>
            {err}
          </div>
        )}

        {/* Botão principal */}
        <Btn
          ch={isLogin ? "Entrar" : "Criar conta"}
          st={{ marginBottom: 8, opacity: ok ? 1 : 0.5 }}
          disabled={!ok}
          onClick={handleSubmit}
        />

        {/* No login: link para criar conta */}
        {isLogin && (
          <BtnS ch="Criar conta" st={{ marginBottom: 4 }} onClick={onRegister} />
        )}

        {/* Voltar */}
        <button
          onClick={onBack}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            color: "#9CA3AF",
            marginTop: 8,
            cursor: "pointer",
            fontFamily: "'Nunito',sans-serif",
          }}
        >
          {isLogin ? "← Voltar" : "← Já tenho conta"}
        </button>
      </div>
    </div>
  );
}
