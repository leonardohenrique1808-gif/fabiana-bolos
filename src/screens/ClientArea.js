import React from "react";
import { Badge }     from "../components/Badge";
import { StatusBar } from "../components/StatusBar";
import { Btn }       from "../components/Btn";
import { fmtR, fmtDt, isSinalPago, calcPontos, san } from "../utils/helpers";
import { pk, pkL, pkD } from "../utils/constants";

export function ClientArea({ clientUser, orders, tipos, cfg, maintenanceMode, onNovoPedido, onLogout, onBack }) {
  const TIPOS = tipos ?? [];
  const meus  = orders
    .filter(o => o.clienteId === clientUser.id)
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  const pontos = calcPontos(clientUser.id, orders);

  const repetirPedido = (order) => {
    // Navega para pedido-info; o App.js pode estender para pré-carregar o carrinho
    if (order?.itens) onNovoPedido(san(order.itens));
    else onNovoPedido();
  };

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      {/* Header colorido */}
      <div style={{ background: `linear-gradient(135deg,${pk},${pkD})`, padding: "20px 18px 32px" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,.2)", border: "none", color: "#fff", borderRadius: 8, padding: "4px 10px", fontWeight: 700, marginBottom: 12, cursor: "pointer" }}>
          ← Voltar
        </button>
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 12, opacity: .8 }}>Bem-vinda! 🌸</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>{clientUser.nome}</div>
          <div style={{ fontSize: 13, opacity: .8 }}>{clientUser.telefone}</div>
          {clientUser.aniversario && <div style={{ fontSize: 12, opacity: .7 }}>🎂 {fmtDt(clientUser.aniversario)}</div>}
          <div style={{ fontSize: 12, marginTop: 4, opacity: .85 }}>⭐ {pontos} pontos</div>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 500, margin: "0 auto", marginTop: -16 }}>
        <Btn
          ch="🎂 Novo pedido"
          st={{ marginBottom: 16 }}
          disabled={maintenanceMode}
          onClick={() => !maintenanceMode && onNovoPedido()}
        />

        <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>Meus pedidos ({meus.length})</h3>

        {meus.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#C084B4" }}>
            <div style={{ fontSize: 36 }}>📦</div>
            <p>Nenhum pedido ainda.</p>
          </div>
        ) : meus.map(o => {
          const saldo = (o.valor || 0) - (o.caucao || 0);
          return (
            <div key={o.id} className="hov" style={{ background: "#fff", border: `1px solid ${pkL}`, borderLeft: `4px solid ${pk}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: "#888" }}>📅 {fmtDt(o.entrega)}</div>
                <Badge s={o.status} />
              </div>
              <StatusBar status={o.status} />
              {(o.itens ?? []).slice(0, 2).map((it, i) => {
                const nm = it.tipo === "upsell" ? it.nome : (TIPOS.find(t => t.id === it.tipo)?.nome ?? it.tipo);
                return <div key={i} style={{ fontSize: 13, color: "#444", marginTop: 4 }}>🎂 {nm}</div>;
              })}
              <div style={{ marginTop: 6, fontWeight: 800, color: pk }}>{o.valor ? fmtR(o.valor) : "Sob consulta"}</div>
              {saldo > 0 && isSinalPago(o.status) && (
                <div style={{ fontSize: 12, color: "#B45309", fontWeight: 700 }}>💳 SALDO: {fmtR(saldo)}</div>
              )}
              <button onClick={() => repetirPedido(o)} style={{ background: pkL, color: pk, border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, marginTop: 8, cursor: "pointer" }}>
                🔄 Repetir pedido
              </button>
            </div>
          );
        })}

        <button
          onClick={onLogout}
          style={{ width: "100%", background: "none", border: "1.5px solid #E5D0EE", borderRadius: 12, padding: 11, fontWeight: 700, color: "#9CA3AF", marginTop: 8, cursor: "pointer" }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}