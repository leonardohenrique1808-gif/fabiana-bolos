import React, { useState } from "react";
import { Btn, BtnS } from "./Btn";
import { PIN_MASTER } from "../utils/constants";

const fs = { width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" };

export function PinDlg({ msg, onOk, onCancel }) {
  const [v,   setV]   = useState("");
  const [err, setErr] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} className="no-print">
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 300, fontFamily: "'Nunito',sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 32 }}>🔐</div>
          <h3 style={{ margin: "6px 0 4px", fontWeight: 900 }}>Confirmar</h3>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{msg}</p>
        </div>
        <input
          type="password"
          placeholder="PIN"
          value={v}
          onChange={e => { setV(e.target.value); setErr(false); }}
          style={{ ...fs, marginBottom: 6 }}
          autoFocus
        />
        {err && <p style={{ color: "#DC2626", fontSize: 13, margin: "0 0 8px", fontWeight: 600 }}>PIN incorreto</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <BtnS ch="Cancelar" st={{ flex: 1 }} onClick={onCancel} />
          <Btn  ch="OK"       st={{ flex: 1 }} onClick={() => { if (v === PIN_MASTER) onOk(); else setErr(true); }} />
        </div>
      </div>
    </div>
  );
}