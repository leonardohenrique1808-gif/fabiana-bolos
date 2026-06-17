import React, { useState } from "react";
import { Btn, BtnS } from "../components/Btn";
import { fmtR } from "../utils/helpers";
import { PIX_KEY, pkD } from "../utils/constants";

export function PedidoDoneScreen({ caucao, wppUrl, onClientArea, onHome, hasClient, total, saldo }) {
  const [copied, setCopied] = useState(false);
  const mensagem = total ? `Olá, seu pedido ficou no valor total de ${fmtR(total)}. Foi pago ${fmtR(caucao)} de entrada. SALDO A COBRAR: ${fmtR(saldo)}.` : "";
  
  return (
    <div style={{ background: "#FDF6FB", minHeight: "100vh", fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ padding: "24px 18px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <h2>Pedido enviado!</h2>
        
        {caucao > 0 && (
          <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: 16, marginBottom: 14, textAlign: "left" }}>
            <div style={{ fontWeight: 900, color: "#15803D" }}>PIX 🟢</div>
            <div>Caução (50%): <strong>{fmtR(caucao)}</strong></div>
            {total && <div>Total: <strong>{fmtR(total)}</strong></div>}
            {saldo > 0 && <div style={{ fontWeight: 900, color: "#B45309", textTransform: "uppercase" }}>💳 SALDO A COBRAR: {fmtR(saldo)}</div>}
            
            <div style={{ background: "#fff", border: "1.5px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 10 }}>
              <span style={{ fontWeight: 700, color: "#333", fontSize: 14 }}>{PIX_KEY}</span>
              <button 
                onClick={() => { navigator.clipboard?.writeText(PIX_KEY); setCopied(true); }} 
                style={{ background: "transparent", border: "1px solid #15803D", color: "#15803D", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}
              >
                {copied ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        )}
        
        {mensagem && <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 12, marginBottom: 14, textAlign: "left", fontWeight: 700, color: "#B45309" }}>{mensagem}</div>}
        
        <a href={wppUrl} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 10, textDecoration: "none" }}>
          <Btn ch="💬 Enviar comprovante no WhatsApp" st={{ background: "#25D366" }} />
        </a>
        
        {hasClient && <Btn ch="Ver meus pedidos" st={{ background: pkD, marginBottom: 8 }} onClick={onClientArea} />}
        
        <BtnS ch="Voltar ao início" onClick={onHome} />
      </div>
    </div>
  );
}