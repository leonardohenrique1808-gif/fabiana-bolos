import React, { useState } from "react";
import { Hdr } from "../components/Hdr";
import { Card } from "../components/Card";
import { Fld } from "../components/Fld";
import { Btn, BtnS } from "../components/Btn";
import { Badge } from "../components/Badge"; // Certifique-se de criar este componente
import { StatusBar } from "../components/StatusBar";
import { fmtDt, fmtR, isSinalPago, san } from "../utils/helpers";
import { STATUS_UNICO, STATUS_META, pk, pkL } from "../utils/constants";

export function AdminPanel({ orders, setOrders, cfg, onBack, setLabelOrd }) {
  const [selOrdId, setSelOrdId] = useState(null);
  const selOrd = orders.find(o => o.id === selOrdId);
  const [adminTab, setAdminTab] = useState("hoje");

  const updateOrd = (id, patch) => setOrders(p => san(p.map(o => o.id !== id ? o : { ...o, ...patch })));
  const removeOrd = (id) => setOrders(p => p.filter(o => o.id !== id));

  // Se tem um pedido selecionado, mostra o detalhe dele
  if (selOrd) {
    const isEntrega = !selOrd.regiao?.isRetirada;
    const saldoAdmin = (selOrd.valor || 0) - (selOrd.caucao || 0);
    
    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
        <Hdr title="Detalhes do Pedido" onBack={() => setSelOrdId(null)} />
        <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
          <Card ch={<>
            <div style={{ fontWeight: 900, fontSize: 17 }}>{selOrd.nome}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{selOrd.telefone}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>📅 {fmtDt(selOrd.entrega)}</div>
            <div style={{ marginTop: 8 }}><Badge s={selOrd.status} /></div>
            
            <div style={{ borderTop: `1px solid ${pkL}`, marginTop: 12, paddingTop: 12 }}>
                <div style={{ fontWeight: 900 }}>Total: {selOrd.valor ? fmtR(selOrd.valor) : "Sob consulta"}</div>
                {saldoAdmin != null && isSinalPago(selOrd.status) && (
                    <div style={{ fontWeight: 900, color: "#B45309" }}>💳 SALDO: {fmtR(saldoAdmin)}</div>
                )}
            </div>
          </>} />

          {/* Gestão de Status */}
          <Card ch={<>
            <label style={{ fontSize: 13, fontWeight: 700 }}>Atualizar Status:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {STATUS_UNICO.map(st => (
                <button key={st} style={{ background: selOrd.status === st ? pk : "#F3E6F0", color: selOrd.status === st ? "#fff" : "#6B4C7A", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }} onClick={() => updateOrd(selOrd.id, { status: st })}>
                  {STATUS_META[st]?.em} {st}
                </button>
              ))}
            </div>
          </>} />

          <Btn ch="🏷️ Etiqueta / Recibo" st={{ background: "#EFF6FF", color: "#1D4ED8", marginBottom: 8 }} onClick={() => setLabelOrd(san(selOrd))} />
          <button style={{ width: "100%", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 12, padding: 12, fontWeight: 700, cursor: "pointer" }} onClick={() => removeOrd(selOrd.id)}>🗑 Excluir</button>
        </div>
      </div>
    );
  }

  // Visualização da lista de pedidos (Abas)
  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      <Hdr title="PCP Gerência" onBack={onBack} />
      
      <div style={{ display: "flex", background: "#fff", borderBottom: `2px solid ${pkL}` }}>
        {["hoje", "todos"].map(v => (
          <button key={v} style={{ flex: 1, padding: 12, border: "none", background: "none", fontWeight: 700, color: adminTab === v ? pk : "#9CA3AF" }} onClick={() => setAdminTab(v)}>
            {v === "hoje" ? "📅 Hoje" : "📋 Todos"}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {orders.filter(o => adminTab === "hoje" ? o.entrega === new Date().toISOString().split("T")[0] : true).map(o => (
          <div key={o.id} style={{ background: "#fff", padding: 14, borderRadius: 14, marginBottom: 8, cursor: "pointer", border: `1px solid ${pkL}` }} onClick={() => setSelOrdId(o.id)}>
             <div style={{ fontWeight: 800 }}>{o.nome}</div>
             <Badge s={o.status} />
          </div>
        ))}
      </div>
    </div>
  );
}