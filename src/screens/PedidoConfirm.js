// src/screens/PedidoConfirm.js
import React from "react";
import { Hdr }         from "../components/Hdr";
import { Card }        from "../components/Card";
import { Btn, BtnS }   from "../components/Btn";
import { PageWrapper } from "../components/PageWrapper";
import { fmtDt, fmtR, getPrecoItem } from "../utils/helpers";
import { pk, pkL } from "../utils/constants";

export function PedidoConfirm({
  cart, pedInfo, clientUser, cfg, taxaReg,
  cartFinal, cartCaucao, cartSaldo,
  setScreen, setUpsellOpen, TIPOS,
}) {
  return (
    <PageWrapper>
      <Hdr title="📋 Confirmar pedido" onBack={() => setScreen("pedido-cart")} />

      <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>

        {/* Info do cliente e entrega */}
        <Card ch={<>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 6 }}>
            {clientUser?.nome || "Cliente"}
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            fontSize: 13, color: "#555", marginBottom: 12,
          }}>
            {pedInfo.entrega && (
              <span>📅 {fmtDt(pedInfo.entrega)}</span>
            )}
            {pedInfo.hora && (
              <span>⏰ {pedInfo.hora}</span>
            )}
            {pedInfo.regiao && (
              <span>· {pedInfo.regiao.nome}</span>
            )}
          </div>

          {pedInfo.enderecoEntrega && (
            <div style={{ fontSize: 13, color: "#6B4C7A", marginBottom: 10 }}>
              📍 {pedInfo.enderecoEntrega}
            </div>
          )}

          {pedInfo.obs && (
            <div style={{
              background: "#FFF9F2", borderRadius: 8,
              padding: "6px 10px", fontSize: 13, color: "#888",
              marginBottom: 8,
            }}>
              📝 {pedInfo.obs}
            </div>
          )}

          {/* Itens */}
          {cart.map((it, i) => {
            const p    = getPrecoItem(it, cfg?.adicionalGourmet);
            const isU  = it.tipo === "upsell";
            const nome = isU ? it.nome : (TIPOS.find(t => t.id === it.tipo)?.nome);
            return (
              <div
                key={i}
                style={{
                  borderTop: `1px solid ${pkL}`, paddingTop: 8, marginTop: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 14, color: "#333" }}>{nome}</span>
                <span style={{ color: pk, fontWeight: 800, fontSize: 14 }}>
                  {p != null ? fmtR(p) : "consultar"}
                </span>
              </div>
            );
          })}

          {/* Totais */}
          <div style={{ borderTop: `2px solid ${pkL}`, marginTop: 14, paddingTop: 12 }}>
            {taxaReg > 0 && (
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, color: "#888", marginBottom: 4,
              }}>
                <span>Taxa de entrega</span>
                <span>{fmtR(taxaReg)}</span>
              </div>
            )}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontWeight: 900, fontSize: 16, marginBottom: 4,
            }}>
              <span>Total</span>
              <span style={{ color: pk }}>{fmtR(cartFinal)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 13, color: "#BE185D", fontWeight: 700,
            }}>
              <span>Caução (50%)</span>
              <span>{fmtR(cartCaucao)}</span>
            </div>
            {cartSaldo > 0 && (
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 14, fontWeight: 900, color: "#B45309",
                marginTop: 8, background: "#FFFBEB",
                padding: "6px 10px", borderRadius: 8,
              }}>
                <span>💳 SALDO A COBRAR</span>
                <span>{fmtR(cartSaldo)}</span>
              </div>
            )}
          </div>
        </>} />

        {/* Info caução */}
        <div style={{
          background: "#F0FDF4", border: "1.5px solid #BBF7D0",
          borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          fontSize: 13, color: "#15803D",
        }}>
          💡 Após confirmar, você receberá os dados de pagamento pelo WhatsApp.
          A caução garante sua data de entrega.
        </div>

        <Btn
          ch="✅ Confirmar pedido"
          onClick={() => setUpsellOpen(true)}
        />
        <BtnS
          ch="← Editar carrinho"
          st={{ marginTop: 8 }}
          onClick={() => setScreen("pedido-cart")}
        />
      </div>
    </PageWrapper>
  );
}