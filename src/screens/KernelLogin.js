import React, { useState } from "react";
import { Btn } from "../components/Btn";
import { DEV_PASS } from "../utils/constants";

export function KernelLoginScreen({ onLogin, onBack, lockedUntil, lockLeft }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const locked = Date.now() < lockedUntil;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Share Tech Mono', monospace" }}>
      <div className="fu" style={{ background: "#111", border: "1px solid #00ff88", borderRadius: 12, padding: 28, width: "100%", maxWidth: 340 }}>
        <div style={{ color: "#00ff88", fontSize: 24, marginBottom: 4, textAlign: "center" }}>▣ KERNEL ACCESS</div>
        <div style={{ color: "#555", fontSize: 11, textAlign: "center", marginBottom: 20 }}>Sistema restrito — nível raiz</div>
        
        {locked ? (
          <div style={{ color: "#ff4444", textAlign: "center", padding: 16 }}>🔒 BLOQUEADO — {lockLeft}s</div>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: "#00ff88", display: "block", marginBottom: 4 }}>SENHA_DEV:</label>
              <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(false); }} style={{ width: "100%", padding: "8px", borderRadius: 6, background: "#111", border: "1px solid #00ff88", color: "#00ff88" }} />
            </div>
            {err && <div style={{ color: "#ff4444", fontSize: 12, marginBottom: 10 }}>❌ Acesso negado</div>}
            <Btn ch="AUTENTICAR →" st={{ background: "transparent", border: "1px solid #00ff88", color: "#00ff88" }} onClick={() => { if (pass === DEV_PASS) onLogin(); else setErr(true); }} />
          </>
        )}
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: "#333", marginTop: 14, cursor: "pointer", fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>← ABORTAR</button>
      </div>
    </div>
  );
}