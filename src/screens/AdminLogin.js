// src/screens/AdminLogin.js
import React, { useState, useRef, useEffect } from "react";
import { Fld }         from "../components/Fld";
import { Btn }         from "../components/Btn";
import { PageWrapper } from "../components/PageWrapper";
import { ADMIN_PASS, PIN_MASTER, pkL } from "../utils/constants";

export function AdminLoginScreen({ onLogin, onBack, lockedUntil, lockLeft }) {
  const [pass,    setPass]    = useState("");
  const [pin,     setPin]     = useState("");
  const [err,     setErr]     = useState(false);
  const [showPass,setShowPass]= useState(false);
  const [showPin, setShowPin] = useState(false);
  const passRef = useRef(null);
  const locked  = Date.now() < lockedUntil;

  // Auto-foco no campo de senha ao abrir
  useEffect(() => { if (!locked) passRef.current?.focus(); }, [locked]);

  const tryLogin = () => {
    if (pass === ADMIN_PASS && pin === PIN_MASTER) onLogin();
    else { setErr(true); setPass(""); setPin(""); passRef.current?.focus(); }
  };

  const handleKey = (e) => { if (e.key === "Enter") tryLogin(); };

  return (
    <PageWrapper style={{
      background: `linear-gradient(160deg, ${pkL}, #FDF6FB)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div className="fu" style={{
        background: "#fff",
        borderRadius: 24,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 340,
        boxShadow: "0 8px 32px rgba(233,30,140,.10)",
      }}>
        {/* Ícone + título */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #FFF0F8, #FDF6FB)",
            border: "2px solid #E5D0EE",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 12px",
          }}>🔐</div>
          <h2 style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 20, color: "#333" }}>
            Acesso Admin
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>
            Fabiana Bolos · Área restrita
          </p>
        </div>

        {locked ? (
          /* ── Estado bloqueado ── */
          <div style={{
            textAlign: "center", padding: "20px 16px",
            background: "#FEF2F2", borderRadius: 14,
            border: "1.5px solid #FECACA",
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
            <div style={{ fontWeight: 900, color: "#DC2626", fontSize: 15 }}>
              Acesso Bloqueado
            </div>
            <div style={{
              fontSize: 28, fontWeight: 900, color: "#DC2626",
              margin: "8px 0", fontFamily: "monospace",
            }}>
              {lockLeft}s
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Muitas tentativas incorretas. Aguarde.
            </div>
          </div>
        ) : (
          /* ── Formulário ── */
          <>
            {/* Campo Senha */}
            <div style={{ marginBottom: 12 }}>
              <label className="fld-label">Senha</label>
              <div style={{ position: "relative" }}>
                <input
                  ref={passRef}
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => { setPass(e.target.value); setErr(false); }}
                  onKeyDown={handleKey}
                  placeholder="••••••••"
                  className="input-padrao"
                  style={{ border: `1.5px solid ${err ? "#DC2626" : "#E5D0EE"}`, paddingRight: 40 }}
                />
                <button
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 16,
                    color: "#9CA3AF", padding: 0,
                  }}
                  tabIndex={-1}
                >{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Campo PIN */}
            <div style={{ marginBottom: 14 }}>
              <label className="fld-label">PIN</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={e => { setPin(e.target.value); setErr(false); }}
                  onKeyDown={handleKey}
                  placeholder="••••"
                  className="input-padrao"
                  style={{ border: `1.5px solid ${err ? "#DC2626" : "#E5D0EE"}`, paddingRight: 40 }}
                />
                <button
                  onClick={() => setShowPin(v => !v)}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 16,
                    color: "#9CA3AF", padding: 0,
                  }}
                  tabIndex={-1}
                >{showPin ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Erro */}
            {err && (
              <div style={{
                color: "#DC2626", fontSize: 13,
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: 10, padding: "8px 12px", marginBottom: 14,
              }}>
                ❌ Credenciais incorretas. Tente novamente.
              </div>
            )}

            <Btn
              ch="Acessar Painel →"
              st={{ background: "#E91E8C" }}
              onClick={tryLogin}
            />

            <p style={{ textAlign: "center", fontSize: 11, color: "#C084B4", margin: "10px 0 0" }}>
              Pressione Enter para entrar
            </p>
          </>
        )}

        <button
          onClick={onBack}
          style={{
            width: "100%", background: "none", border: "none",
            color: "#9CA3AF", marginTop: 14, cursor: "pointer",
            fontSize: 13, fontFamily: "'Nunito',sans-serif",
          }}
        >
          ← Voltar ao início
        </button>
      </div>
    </PageWrapper>
  );
}