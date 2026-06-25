// src/screens/AdminPanel.js
import React, { useState } from "react";
import { Hdr }          from "../components/Hdr";
import { Card }         from "../components/Card";
import { Fld }          from "../components/Fld";
import { Btn, BtnS }    from "../components/Btn";
import { Badge }        from "../components/Badge";
import { StatusBar }    from "../components/StatusBar";
import { ConfigsPanel } from "../components/ConfigsPanel";
import { PageWrapper }  from "../components/PageWrapper";
import { fmtDt, fmtR, isSinalPago, san, getPrecoItem, today } from "../utils/helpers";
import { STATUS_UNICO, STATUS_META, pk, pkL, WHATSAPP } from "../utils/constants";

export function AdminPanel({
  orders, setOrders, updateOrd, removeOrd,
  cfg, setCfg, tipos, setTipos, TIPOS,
  clients, maintenanceMode, setMaintenanceMode,
  setPinDlg, setLabelOrd, onBack,
}) {
  const [selOrdId,  setSelOrdId]  = useState(null);
  const [adminTab,  setAdminTab]  = useState("hoje");
  const [adminSrch, setAdminSrch] = useState("");
  const [adminFlt,  setAdminFlt]  = useState("todos");
  const [showClts,  setShowClts]  = useState(false);

  const hoy    = today();
  const selOrd = orders.find(o => o.id === selOrdId);

  /* ── Listas ───────────────────────────────────────────────────── */
  const todayOrds = orders
    .filter(o => o.entrega === hoy)
    .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));

  const urgentes = orders.filter(
    o => o.entrega <= hoy && o.status !== "Finalizado" && o.status !== "Cancelado"
  ).length;

  const semOrds = orders.filter(o => {
    const d = new Date(o.entrega), n = new Date(); n.setHours(0,0,0,0);
    const f = new Date(n); f.setDate(f.getDate() + 7);
    return d >= n && d <= f && o.status !== "Cancelado";
  });

  /* ── Stats mês ─────────────────────────────────────────────────── */
  const now      = new Date();
  const ordsMes  = orders.filter(o => {
    const d = new Date(o.entrega);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      && o.status !== "Cancelado" && o.status !== "Aguardando Caução";
  });
  const totalMes = ordsMes.reduce((s, o) => s + Number(o.valor || 0), 0);
  const totalFin = orders.filter(o => {
    const d = new Date(o.entrega);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      && o.status === "Finalizado";
  }).reduce((s, o) => s + Number(o.valor || 0), 0);

  /* ── Filtros (aba Todos) ─────────────────────────────────────── */
  const allFilt = orders.filter(o => {
    const ms = !adminSrch
      || o.nome?.toLowerCase().includes(adminSrch.toLowerCase())
      || o.telefone?.includes(adminSrch);
    const mf = adminFlt === "todos" || o.status === adminFlt;
    return ms && mf;
  }).sort((a, b) => new Date(a.entrega) - new Date(b.entrega));

  const byDate   = {};
  allFilt.forEach(o => { if (!byDate[o.entrega]) byDate[o.entrega] = []; byDate[o.entrega].push(o); });
  const sortDates = Object.keys(byDate).sort();

  /* ── Aniversariantes ──────────────────────────────────────────── */
  const mesMes          = now.getMonth() + 1;
  const aniversariantes = clients.filter(c =>
    c.aniversario && Number(c.aniversario.split("-")[1]) === mesMes
  );

  /* ═══════════════════════════════════════════════════════════════
     DETALHE DO PEDIDO
  ════════════════════════════════════════════════════════════════ */
  if (selOrd) {
    const isEntrega  = !selOrd.regiao?.isRetirada;
    const saldoAdmin = (selOrd.valor || 0) - (selOrd.caucao || 0);
    const urlMaps    = selOrd.endereco
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selOrd.endereco)}`
      : null;

    return (
      <PageWrapper>
        <Hdr title="Detalhes do Pedido" onBack={() => setSelOrdId(null)} />
        <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>

          {/* Info principal */}
          <Card ch={<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17, color: "#1A1A1A" }}>{selOrd.nome}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{selOrd.telefone}</div>
              </div>
              <Badge s={selOrd.status} />
            </div>

            {selOrd.endereco && (
              <div style={{ fontSize: 12, color: "#6B4C7A", marginTop: 6, fontStyle: "italic" }}>
                📍 {selOrd.endereco}
              </div>
            )}

            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 8, fontSize: 13, color: "#555",
            }}>
              <span>📅 {fmtDt(selOrd.entrega)}</span>
              {selOrd.hora && <span>⏰ {selOrd.hora}</span>}
              {selOrd.regiao?.nome && <span>· {selOrd.regiao.nome}</span>}
            </div>

            <StatusBar status={selOrd.status} />

            {/* Itens do pedido */}
            {(selOrd.itens ?? []).length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Itens
                </div>
                {(selOrd.itens ?? []).map((it, i) => {
                  const p   = getPrecoItem(it, cfg?.adicionalGourmet);
                  const isU = it.tipo === "upsell";
                  const nm  = isU ? it.nome : (TIPOS.find(t => t.id === it.tipo)?.nome ?? it.tipo);
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      background: "#FDF6FB", borderRadius: 10,
                      padding: "8px 12px", marginBottom: 6,
                    }}>
                      <span style={{ fontWeight: 700, color: pk, fontSize: 14 }}>{nm}</span>
                      {p != null && <span style={{ fontWeight: 800, fontSize: 13 }}>{fmtR(p)}</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Totais */}
            <div style={{
              borderTop: `2px solid ${pkL}`, paddingTop: 10, marginTop: 8,
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 15 }}>
                <span>Total</span>
                <span style={{ color: pk }}>{selOrd.valor ? fmtR(selOrd.valor) : "Sob consulta"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#BE185D" }}>
                <span>Caução paga</span>
                <span style={{ fontWeight: 700 }}>{selOrd.caucao ? fmtR(selOrd.caucao) : "—"}</span>
              </div>
              {saldoAdmin > 0 && isSinalPago(selOrd.status) && (
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontWeight: 900, fontSize: 14, color: "#B45309",
                  background: "#FFFBEB", padding: "6px 10px", borderRadius: 8, marginTop: 4,
                }}>
                  <span>💳 SALDO</span><span>{fmtR(saldoAdmin)}</span>
                </div>
              )}
              {selOrd.checksum && (
                <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "monospace", marginTop: 4 }}>
                  🔒 {selOrd.checksum}
                </div>
              )}
            </div>
          </>} />

          {/* Frete manual (entrega) */}
          {isEntrega && (
            <Card ch={<>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>🚚 Frete Manual</div>
              <Fld label="Valor do frete (R$)">
                <input
                  type="number" min="0" step="0.50"
                  value={selOrd.freteManual || 0}
                  onChange={e => updateOrd(selOrd.id, { freteManual: Number(e.target.value) })}
                  style={{ width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff" }}
                />
              </Fld>
            </>} />
          )}

          {/* Atualizar status */}
          <Card ch={<>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>
              Atualizar Status:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {STATUS_UNICO.map(st => (
                <button
                  key={st}
                  style={{
                    background: selOrd.status === st ? pk : "#F3E6F0",
                    color: selOrd.status === st ? "#fff" : "#6B4C7A",
                    border: selOrd.status === st ? `1.5px solid ${pk}` : "1.5px solid #E5D0EE",
                    borderRadius: 20, padding: "6px 12px",
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onClick={() => updateOrd(selOrd.id, { status: st })}
                >
                  {STATUS_META[st]?.em} {st}
                </button>
              ))}
            </div>
          </>} />

          {/* Ações */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {isEntrega && urlMaps && (
              <a href={urlMaps} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button style={{ width:"100%",background:"#EFF6FF",color:"#1D4ED8",border:"1.5px solid #BFDBFE",borderRadius:12,padding:11,fontWeight:700,cursor:"pointer" }}>
                  📍 Ver rota no Google Maps
                </button>
              </a>
            )}

            {saldoAdmin > 0 && isSinalPago(selOrd.status) && selOrd.telefone && (
              <a
                href={`https://wa.me/${selOrd.telefone.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá ${selOrd.nome}! Seu saldo restante é ${fmtR(saldoAdmin)}. 😊`)}`}
                target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}
              >
                <button style={{ width:"100%",background:"#FFF7ED",color:"#B45309",border:"1.5px solid #FDE68A",borderRadius:12,padding:11,fontWeight:700,cursor:"pointer" }}>
                  💳 Cobrar saldo ({fmtR(saldoAdmin)})
                </button>
              </a>
            )}

            <button
              onClick={() => setLabelOrd(san(selOrd))}
              style={{ width:"100%",background:"#EFF6FF",color:"#1D4ED8",border:"1.5px solid #BFDBFE",borderRadius:12,padding:11,fontWeight:700,cursor:"pointer" }}
            >
              🏷️ Etiqueta / Recibo
            </button>

            <button
              onClick={() => setPinDlg({ msg:"Excluir este pedido?", onOk: () => { removeOrd(selOrd.id); setSelOrdId(null); } })}
              style={{ width:"100%",background:"#FEF2F2",color:"#DC2626",border:"1.5px solid #FECACA",borderRadius:12,padding:12,fontWeight:700,cursor:"pointer" }}
            >
              🗑 Excluir pedido
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     LISTA DE CLIENTES
  ════════════════════════════════════════════════════════════════ */
  if (showClts) return (
    <PageWrapper>
      <Hdr title="👥 Clientes" onBack={() => setShowClts(false)} />
      <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
        {clients.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#C084B4" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <div style={{ fontWeight: 700 }}>Nenhum cliente cadastrado</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
              Os clientes aparecerão aqui após o primeiro cadastro
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 700 }}>
              {clients.length} cliente{clients.length !== 1 ? "s" : ""} cadastrado{clients.length !== 1 ? "s" : ""}
            </div>
            {clients.map(c => (
              <div key={c.id} className="hov" style={{
                background: "#fff", border: `1px solid ${pkL}`,
                borderLeft: `4px solid ${pk}`,
                borderRadius: 14, padding: 14, marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 900, color: "#1A1A1A" }}>{c.nome}</div>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{c.telefone}</div>
                    {c.aniversario && (
                      <div style={{ fontSize: 12, color: "#C084B4", marginTop: 3 }}>
                        🎂 {fmtDt(c.aniversario)}
                      </div>
                    )}
                  </div>
                  {c.telefone && (
                    <a
                      href={`https://wa.me/${c.telefone.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá ${c.nome?.split(" ")[0]}! 🌸`)}`}
                      target="_blank" rel="noreferrer"
                    >
                      <button style={{ background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer" }}>
                        💬
                      </button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </PageWrapper>
  );

  /* ═══════════════════════════════════════════════════════════════
     PAINEL PRINCIPAL
  ════════════════════════════════════════════════════════════════ */
  return (
    <PageWrapper>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: `2px solid ${pkL}`,
        padding: "12px 16px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: pk }}
          >←</button>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: pk }}>
            PCP Gerência
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {urgentes > 0 && (
            <span style={{
              background: "#DC2626", color: "#fff", borderRadius: 20,
              padding: "2px 8px", fontSize: 11, fontWeight: 700,
              animation: "pulse .5s ease infinite",
            }}>
              ⚠ {urgentes}
            </span>
          )}
          <button
            onClick={() => setShowClts(true)}
            style={{ background: pkL, color: pk, border: "none", borderRadius: 20, padding: "4px 12px", fontWeight: 700, cursor: "pointer" }}
          >
            👥 {clients.length}
          </button>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: "flex", overflowX: "auto", background: "#fff", borderBottom: `2px solid ${pkL}` }}>
        {[
          ["hoje",   "📅 Agenda"],
          ["caucao", "💰 Caução"],
          ["todos",  "📋 Todos"],
          ["stats",  "📊 Stats"],
          ["mkt",    "🎂 CRM"],
          ["configs","⚙️ Config"],
        ].map(([v, l]) => (
          <button
            key={v}
            style={{
              flexShrink: 0, padding: "11px 12px", border: "none", background: "none",
              fontSize: 11, fontWeight: 700,
              color: adminTab === v ? pk : "#9CA3AF",
              borderBottom: adminTab === v ? `3px solid ${pk}` : "3px solid transparent",
              cursor: "pointer", transition: "color .15s",
            }}
            onClick={() => setAdminTab(v)}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>

        {/* ── HOJE ───────────────────────────────────────── */}
        {adminTab === "hoje" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Hoje · {fmtDt(hoy)}</h3>
            <span style={{ fontSize: 12, color: "#888" }}>
              {todayOrds.length} entrega{todayOrds.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Resumo rápido do dia */}
          {todayOrds.length > 0 && (
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 8, marginBottom: 14,
            }}>
              {[
                { l: "Total hoje", v: fmtR(todayOrds.filter(o=>o.status!=="Cancelado").reduce((s,o)=>s+Number(o.valor||0),0)), c: pk },
                { l: "Confirmados", v: todayOrds.filter(o=>["Confirmado","Em Produção","Pronto para Entrega/Retirada"].includes(o.status)).length, c: "#15803D" },
              ].map((x, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 12, padding: "10px 14px",
                  borderLeft: `3px solid ${x.c}`,
                }}>
                  <div style={{ fontSize: 11, color: "#888" }}>{x.l}</div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: x.c, marginTop: 2 }}>{x.v}</div>
                </div>
              ))}
            </div>
          )}

          {todayOrds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#C084B4" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📭</div>
              <div style={{ fontWeight: 700 }}>Sem entregas hoje</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                Aproveite para organizar os pedidos futuros
              </div>
            </div>
          ) : (
            todayOrds.map(o => (
              <div
                key={o.id}
                className="hov"
                style={{
                  background: "#fff", border: `1px solid ${pkL}`,
                  borderLeft: `4px solid ${STATUS_META[o.status]?.brd || pk}`,
                  borderRadius: 14, padding: 14, marginBottom: 8, cursor: "pointer",
                }}
                onClick={() => setSelOrdId(o.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{o.nome}</div>
                    {o.hora && (
                      <div style={{ fontSize: 12, color: "#888" }}>⏰ {o.hora}</div>
                    )}
                    {o.regiao?.nome && (
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                        {o.regiao.isRetirada ? "🏪" : "🚚"} {o.regiao.nome}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <Badge s={o.status} />
                    {o.valor && (
                      <span style={{ fontSize: 12, fontWeight: 800, color: pk }}>
                        {fmtR(o.valor)}
                      </span>
                    )}
                  </div>
                </div>
                <StatusBar status={o.status} />
              </div>
            ))
          )}
        </>}

        {/* ── CAUÇÃO ──────────────────────────────────────── */}
        {adminTab === "caucao" && <>
          <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 14 }}>
            💰 Aguardando Caução
          </h3>
          {orders.filter(o => o.status === "Aguardando Caução").length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
              <div style={{ fontWeight: 700, color: "#15803D" }}>Tudo em dia!</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                Nenhum pedido aguardando pagamento
              </div>
            </div>
          ) : (
            orders.filter(o => o.status === "Aguardando Caução").map(o => (
              <Card key={o.id} ch={<>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{o.nome}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>
                      📅 {fmtDt(o.entrega)} · {o.valor ? fmtR(o.valor) : "?"}
                    </div>
                  </div>
                  {o.caucao && (
                    <div style={{ fontSize: 12, color: "#B45309", fontWeight: 700 }}>
                      Caução: {fmtR(o.caucao)}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <BtnS ch="Ver detalhes" st={{ flex: 1 }} onClick={() => setSelOrdId(o.id)} />
                  <Btn
                    ch="✅ Confirmar"
                    st={{ flex: 1, background: "#15803D" }}
                    onClick={() => updateOrd(o.id, { status: "Confirmado" })}
                  />
                </div>
              </>} />
            ))
          )}
        </>}

        {/* ── TODOS ───────────────────────────────────────── */}
        {adminTab === "todos" && <>
          <input
            value={adminSrch}
            onChange={e => setAdminSrch(e.target.value)}
            placeholder="🔍 Buscar por nome ou telefone..."
            style={{
              width: "100%", border: "1px solid #E5D0EE", borderRadius: 10,
              padding: "10px 12px", fontSize: 14, outline: "none",
              marginBottom: 10, boxSizing: "border-box",
              fontFamily: "'Nunito',sans-serif",
            }}
          />
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
            {["todos", ...STATUS_UNICO].map(st => (
              <button
                key={st}
                style={{
                  background: adminFlt === st ? pk : "#fff",
                  color: adminFlt === st ? "#fff" : "#6B4C7A",
                  border: `1.5px solid ${adminFlt === st ? pk : "#E5D0EE"}`,
                  borderRadius: 20, padding: "5px 12px",
                  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer",
                  transition: "all .15s",
                }}
                onClick={() => setAdminFlt(st)}
              >
                {st === "todos" ? "Todos" : (STATUS_META[st]?.em + " " + st)}
              </button>
            ))}
          </div>

          {sortDates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#C084B4" }}>
              Nenhum resultado encontrado
            </div>
          ) : (
            sortDates.map(dt => (
              <div key={dt}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "#C084B4",
                  margin: "12px 0 6px", textTransform: "uppercase", letterSpacing: 0.5,
                }}>
                  {fmtDt(dt)}
                </div>
                {byDate[dt].map(o => (
                  <div
                    key={o.id}
                    className="hov"
                    style={{
                      background: "#fff", border: `1px solid ${pkL}`,
                      borderLeft: `4px solid ${o.status === "Aguardando Caução" ? "#F59E0B" : pk}`,
                      borderRadius: 14, padding: 14, marginBottom: 8, cursor: "pointer",
                    }}
                    onClick={() => setSelOrdId(o.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 900 }}>{o.nome}</span>
                      <Badge s={o.status} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginTop: 4 }}>
                      <span>{(o.itens ?? []).length} iten{(o.itens ?? []).length !== 1 ? "s" : ""}</span>
                      <span style={{ fontWeight: 700 }}>{o.valor ? fmtR(o.valor) : "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </>}

        {/* ── STATS ───────────────────────────────────────── */}
        {adminTab === "stats" && <>
          <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 14 }}>📊 Dashboard</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              {
                l: "Hoje", icon: "📅",
                v: fmtR(todayOrds.filter(o => o.status !== "Cancelado").reduce((s, o) => s + Number(o.valor || 0), 0)),
                sub: `${todayOrds.filter(o => o.status !== "Cancelado").length} pedidos`,
                c: pk,
              },
              {
                l: "Semana", icon: "📆",
                v: fmtR(semOrds.reduce((s, o) => s + Number(o.valor || 0), 0)),
                sub: `${semOrds.length} pedidos`,
                c: "#7C3AED",
              },
              {
                l: "Mês (confirm.)", icon: "💰",
                v: fmtR(totalMes),
                sub: `${ordsMes.length} pedidos`,
                c: "#0891B2",
              },
              {
                l: "Mês (finaliz.)", icon: "🚀",
                v: fmtR(totalFin),
                sub: "receita recebida",
                c: "#15803D",
              },
            ].map((x, i) => (
              <div key={i} style={{
                background: "#fff",
                borderTop: `3px solid ${x.c}`,
                borderRadius: 14, padding: "14px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,.04)",
              }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
                  {x.icon} {x.l}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: x.c }}>{x.v}</div>
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{x.sub}</div>
              </div>
            ))}
          </div>

          <Card ch={<>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>📋 Pedidos por Status</div>
            {STATUS_UNICO.map(st => {
              const cnt  = orders.filter(o => o.status === st).length;
              const pct  = Math.round((cnt / (orders.length || 1)) * 100);
              const meta = STATUS_META[st];
              return (
                <div key={st} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: meta.text, fontWeight: 700 }}>{meta.em} {st}</span>
                    <span style={{ fontWeight: 900 }}>
                      {cnt} <span style={{ color: "#aaa", fontWeight: 400 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ background: "#F3F4F6", borderRadius: 6, height: 6 }}>
                    <div style={{
                      background: meta.text, borderRadius: 6, height: 6,
                      width: `${pct}%`, transition: "width .6s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </>} />

          {urgentes > 0 && (
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA",
              borderRadius: 14, padding: 14,
            }}>
              <div style={{ fontWeight: 900, color: "#DC2626" }}>
                ⚠️ {urgentes} pedido{urgentes !== 1 ? "s" : ""} atrasado{urgentes !== 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>
                Data de entrega passada sem status final.
              </div>
            </div>
          )}
        </>}

        {/* ── CRM ─────────────────────────────────────────── */}
        {adminTab === "mkt" && <>
          <h3 style={{ fontSize: 16, fontWeight: 900 }}>
            🎂 Aniversariantes de {now.toLocaleString("pt-BR", { month: "long" })}
          </h3>
          {aniversariantes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🎊</div>
              <div style={{ fontWeight: 700, color: "#C084B4" }}>
                Nenhum aniversariante este mês
              </div>
            </div>
          ) : (
            aniversariantes.map(c => (
              <div key={c.id} style={{
                background: "#fff", border: `1px solid ${pkL}`,
                borderLeft: "4px solid #FFD700",
                borderRadius: 14, padding: 14, marginBottom: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{c.nome}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>🎂 {fmtDt(c.aniversario)}</div>
                  </div>
                  <a
                    href={`https://wa.me/${c.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(`🎂 Feliz aniversário, ${c.nome?.split(" ")[0]}! Temos um mimo especial para você! 🌸`)}`}
                    target="_blank" rel="noreferrer"
                  >
                    <button style={{
                      background: "#25D366", color: "#fff", border: "none",
                      borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>
                      💬 Parabenizar
                    </button>
                  </a>
                </div>
              </div>
            ))
          )}
        </>}

        {/* ── CONFIGS ──────────────────────────────────────── */}
        {adminTab === "configs" && (
          <ConfigsPanel
            cfg={cfg} onSave={setCfg}
            tipos={tipos} onUpdateTipos={setTipos}
            maintenanceMode={maintenanceMode}
            onSetMaintenance={setMaintenanceMode}
          />
        )}
      </div>
    </PageWrapper>
  );
}