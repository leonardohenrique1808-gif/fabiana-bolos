import React, { useState, useRef, useEffect } from "react";
import { LS, san, today } from "../utils/helpers";
import { STATUS_UNICO } from "../utils/constants";

export function KernelPanel({ orders, clients, cfg, maintenanceMode, onSetMaintenance, onSetLicense, onSetOrders, onSetClients, onSetCfg, onBack }) {
  const [tab,          setTab]         = useState("terminal");
  const [cmd,          setCmd]         = useState("");
  const [output,       setOutput]      = useState([{ type: "sys", text: "Fabiana Bolos Kernel v2.0 — ready. Digite 'help'." }]);
  const [licDate,      setLicDate]     = useState(cfg.licenseExpiry || "");
  const [licSaved,     setLicSaved]    = useState(false);
  const [confirmReset, setConfirmReset]= useState("");
  const termRef = useRef(null);

  useEffect(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, [output]);

  const color = { sys: "#555", out: "#00ff88", ok: "#00ffaa", err: "#ff4444", cmd: "#ffff00" };

  const runCmd = () => {
    const c   = cmd.trim();
    const cLo = c.toLowerCase();
    if (!c) return;
    let result = "";
    let type   = "out";

    if (cLo === "help") {
      result = [
        "  status           — visão geral",
        "  orders           — JSON dos pedidos",
        "  orders:count     — pedidos por status",
        "  clients          — JSON dos clientes",
        "  storage          — uso do localStorage",
        "  maintenance on   — ativar manutenção",
        "  maintenance off  — desativar manutenção",
        "  license:show     — exibir licença atual",
        "  purge:cancelled  — remover cancelados",
        "  clear            — limpar terminal",
      ].join("\n");
    }
    else if (cLo === "status") {
      result = `Pedidos: ${orders.length} | Clientes: ${clients.length} | Licença: ${cfg.licenseExpiry} | Manutenção: ${maintenanceMode?"ATIVA":"off"} | Storage: ${LS.usage().totalKB}KB`;
    }
    else if (cLo === "orders") {
      result = JSON.stringify(orders.map(o => ({ id: o.id, nome: o.nome, status: o.status, entrega: o.entrega, valor: o.valor })), null, 2);
    }
    else if (cLo === "orders:count") {
      const counts = {};
      STATUS_UNICO.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });
      result = Object.entries(counts).map(([s, n]) => `  ${s.padEnd(36)}: ${n}`).join("\n");
    }
    else if (cLo === "clients") {
      result = JSON.stringify(clients.map(c => ({ id: c.id, nome: c.nome, telefone: c.telefone })), null, 2);
    }
    else if (cLo === "storage") {
      const u = LS.usage();
      result = `Total: ${u.totalKB}KB\n` + u.items.map(i => `  ${i.k.padEnd(26)} ${i.sz}`).join("\n");
    }
    else if (cLo === "maintenance on")  { onSetMaintenance(true);  result = "✅ Manutenção ATIVADA";    type = "ok"; }
    else if (cLo === "maintenance off") { onSetMaintenance(false); result = "✅ Manutenção DESATIVADA"; type = "ok"; }
    else if (cLo === "license:show") { result = `Licença: ${cfg.licenseExpiry}`; }
    else if (cLo === "purge:cancelled") {
      const antes = orders.length;
      const filtrado = orders.filter(o => o.status !== "Cancelado");
      onSetOrders(filtrado);
      result = `✅ ${antes - filtrado.length} cancelados removidos. Restam: ${filtrado.length}`;
      type = "ok";
    }
    else if (cLo === "clear") { setOutput([{ type: "sys", text: "Terminal limpo." }]); setCmd(""); return; }
    else { result = `❌ Comando desconhecido: "${c}"  — Digite 'help'.`; type = "err"; }

    setOutput(p => [...p, { type: "cmd", text: `> ${c}` }, { type, text: result }]);
    setCmd("");
  };

  return (
    <div style={{ fontFamily: "'Share Tech Mono',monospace", background: "#0a0a0a", minHeight: "100vh", color: "#00ff88" }}>

      {/* Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #00ff88", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid #00ff88", color: "#00ff88", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>← SAIR</button>
          <span style={{ fontSize: 14, fontWeight: 700 }}>▣ KERNEL — FABIANA BOLOS</span>
        </div>
        <span style={{ color: "#333", fontSize: 10 }}>{new Date().toLocaleString("pt-BR")}</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
        {[["terminal","⬛ Terminal"],["system","⚙ System"],["storage","💾 Storage"]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            style={{ background: "transparent", border: "none", color: tab===v?"#00ff88":"#555", padding: "8px 14px", fontFamily: "inherit", cursor: "pointer", fontSize: 12, borderBottom: `2px solid ${tab===v?"#00ff88":"transparent"}` }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, maxWidth: 700, margin: "0 auto" }}>

        {/* TERMINAL */}
        {tab === "terminal" && <>
          <div ref={termRef} style={{ background: "#000", border: "1px solid #1a1a1a", borderRadius: 8, padding: 14, height: 380, overflowY: "auto", marginBottom: 12 }}>
            {output.map((line, i) => (
              <div key={i} style={{ color: color[line.type]||"#00ff88", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{line.text}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="kernel-input" value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={e => e.key==="Enter"&&runCmd()} placeholder="Digite um comando..." autoFocus style={{ flex: 1, background: "#111", border: "1px solid #00ff88", color: "#00ff88", fontFamily: "inherit", padding: "8px 12px", borderRadius: 6, outline: "none", fontSize: 13 }} />
            <button onClick={runCmd} style={{ background: "transparent", border: "1px solid #00ff88", color: "#00ff88", padding: "8px 16px", borderRadius: 6, fontFamily: "inherit", cursor: "pointer" }}>RUN</button>
          </div>
          <div style={{ fontSize: 10, color: "#333", marginTop: 8 }}>Enter para executar · 'help' para listar comandos</div>
        </>}

        {/* SYSTEM */}
        {tab === "system" && <>
          <div style={{ color: "#ffff00", fontSize: 13, marginBottom: 16 }}>⚙ CONFIGURAÇÕES DO SISTEMA</div>

          {/* Licença */}
          <div style={{ background: "#111", border: "1px solid #00ff88", borderRadius: 8, padding: 16, marginBottom: 14 }}>
            <div style={{ color: "#00ff88", fontWeight: 700, marginBottom: 10 }}>🔑 LICENÇA</div>
            <div style={{ color: "#555", fontSize: 11, marginBottom: 8 }}>Atual: <span style={{ color: "#00ff88" }}>{cfg.licenseExpiry || "—"}</span></div>
            <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>NOVA DATA DE EXPIRAÇÃO:</label>
            <input type="date" value={licDate} min={today()} onChange={e => setLicDate(e.target.value)}
              style={{ width: "100%", background: "#111", border: "1px solid #00ff88", color: "#00ff88", fontFamily: "inherit", padding: "8px 12px", borderRadius: 6, outline: "none", fontSize: 13, marginBottom: 10, boxSizing: "border-box" }} />
            <button
              onClick={() => { if (!licDate) return; onSetLicense(licDate); setLicSaved(true); setTimeout(()=>setLicSaved(false),2000); }}
              disabled={!licDate}
              style={{ width: "100%", background: licSaved?"#00ff88":"transparent", color: licSaved?"#0a0a0a":"#00ff88", border: "1px solid #00ff88", borderRadius: 6, padding: "8px", fontFamily: "inherit", cursor: "pointer" }}
            >
              {licSaved ? "✅ LICENÇA ATUALIZADA" : "ATUALIZAR LICENÇA →"}
            </button>
          </div>

          {/* Manutenção */}
          <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: 16, marginBottom: 14 }}>
            <div style={{ color: "#ffff00", fontWeight: 700, marginBottom: 10 }}>🔧 MODO MANUTENÇÃO</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => onSetMaintenance(true)}  style={{ flex: 1, background: maintenanceMode?"#ff4444":"transparent",  color: maintenanceMode?"#fff":"#ff4444",  border: `1px solid ${maintenanceMode?"#ff4444":"#555"}`,  borderRadius: 6, padding: 8, fontFamily: "inherit", cursor: "pointer" }}>ATIVAR</button>
              <button onClick={() => onSetMaintenance(false)} style={{ flex: 1, background: !maintenanceMode?"#00ff88":"transparent", color: !maintenanceMode?"#0a0a0a":"#00ff88", border: `1px solid ${!maintenanceMode?"#00ff88":"#555"}`, borderRadius: 6, padding: 8, fontFamily: "inherit", cursor: "pointer" }}>DESATIVAR</button>
            </div>
            <div style={{ fontSize: 10, color: maintenanceMode?"#ff4444":"#00ff88", marginTop: 8 }}>
              Status: {maintenanceMode ? "🔴 ATIVO — loja bloqueada" : "🟢 NORMAL — loja aberta"}
            </div>
          </div>

          {/* Reset */}
          <div style={{ background: "#111", border: "1px solid #ff4444", borderRadius: 8, padding: 16 }}>
            <div style={{ color: "#ff4444", fontWeight: 700, marginBottom: 8 }}>⚠ ZONA DE PERIGO</div>
            <div style={{ color: "#555", fontSize: 11, marginBottom: 8 }}>Digite <span style={{ color: "#ff4444" }}>RESETAR TUDO</span> para confirmar:</div>
            <input value={confirmReset} onChange={e => setConfirmReset(e.target.value)} placeholder="RESETAR TUDO"
              style={{ width: "100%", background: "#111", border: "1px solid #ff4444", color: "#ff4444", fontFamily: "inherit", padding: "8px 12px", borderRadius: 6, outline: "none", fontSize: 13, marginBottom: 8, boxSizing: "border-box" }} />
            <button
              disabled={confirmReset !== "RESETAR TUDO"}
              onClick={() => {
                if (confirmReset !== "RESETAR TUDO") return;
                ["fab_orders","fab_clients","fab_session","fab_tipos"].forEach(k => LS.del(k));
                onSetOrders([]); onSetClients([]);
                setConfirmReset("");
                setTab("terminal");
                setOutput(p => [...p, { type: "err", text: "⚠ DADOS RESETADOS" }]);
              }}
              style={{ width: "100%", background: "transparent", border: "1px solid #ff4444", color: "#ff4444", borderRadius: 6, padding: 8, fontFamily: "inherit", cursor: "pointer", opacity: confirmReset==="RESETAR TUDO"?1:.4 }}
            >
              EXECUTAR RESET TOTAL
            </button>
          </div>
        </>}

        {/* STORAGE */}
        {tab === "storage" && <>
          <div style={{ color: "#ffff00", fontSize: 13, marginBottom: 16 }}>💾 ARMAZENAMENTO LOCAL</div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px solid #1a1a1a", paddingBottom: 8 }}>
              <span style={{ color: "#888", fontSize: 11 }}>TOTAL USADO:</span>
              <span style={{ color: "#00ff88", fontWeight: 700 }}>{LS.usage().totalKB} KB</span>
            </div>
            {LS.usage().items.length === 0
              ? <div style={{ color: "#333", fontSize: 12 }}>Nenhuma chave fab_ encontrada.</div>
              : LS.usage().items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0f0f0f", fontSize: 12 }}>
                  <span style={{ color: "#00ff88" }}>{item.k}</span>
                  <span style={{ color: "#555" }}>{item.sz}</span>
                </div>
              ))
            }
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: 14 }}>
            <div style={{ color: "#888", fontSize: 11, marginBottom: 10 }}>REGISTROS:</div>
            {[["fab_orders",`${orders.length} pedidos`],["fab_clients",`${clients.length} clientes`]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                <span style={{ color: "#555" }}>{k}</span>
                <span style={{ color: "#00ff88" }}>{v}</span>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}