import React from "react";
import { Hdr } from "../components/Hdr";
import { Card } from "../components/Card";
import { Btn, BtnS } from "../components/Btn";
import { fmtDt, fmtR, getPrecoItem } from "../utils/helpers";
import { pk, pkL } from "../utils/constants";

export function PedidoConfirm({
  cart, pedInfo, clientUser, cfg, taxaReg,
  cartFinal, cartCaucao, cartSaldo,
  setScreen, setUpsellOpen, TIPOS
}) {
  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      <Hdr title="📋 Confirmar pedido" onBack={() => setScreen("pedido-cart")} />
      
      <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>
        <Card ch={
          <>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{clientUser?.nome || "Cliente"}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
              📅 {fmtDt(pedInfo.entrega)}{pedInfo.hora ? ` às ${pedInfo.hora}` : ""} {pedInfo.regiao ? `· ${pedInfo.regiao.nome}` : ""}
            </div>
            
            {cart.map((it, i) => {
              const p = getPrecoItem(it, cfg?.adicionalGourmet);
              const isU = it.tipo === "upsell";
              const nome = isU ? it.nome : (TIPOS.find(t => t.id === it.tipo)?.nome);
              return (
                <div key={i} style={{ borderTop: `1px solid ${pkL}`, paddingTop: 8, marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}>
                    <span>{nome}</span>
                    <span style={{ color: pk }}>{p != null ? fmtR(p) : "consultar"}</span>
                  </div>
                </div>
              );
            })}
            
            <div style={{ borderTop: `2px solid ${pkL}`, marginTop: 12, paddingTop: 12 }}>
              {taxaReg > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888" }}><span>Taxa</span><span>{fmtR(taxaReg)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 15 }}><span>Total</span><span style={{ color: pk }}>{fmtR(cartFinal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#BE185D", fontWeight: 700 }}><span>Caução (50%)</span><span>{fmtR(cartCaucao)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, color: "#B45309", marginTop: 6, background: "#FFFBEB", padding: "4px 8px", borderRadius: 6 }}><span>💳 SALDO A COBRAR</span><span>{fmtR(cartSaldo)}</span></div>
            </div>
          </>
        } />
        
        <Btn ch="✅ Confirmar pedido" onClick={() => setUpsellOpen(true)} />
        <BtnS ch="← Editar" st={{ marginTop: 8 }} onClick={() => setScreen("pedido-cart")} />
      </div>
    </div>
  );
}