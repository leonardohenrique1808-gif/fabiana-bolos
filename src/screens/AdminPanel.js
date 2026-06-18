import React, { useState } from "react";
import { Hdr }       from "../components/Hdr";
import { Card }      from "../components/Card";
import { Fld }       from "../components/Fld";
import { Btn, BtnS } from "../components/Btn";
import { Badge }     from "../components/Badge";
import { StatusBar } from "../components/StatusBar";
import { ConfigsPanel } from "../components/ConfigsPanel";
import { fmtDt, fmtR, isSinalPago, san, getPrecoItem, today } from "../utils/helpers";
import { STATUS_UNICO, STATUS_META, pk, pkL, WHATSAPP } from "../utils/constants";

export function AdminPanel({
  orders, setOrders, updateOrd, removeOrd,
  cfg, setCfg, tipos, setTipos, TIPOS,
  clients, maintenanceMode, setMaintenanceMode,
  setPinDlg, setLabelOrd, onBack,
}) {
  const [selOrdId, setSelOrdId] = useState(null);
  const [adminTab, setAdminTab] = useState("hoje");
  const [adminSrch,setAdminSrch]= useState("");
  const [adminFlt, setAdminFlt] = useState("todos");
  const [showClts, setShowClts] = useState(false);

  const hoy      = today();
  const selOrd   = orders.find(o => o.id === selOrdId);

  // Listas
  const todayOrds = orders.filter(o => o.entrega === hoy).sort((a, b) => (a.hora||"").localeCompare(b.hora||""));
  const urgentes  = orders.filter(o => o.entrega <= hoy && o.status !== "Finalizado" && o.status !== "Cancelado").length;
  const semOrds   = orders.filter(o => {
    const d = new Date(o.entrega); const n = new Date(); n.setHours(0,0,0,0);
    const f = new Date(n); f.setDate(f.getDate()+7);
    return d >= n && d <= f && o.status !== "Cancelado";
  });

  // Stats mês
  const now  = new Date();
  const ordsMes = orders.filter(o => {
    const d = new Date(o.entrega);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      && o.status !== "Cancelado" && o.status !== "Aguardando Caução";
  });
  const totalMes = ordsMes.reduce((s, o) => s + Number(o.valor||0), 0);
  const totalFin = orders.filter(o => {
    const d = new Date(o.entrega);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.status === "Finalizado";
  }).reduce((s, o) => s + Number(o.valor||0), 0);

  // Filtros
  const allFilt = orders.filter(o => {
    const ms = !adminSrch || o.nome?.toLowerCase().includes(adminSrch.toLowerCase()) || o.telefone?.includes(adminSrch);
    const mf = adminFlt === "todos" || o.status === adminFlt;
    return ms && mf;
  }).sort((a, b) => new Date(a.entrega) - new Date(b.entrega));
  const byDate = {};
  allFilt.forEach(o => { if (!byDate[o.entrega]) byDate[o.entrega] = []; byDate[o.entrega].push(o); });
  const sortDates = Object.keys(byDate).sort();

  // Aniversariantes
  const mesMes = now.getMonth() + 1;
  const aniversariantes = clients.filter(c => c.aniversario && Number(c.aniversario.split("-")[1]) === mesMes);

  // ── Detalhe do pedido ──────────────────────────────────────────
  if (selOrd) {
    const isEntrega  = !selOrd.regiao?.isRetirada;
    const saldoAdmin = (selOrd.valor||0) - (selOrd.caucao||0);
    const urlMaps    = selOrd.endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selOrd.endereco)}` : null;

    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
        <Hdr title="Detalhes do Pedido" onBack={() => setSelOrdId(null)} />
        <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>

          <Card ch={<>
            <div style={{ fontWeight: 900, fontSize: 17 }}>{selOrd.nome}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{selOrd.telefone}</div>
            {selOrd.endereco && <div style={{ fontSize: 12, marginTop: 2 }}>📍 {selOrd.endereco}</div>}
            <div style={{ fontSize: 13, color: "#555", marginTop: 4, marginBottom: 6 }}>📅 {fmtDt(selOrd.entrega)} {selOrd.hora ? `às ${selOrd.hora}` : ""} · {selOrd.regiao?.nome ?? "—"}</div>
            <StatusBar status={selOrd.status} />
            <div style={{ marginTop: 6 }}><Badge s={selOrd.status} /></div>
            {selOrd.checksum && <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "monospace", marginTop: 4 }}>🔒 {selOrd.checksum}</div>}

            {/* Itens */}
            <div style={{ marginTop: 10 }}>
              {(selOrd.itens ?? []).map((it, i) => {
                const p   = getPrecoItem(it, cfg?.adicionalGourmet);
                const isU = it.tipo === "upsell";
                const nm  = isU ? it.nome : (TIPOS.find(t => t.id === it.tipo)?.nome ?? it.tipo);
                return (
                  <div key={i} style={{ background: "#FDF6FB", borderRadius: 10, padding: "8px 12px", marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, color: pk }}>{nm}</div>
                    {p != null && <div style={{ fontSize: 13 }}>{fmtR(p)}</div>}
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: `2px solid ${pkL}`, paddingTop: 10, marginTop: 6 }}>
              <div style={{ fontWeight: 900 }}>Total: {selOrd.valor ? fmtR(selOrd.valor) : "Sob consulta"}</div>
              <div style={{ color: "#BE185D" }}>Caução: {selOrd.caucao ? fmtR(selOrd.caucao) : "—"}</div>
              {saldoAdmin > 0 && isSinalPago(selOrd.status) && (
                <div style={{ fontWeight: 900, color: "#B45309" }}>💳 SALDO: {fmtR(saldoAdmin)}</div>
              )}
            </div>
          </>} />

          {/* Frete */}
          {isEntrega && (
            <Card ch={<>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>🚚 Frete Manual</div>
              <Fld label="Valor do frete (R$)">
                <input type="number" min="0" step="0.50" value={selOrd.freteManual || 0}
                  onChange={e => updateOrd(selOrd.id, { freteManual: Number(e.target.value) })}
                  style={{ width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff" }} />
              </Fld>
            </>} />
          )}

          {/* Status */}
          <Card ch={<>
            <label style={{ fontSize: 13, fontWeight: 700 }}>Atualizar Status:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {STATUS_UNICO.map(st => (
                <button key={st} style={{ background: selOrd.status === st ? pk : "#F3E6F0", color: selOrd.status === st ? "#fff" : "#6B4C7A", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }} onClick={() => updateOrd(selOrd.id, { status: st })}>
                  {STATUS_META[st]?.em} {st}
                </button>
              ))}
            </div>
          </>} />

          {/* Ações */}
          {isEntrega && urlMaps && (
            <a href={urlMaps} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 8, textDecoration: "none" }}>
              <button style={{ width: "100%", background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 11, fontWeight: 700, cursor: "pointer" }}>📍 Ver rota no Google Maps</button>
            </a>
          )}
          {saldoAdmin > 0 && isSinalPago(selOrd.status) && selOrd.telefone && (
            <a href={`https://wa.me/${selOrd.telefone.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá ${selOrd.nome}! Seu saldo restante é ${fmtR(saldoAdmin)}. 😊`)}`} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 8 }}>
              <button style={{ width: "100%", background: "#FFF7ED", color: "#B45309", border: "1.5px solid #FDE68A", borderRadius: 12, padding: 11, fontWeight: 700, cursor: "pointer" }}>💳 Cobrar saldo ({fmtR(saldoAdmin)})</button>
            </a>
          )}
          <button onClick={() => setLabelOrd(san(selOrd))} style={{ width: "100%", background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 11, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>🏷️ Etiqueta / Recibo</button>
          <button onClick={() => setPinDlg({ msg: "Excluir este pedido?", onOk: () => { removeOrd(selOrd.id); setSelOrdId(null); } })} style={{ width: "100%", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 12, padding: 12, fontWeight: 700, cursor: "pointer" }}>🗑 Excluir pedido</button>
        </div>
      </div>
    );
  }

  // ── Lista de clientes ──────────────────────────────────────────
  if (showClts) return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      <Hdr title="👥 Clientes" onBack={() => setShowClts(false)} />
      <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
        {clients.length === 0
          ? <div style={{ textAlign: "center", padding: "32px 0", color: "#888" }}>Nenhum cliente cadastrado</div>
          : clients.map(c => (
            <div key={c.id} style={{ background: "#fff", border: `1px solid ${pkL}`, borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <div style={{ fontWeight: 900 }}>{c.nome}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{c.telefone}</div>
              {c.aniversario && <div style={{ fontSize: 12, color: "#C084B4" }}>🎂 {fmtDt(c.aniversario)}</div>}
            </div>
          ))
        }
      </div>
    </div>
  );

  // ── Painel principal ───────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: `2px solid ${pkL}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: pk }}>PCP Gerência</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {urgentes > 0 && <span style={{ background: "#DC2626", color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>⚠ {urgentes}</span>}
          <button onClick={() => setShowClts(true)} style={{ background: pkL, color: pk, border: "none", borderRadius: 20, padding: "4px 12px", fontWeight: 700, cursor: "pointer" }}>👥 {clients.length}</button>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: "flex", overflowX: "auto", background: "#fff", borderBottom: `2px solid ${pkL}` }}>
        {[["hoje","📅 Agenda"],["caucao","💰 Caução"],["todos","📋 Todos"],["stats","📊 Stats"],["mkt","🎂 CRM"],["configs","⚙️ Config"]].map(([v, l]) => (
          <button key={v} style={{ flexShrink: 0, padding: "10px 12px", border: "none", background: "none", fontSize: 11, fontWeight: 700, color: adminTab===v?pk:"#9CA3AF", borderBottom: adminTab===v?`3px solid ${pk}`:"3px solid transparent", cursor: "pointer" }} onClick={() => setAdminTab(v)}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>

        {/* HOJE */}
        {adminTab === "hoje" && <>
          <h3 style={{ fontSize: 17, fontWeight: 900 }}>Hoje · {fmtDt(hoy)}</h3>
          {todayOrds.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0", color: "#C084B4" }}>📭 Sem entregas hoje</div>
            : todayOrds.map(o => (
              <div key={o.id} className="hov" style={{ background: "#fff", border: `1px solid ${pkL}`, borderLeft: `4px solid ${STATUS_META[o.status]?.brd||pk}`, borderRadius: 14, padding: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => setSelOrdId(o.id)}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontWeight: 900 }}>{o.nome}</div>{o.hora && <div style={{ fontSize: 12, color: "#888" }}>⏰ {o.hora}</div>}</div>
                  <Badge s={o.status} />
                </div>
                <StatusBar status={o.status} />
              </div>
            ))
          }
        </>}

        {/* CAUÇÃO */}
        {adminTab === "caucao" && <>
          <h3>💰 Aguardando Caução</h3>
          {orders.filter(o => o.status === "Aguardando Caução").length === 0
            ? <div style={{ textAlign: "center", padding: "24px 0", color: "#C084B4" }}>✅ Nenhum pendente</div>
            : orders.filter(o => o.status === "Aguardando Caução").map(o => (
              <Card key={o.id} ch={<>
                <div style={{ fontWeight: 900 }}>{o.nome}</div>
                <div style={{ fontSize: 13 }}>{fmtDt(o.entrega)} · {o.valor ? fmtR(o.valor) : "?"}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <BtnS ch="Ver" st={{ flex: 1 }} onClick={() => setSelOrdId(o.id)} />
                  <Btn ch="✅ Confirmar" st={{ flex: 1, background: "#15803D" }} onClick={() => updateOrd(o.id, { status: "Confirmado" })} />
                </div>
              </>} />
            ))
          }
        </>}

        {/* TODOS */}
        {adminTab === "todos" && <>
          <input value={adminSrch} onChange={e => setAdminSrch(e.target.value)} placeholder="🔍 Buscar por nome ou telefone..." style={{ width: "100%", border: "1px solid #E5D0EE", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
            {["todos", ...STATUS_UNICO].map(st => (
              <button key={st} style={{ background: adminFlt===st?pk:"#fff", color: adminFlt===st?"#fff":"#6B4C7A", border: `1.5px solid ${adminFlt===st?pk:"#E5D0EE"}`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => setAdminFlt(st)}>
                {st === "todos" ? "Todos" : (STATUS_META[st]?.em+" "+st)}
              </button>
            ))}
          </div>
          {sortDates.length === 0
            ? <div style={{ textAlign: "center", padding: "24px 0", color: "#C084B4" }}>Nenhum resultado</div>
            : sortDates.map(dt => (
              <div key={dt}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#C084B4", margin: "10px 0 4px" }}>{fmtDt(dt)}</div>
                {byDate[dt].map(o => (
                  <div key={o.id} className="hov" style={{ background: "#fff", border: `1px solid ${pkL}`, borderLeft: `4px solid ${o.status==="Aguardando Caução"?"#F59E0B":pk}`, borderRadius: 14, padding: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => setSelOrdId(o.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 900 }}>{o.nome}</span>
                      <Badge s={o.status} />
                    </div>
                    <div style={{ fontSize: 13, color: "#888" }}>{(o.itens??[]).length} itens · {o.valor ? fmtR(o.valor) : "—"}</div>
                  </div>
                ))}
              </div>
            ))
          }
        </>}

        {/* STATS */}
        {adminTab === "stats" && <>
          <h3 style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>📊 Dashboard</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { l:"Hoje",           icon:"📅", v: fmtR(todayOrds.filter(o=>o.status!=="Cancelado").reduce((s,o)=>s+Number(o.valor||0),0)), sub:`${todayOrds.filter(o=>o.status!=="Cancelado").length} pedidos`, c: pk },
              { l:"Semana",         icon:"📆", v: fmtR(semOrds.reduce((s,o)=>s+Number(o.valor||0),0)),  sub:`${semOrds.length} pedidos`, c:"#7C3AED" },
              { l:"Mês (confirm.)", icon:"💰", v: fmtR(totalMes),  sub:`${ordsMes.length} pedidos`, c:"#0891B2" },
              { l:"Mês (finaliz.)", icon:"🚀", v: fmtR(totalFin),  sub:"receita recebida",             c:"#15803D" },
            ].map((x, i) => (
              <div key={i} style={{ background: "#fff", borderTop: `3px solid ${x.c}`, borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 11, color: "#888" }}>{x.icon} {x.l}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: x.c, margin: "2px 0" }}>{x.v}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{x.sub}</div>
              </div>
            ))}
          </div>
          <Card ch={<>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>📋 Pedidos por Status</div>
            {STATUS_UNICO.map(st => {
              const cnt  = orders.filter(o => o.status === st).length;
              const pct  = Math.round((cnt / (orders.length || 1)) * 100);
              const meta = STATUS_META[st];
              return (
                <div key={st} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: meta.text, fontWeight: 700 }}>{meta.em} {st}</span>
                    <span style={{ fontWeight: 900 }}>{cnt} <span style={{ color: "#aaa", fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ background: "#F3F4F6", borderRadius: 6, height: 6 }}>
                    <div style={{ background: meta.text, borderRadius: 6, height: 6, width: `${pct}%`, transition: "width .4s" }} />
                  </div>
                </div>
              );
            })}
          </>} />
          {urgentes > 0 && (
            <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 14, padding: 14 }}>
              <div style={{ fontWeight: 900, color: "#DC2626" }}>⚠️ {urgentes} pedido{urgentes!==1?"s":""} atrasado{urgentes!==1?"s":""}</div>
              <div style={{ fontSize: 12, color: "#DC2626" }}>Data de entrega passada sem status final.</div>
            </div>
          )}
        </>}

        {/* CRM */}
        {adminTab === "mkt" && <>
          <h3 style={{ fontSize: 17, fontWeight: 900 }}>🎂 Aniversariantes de {now.toLocaleString("pt-BR",{month:"long"})}</h3>
          {aniversariantes.length === 0
            ? <div style={{ textAlign: "center", padding: "24px 0", color: "#C084B4" }}>Nenhum aniversariante este mês</div>
            : aniversariantes.map(c => (
              <div key={c.id} style={{ background: "#fff", border: `1px solid ${pkL}`, borderLeft: "4px solid #FFD700", borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ fontWeight: 900 }}>{c.nome}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{fmtDt(c.aniversario)}</div>
                <a href={`https://wa.me/${c.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(`🎂 Feliz aniversário, ${c.nome?.split(" ")[0]}! Temos um mimo especial para você! 🌸`)}`} target="_blank" rel="noreferrer">
                  <button style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, marginTop: 8, cursor: "pointer" }}>💬 WhatsApp</button>
                </a>
              </div>
            ))
          }
        </>}

        {/* CONFIGS */}
        {adminTab === "configs" && (
          <ConfigsPanel cfg={cfg} onSave={setCfg} tipos={tipos} onUpdateTipos={setTipos} maintenanceMode={maintenanceMode} onSetMaintenance={setMaintenanceMode} />
        )}
      </div>
    </div>
  );
}