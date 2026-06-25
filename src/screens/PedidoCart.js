// src/screens/PedidoCart.js
import React from "react";
import { Hdr }         from "../components/Hdr";
import { Btn }         from "../components/Btn";
import { ItemBuilder } from "../components/ItemBuilder";
import { PageWrapper } from "../components/PageWrapper";
import { san, fmtR, getPrecoItem } from "../utils/helpers";
import { pk, pkL } from "../utils/constants";

export function PedidoCart({
  cart, setCart, setScreen,
  editIdx, setEditIdx,
  addingIt, setAddingIt,
  taxaReg, cartFinal, cartCaucao, cartSaldo,
  cfg, TIPOS,
}) {
  return (
    <PageWrapper>
      <Hdr
        title="🛒 Carrinho"
        onBack={() => setScreen("pedido-info")}
        right={
          cart.length > 0
            ? (
              <span style={{
                background: pk, color: "#fff",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 13, fontWeight: 800,
              }}>
                {cart.length}
              </span>
            )
            : null
        }
      />

      <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>

        {/* Estado vazio */}
        {cart.length === 0 && !addingIt && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#333", marginBottom: 6 }}>
              Carrinho vazio
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
              Adicione itens para fazer seu pedido
            </div>
            <Btn ch="← Voltar" st={{ maxWidth: 200, margin: "0 auto" }} onClick={() => setScreen("pedido-info")} />
          </div>
        )}

        {/* Itens do carrinho */}
        {cart.map((it, idx) => {
          const preco = getPrecoItem(it, cfg?.adicionalGourmet);
          const isU   = it.tipo === "upsell";
          const prod  = TIPOS ? TIPOS.find(t => t.id === it.tipo) : null;
          const nome  = isU ? it.nome : (prod?.nome || "Item");

          return editIdx === idx ? (
            <div key={idx} className="fu">
              <ItemBuilder
                init={it}
                isEdit
                gAdic={cfg?.adicionalGourmet}
                tipos={TIPOS}
                onSave={u => { setCart(p => san(p.map((x, i) => i === idx ? u : x))); setEditIdx(null); }}
                onCancel={() => setEditIdx(null)}
              />
            </div>
          ) : (
            <div
              key={idx}
              className="hov fu"
              style={{
                background: "#fff",
                border: `1px solid ${pkL}`,
                borderLeft: `4px solid ${pk}`,
                borderRadius: 14, padding: 14, marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  {prod?.fotoUrl && !isU && (
                    <img
                      src={prod.fotoUrl}
                      style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 8, marginBottom: 6 }}
                      onError={e => { e.target.style.display = "none"; }}
                      alt=""
                    />
                  )}
                  <div style={{ fontWeight: 800, fontSize: 14, color: pk }}>{nome}</div>
                  {!isU && (
                    <div>
                      {[
                        it.fatias ? `${it.fatias}fx (${it.formato})` : null,
                        it.massa && it.tipo !== "docinhos" && it.tipo !== "bento" ? it.massa : null,
                        it.recheio1 || null,
                        it.recheio2 || null,
                      ].filter(Boolean).map((x, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#888" }}>{x}</div>
                      ))}
                    </div>
                  )}
                  {preco != null && (
                    <div style={{ fontSize: 14, fontWeight: 800, color: pk, marginTop: 6 }}>
                      {fmtR(preco)}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  {!isU && (
                    <button
                      onClick={() => setEditIdx(idx)}
                      style={{
                        background: pkL, color: pk, border: "none",
                        borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                      }}
                    >✏️</button>
                  )}
                  <button
                    onClick={() => setCart(p => p.filter((_, i) => i !== idx))}
                    style={{
                      background: "#FEF2F2", color: "#DC2626", border: "none",
                      borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                    }}
                  >🗑</button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Adicionar novo item */}
        {addingIt && editIdx === null ? (
          <div className="fu">
            <ItemBuilder
              gAdic={cfg?.adicionalGourmet}
              tipos={TIPOS}
              onSave={it => { setCart(p => san([...p, it])); setAddingIt(false); }}
              onCancel={() => setAddingIt(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setAddingIt(true)}
            style={{
              width: "100%", border: `2px dashed ${pk}`,
              borderRadius: 14, padding: 14, background: "none",
              color: pk, fontSize: 14, fontWeight: 800,
              marginBottom: 14, cursor: "pointer",
              transition: "background .15s",
            }}
          >
            + Adicionar item
          </button>
        )}

        {/* Resumo + botão confirmar */}
        {cart.length > 0 && editIdx === null && !addingIt && (
          <>
            <div style={{
              background: "#fff", border: `2px solid ${pkL}`,
              borderRadius: 14, padding: 14, marginBottom: 14,
            }}>
              {taxaReg > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 4 }}>
                  <span>Taxa de entrega</span>
                  <span>{fmtR(taxaReg)}</span>
                </div>
              )}
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 16, fontWeight: 900, marginBottom: 4,
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
            <Btn ch="Ver sugestões e confirmar →" onClick={() => setScreen("pedido-confirm")} />
          </>
        )}
      </div>
    </PageWrapper>
  );
}