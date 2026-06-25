// src/screens/ClientArea.js
import React, { useState } from "react";
import { Badge }     from "../components/Badge";
import { StatusBar } from "../components/StatusBar";
import { Btn }       from "../components/Btn";
import { PageWrapper } from "../components/PageWrapper";
import { fmtR, fmtDt, isSinalPago, calcPontos, san } from "../utils/helpers";
import { pk, pkL, pkD } from "../utils/constants";

export function ClientArea({
  clientUser, orders, tipos, cfg,
  maintenanceMode, onNovoPedido, onLogout, onBack,
}) {
  const TIPOS  = tipos ?? [];
  const meus   = orders
    .filter(o => o.clienteId === clientUser.id)
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  const pontos = calcPontos(clientUser.id, orders);

  // Pedido mais recente com status aberto
  const pedidoAtivo = meus.find(o =>
    !["Finalizado", "Cancelado"].includes(o.status)
  );

  const [expandido, setExpandido] = useState(null);

  const repetirPedido = (order) => {
    if (order?.itens) onNovoPedido(san(order.itens));
    else onNovoPedido();
  };

  return (
    <PageWrapper style={{ background: "#FDF6FB" }}>

      {/* ── Header gradiente ───────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${pk}, ${pkD})`,
        padding: "20px 18px 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decoração de fundo */}
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,.05)",
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20,
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,.05)",
        }} />

        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,.2)", border: "none",
            color: "#fff", borderRadius: 8,
            padding: "5px 12px", fontWeight: 700, marginBottom: 14,
            cursor: "pointer", fontSize: 13,
          }}
        >
          ← Voltar
        </button>

        <div style={{ color: "#fff", position: "relative" }}>
          <div style={{ fontSize: 12, opacity: .8 }}>Bem-vinda de volta! 🌸</div>
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 22, fontWeight: 700, marginTop: 2,
          }}>
            {clientUser.nome}
          </div>
          <div style={{ fontSize: 13, opacity: .8, marginTop: 2 }}>
            {clientUser.telefone}
          </div>
          {clientUser.aniversario && (
            <div style={{ fontSize: 12, opacity: .7, marginTop: 2 }}>
              🎂 {fmtDt(clientUser.aniversario)}
            </div>
          )}
        </div>

        {/* Cartão de pontos */}
        <div style={{
          background: "rgba(255,255,255,.15)",
          borderRadius: 14, padding: "10px 14px", marginTop: 12,
          backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 11 }}>Seus pontos</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>
              ⭐ {pontos.toLocaleString("pt-BR")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 10 }}>
              {meus.filter(o => o.status !== "Cancelado").length} pedido{meus.length !== 1 ? "s" : ""}
            </div>
            <div style={{ color: "rgba(255,255,255,.5)", fontSize: 9, marginTop: 2 }}>
              1 ponto = R$ 1 gasto
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo (card flutuante sobre o header) ──────── */}
      <div style={{ padding: "0 16px 24px", marginTop: -16, maxWidth: 500, margin: "-16px auto 0" }}>

        {/* Alerta manutenção */}
        {maintenanceMode && (
          <div style={{
            background: "#FFF7ED", border: "1px solid #FED7AA",
            borderRadius: 12, padding: "10px 14px", marginBottom: 12,
            fontSize: 13, color: "#92400E", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            🔧 Pedidos temporariamente suspensos
          </div>
        )}

        {/* Botão novo pedido */}
        <Btn
          ch={maintenanceMode ? "🔧 Loja em manutenção" : "🎂 Fazer novo pedido"}
          st={{ marginBottom: 14, marginTop: 16, opacity: maintenanceMode ? 0.6 : 1 }}
          disabled={maintenanceMode}
          onClick={() => !maintenanceMode && onNovoPedido()}
        />

        {/* Pedido ativo em destaque */}
        {pedidoAtivo && (
          <div style={{
            background: "#fff", border: `2px solid ${pk}`,
            borderRadius: 16, padding: 14, marginBottom: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: pk }}>🔥 Pedido em andamento</span>
              <Badge s={pedidoAtivo.status} />
            </div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
              📅 Entrega: <strong>{fmtDt(pedidoAtivo.entrega)}</strong>
            </div>
            <StatusBar status={pedidoAtivo.status} />
          </div>
        )}

        {/* Lista de pedidos */}
        <h3 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px" }}>
          Histórico de pedidos
          <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>
            ({meus.length})
          </span>
        </h3>

        {meus.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#C084B4" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>📦</div>
            <div style={{ fontWeight: 700 }}>Nenhum pedido ainda</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
              Seu primeiro pedido aparecerá aqui
            </div>
          </div>
        ) : (
          meus.map(o => {
            const saldo     = (o.valor || 0) - (o.caucao || 0);
            const isAberto  = expandido === o.id;
            return (
              <div
                key={o.id}
                style={{
                  background: "#fff", border: `1px solid ${pkL}`,
                  borderLeft: `4px solid ${pk}`,
                  borderRadius: 14, padding: 14, marginBottom: 10,
                  transition: "box-shadow .2s",
                }}
              >
                {/* Cabeçalho */}
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }}
                  onClick={() => setExpandido(isAberto ? null : o.id)}
                >
                  <div>
                    <div style={{ fontSize: 13, color: "#888" }}>📅 {fmtDt(o.entrega)}</div>
                    <div style={{ fontWeight: 800, color: pk, fontSize: 14, marginTop: 2 }}>
                      {o.valor ? fmtR(o.valor) : "Sob consulta"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <Badge s={o.status} />
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {isAberto ? "▲ Fechar" : "▼ Detalhes"}
                    </span>
                  </div>
                </div>

                <StatusBar status={o.status} />

                {/* Itens (resumo) */}
                {(o.itens ?? []).slice(0, 2).map((it, i) => {
                  const nm = it.tipo === "upsell"
                    ? it.nome
                    : (TIPOS.find(t => t.id === it.tipo)?.nome ?? it.tipo);
                  return (
                    <div key={i} style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
                      🎂 {nm}
                    </div>
                  );
                })}
                {(o.itens ?? []).length > 2 && (
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>
                    + {(o.itens ?? []).length - 2} item(s)
                  </div>
                )}

                {/* Saldo */}
                {saldo > 0 && isSinalPago(o.status) && (
                  <div style={{
                    fontSize: 12, color: "#B45309", fontWeight: 700,
                    background: "#FFFBEB", borderRadius: 6,
                    padding: "4px 8px", marginTop: 6, display: "inline-block",
                  }}>
                    💳 SALDO: {fmtR(saldo)}
                  </div>
                )}

                {/* Expansível: todos os itens + ações */}
                {isAberto && (
                  <div className="fu" style={{ marginTop: 10, borderTop: `1px solid ${pkL}`, paddingTop: 10 }}>
                    {(o.itens ?? []).map((it, i) => {
                      const nm = it.tipo === "upsell"
                        ? it.nome
                        : (TIPOS.find(t => t.id === it.tipo)?.nome ?? it.tipo);
                      return (
                        <div key={i} style={{
                          background: "#FDF6FB", borderRadius: 8,
                          padding: "6px 10px", marginBottom: 4, fontSize: 13,
                        }}>
                          {nm}
                        </div>
                      );
                    })}
                    <button
                      onClick={() => repetirPedido(o)}
                      style={{
                        background: pkL, color: pk, border: `1px solid ${pkL}`,
                        borderRadius: 8, padding: "6px 14px",
                        fontSize: 12, fontWeight: 700,
                        marginTop: 8, cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      🔄 Repetir este pedido
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: "100%", background: "none",
            border: "1.5px solid #E5D0EE", borderRadius: 12,
            padding: 11, fontWeight: 700, color: "#9CA3AF",
            marginTop: 8, cursor: "pointer",
            transition: "border-color .15s",
          }}
        >
          Sair da conta
        </button>
      </div>
    </PageWrapper>
  );
}