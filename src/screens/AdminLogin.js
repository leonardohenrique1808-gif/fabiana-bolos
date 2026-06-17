import React, { useState } from "react";
import { Fld } from "../components/Fld";
import { Btn } from "../components/Btn";
import { ADMIN_PASS, PIN_MASTER, pkL } from "../utils/constants";

export function AdminLoginScreen({ onLogin, onBack, lockedUntil, lockLeft }) {
  const [pass, setPass] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const locked = Date.now() < lockedUntil;

  return (
    <div style={{ background: `linear-gradient(160deg, ${pkL}, #FDF6FB)`, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fu" style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 340 }}>
        <h2 style={{ textAlign: "center" }}>🔐 Acesso Admin</h2>
        {locked ? (
          <div style={{ textAlign: "center", padding: 20 }}>🔒 Bloqueado: tente em {lockLeft}s</div>
        ) : (
          <>
            <Fld label="Senha">
              <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(false); }} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
            </Fld>
            <Fld label="PIN">
              <input type="password" value={pin} onChange={e => { setPin(e.target.value); setErr(false); }} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} />
            </Fld>
            {err && <div style={{ color: "#DC2626", marginBottom: 10, fontSize: 13 }}>Credenciais inválidas</div>}
            <Btn ch="Acessar Painel" onClick={() => { if (pass === ADMIN_PASS && pin === PIN_MASTER) onLogin(); else setErr(true); }} />
          </>
        )}
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#9CA3AF", marginTop: 12, cursor: "pointer" }}>← Voltar</button>
      </div>
    </div>
  );
}