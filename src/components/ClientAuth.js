// src/components/ClientAuth.js
import React, { useState, useRef, useEffect } from "react";
import { Btn, BtnS }   from "./Btn";
import { san, maskPh } from "../utils/helpers";
import { pk, pkL }     from "../utils/constants";

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
  const [success,     setSuccess]     = useState(false);
  const [touched,     setTouched]     = useState({ nome: false, tel: false });

  const nomeRef = useRef(null);
  useEffect(() => { nomeRef.current?.focus(); }, []);

  const telDigits = tel.replace(/\D/g, "");
  const nomeValid = nome.trim().length >= 2;
  const telValid  = telDigits.length >= 10;
  const ok        = nomeValid && telValid;

  const fieldStyle = (isValid, isTouched) => ({
    width: "100%",
    border: `1.5px solid ${isTouched ? (isValid ? "#15803D" : "#DC2626") : "#E5D0EE"}`,
    borderRadius: 10, padding: "10px 12px",
    fontSize: 14, outline: "none",
    background: "#fff", fontFamily: "'Nunito',sans-serif",
    boxSizing: "border-box",
    transition: "border-color .2s",
  });

  const handleSubmit = () => {
    setTouched({ nome: true, tel: true });
    if (!ok) return;

    if (isLogin) {
      const c = (clients ?? []).find(
        x =>
          x.telefone.replace(/\D/g, "") === telDigits &&
          x.nome.toLowerCase().trim()   === nome.toLowerCase().trim()
      );
      if (c) {
        setSuccess(true);
        setTimeout(() => onLogin(c), 600);
      } else {
        setErr("Nome ou WhatsApp incorretos. Verifique e tente novamente.");
      }
    } else {
      const novo = san({
        id:          Date.now(),
        nome:        nome.trim(),
        telefone:    tel,
        aniversario: aniversario || "",
        historico:   [],
        endereco:    "",
      });
      setSuccess(true);
      setTimeout(() => onSave(novo), 400);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="auth-wrap">
      <div className="auth-card fu">

        {/* Ícone + título */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: isLogin
              ? "linear-gradient(135deg,#FFF0F8,#FDF6FB)"
              : "linear-gradient(135deg,#FCE7F3,#FFF0F8)",
            border: `2px solid ${pkL}`,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 28,
            margin: "0 auto 12px",
          }}>
            {success ? "✅" : (isLogin ? "🔐" : "🌸")}
          </div>
          <h2 style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 20 }}>
            {success
              ? (isLogin ? "Entrando..." : "Conta criada!")
              : (isLogin ? "Entrar" : "Criar Conta")}
          </h2>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            {isLogin
              ? "Use o nome e WhatsApp do cadastro"
              : "Preencha seus dados para fazer pedidos"}
          </p>
        </div>

        {!success && <>
          {/* Nome */}
          <div style={{ marginBottom: 12 }}>
            <label className="fld-label">
              Nome completo{!isLogin ? " *" : ""}
            </label>
            <input
              ref={nomeRef}
              value={nome}
              onChange={e => { setNome(e.target.value); setErr(""); }}
              onBlur={() => setTouched(t => ({ ...t, nome: true }))}
              onKeyDown={handleKey}
              placeholder="Seu nome completo"
              style={fieldStyle(nomeValid, touched.nome)}
            />
            {touched.nome && !nomeValid && (
              <div style={{ fontSize: 11, color: "#DC2626", marginTop: 3 }}>
                Nome deve ter pelo menos 2 caracteres
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <div style={{ marginBottom: 12 }}>
            <label className="fld-label">
              WhatsApp{!isLogin ? " *" : ""}
            </label>
            <input
              value={tel}
              onChange={e => { setTel(maskPh(e.target.value)); setErr(""); }}
              onBlur={() => setTouched(t => ({ ...t, tel: true }))}
              onKeyDown={handleKey}
              placeholder="(31) 99999-9999"
              style={fieldStyle(telValid, touched.tel)}
            />
            {touched.tel && !telValid && (
              <div style={{ fontSize: 11, color: "#DC2626", marginTop: 3 }}>
                Digite um número válido com DDD
              </div>
            )}
          </div>

          {/* Aniversário (só no registro) */}
          {!isLogin && (
            <div style={{ marginBottom: 14 }}>
              <label className="fld-label">
                Aniversário 🎂
                <span style={{ fontWeight: 400, color: "#9CA3AF", marginLeft: 4 }}>
                  (opcional — para receber mimos!)
                </span>
              </label>
              <input
                type="date"
                value={aniversario}
                onChange={e => setAniversario(e.target.value)}
                style={fieldStyle(true, false)}
              />
            </div>
          )}

          {/* Erro */}
          {err && (
            <div style={{
              color: "#DC2626", fontSize: 13,
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, padding: "8px 12px", marginBottom: 12,
            }}>
              ❌ {err}
            </div>
          )}

          {/* Botão principal */}
          <Btn
            ch={isLogin ? "Entrar →" : "Criar conta →"}
            st={{ marginBottom: 8, opacity: ok ? 1 : 0.55 }}
            disabled={!ok}
            onClick={handleSubmit}
          />

          {/* No login: link criar conta */}
          {isLogin && (
            <BtnS
              ch="Não tenho conta — cadastrar"
              st={{ marginBottom: 4 }}
              onClick={onRegister}
            />
          )}
        </>}

        {/* Voltar */}
        <button
          onClick={onBack}
          style={{
            width: "100%", background: "none",
            border: "none", color: "#9CA3AF",
            marginTop: 8, cursor: "pointer",
            fontSize: 13, fontFamily: "'Nunito',sans-serif",
          }}
        >
          ← Voltar ao início
        </button>
      </div>
    </div>
  );
}