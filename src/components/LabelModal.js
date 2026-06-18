import React from "react";
import { BtnS }        from "./Btn";
import { Badge }       from "./Badge";
import { StatusBar }   from "./StatusBar";
import { fmtR, fmtDt, getPrecoItem } from "../utils/helpers";
import { TIPOS_BASE, pk, NOME_APP, PIX_KEY } from "../utils/constants";

export function LabelModal({ order, cfg, tipos, onClose }) {
  const TIPOS_REF = (tipos && tipos.length) ? tipos : TIPOS_BASE;
  const ts        = new Date().toLocaleString("pt-BR");
  const saldo     = (order.valor || 0) - (order.caucao || 0);
  const isRetirada= order.regiao?.isRetirada ?? false;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 180, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} className="no-print">
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, maxHeight: "90vh", overflowY: "auto" }}>

        {/* Conteúdo imprimível */}
        <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, color: "#000" }}>
          <div style={{ textAlign: "center", borderBottom: "2px dashed #333", paddingBottom: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>🎂 {(NOME_APP || "Fabiana Bolos").toUpperCase()}</div>
            <div style={{ fontSize: 11, color: "#555" }}>{ts}</div>
          </div>

          <div><b>CLIENTE:</b> {order.nome}</div>
          <div><b>FONE:</b> {order.telefone || "—"}</div>

          {isRetirada
            ? <div style={{ fontWeight: 900, color: pk, marginTop: 4 }}>📍 RETIRADA NA LOJA</div>
            : <>
                <div><b>ENDEREÇO:</b> {order.endereco || "—"}</div>
                {order.freteManual > 0 && <div><b>FRETE:</b> {fmtR(order.freteManual)}</div>}
              </>
          }

          <div><b>ENTREGA:</b> {fmtDt(order.entrega)}{order.hora ? ` às ${order.hora}` : ""}</div>

          <div style={{ marginTop: 6 }}>
            <StatusBar status={order.status || "Aguardando Caução"} />
          </div>
          <div style={{ marginTop: 4 }}>
            <Badge s={order.status || "Aguardando Caução"} />
          </div>

          {/* Itens */}
          <div style={{ borderTop: "1px dashed #aaa", marginTop: 8, paddingTop: 8 }}>
            <b>ITENS:</b>
            {(order.itens || []).map((it, i) => {
              const isU = it.tipo === "upsell";
              const tn  = isU ? it.nome : (TIPOS_REF.find(t => t.id === it.tipo)?.nome ?? it.tipo ?? "");
              const p   = getPrecoItem(it, cfg?.adicionalGourmet ?? 0);
              return (
                <div key={i} style={{ marginTop: 6, paddingLeft: 6, borderLeft: `3px solid ${pk}` }}>
                  <div style={{ fontWeight: 700 }}>{i + 1}. {tn}</div>
                  {!isU && it.massa    && <div style={{ fontSize: 11, color: "#555" }}>Massa: {it.massa}</div>}
                  {!isU && it.recheio1 && <div style={{ fontSize: 11, color: "#555" }}>R1: {it.recheio1}</div>}
                  {!isU && it.recheio2 && <div style={{ fontSize: 11, color: "#555" }}>R2: {it.recheio2}</div>}
                  {!isU && it.fatias   && <div style={{ fontSize: 11, color: "#555" }}>{it.fatias} fatias · {it.formato}</div>}
                  {!isU && it.obs      && <div style={{ fontSize: 11, color: "#888" }}>Obs: {it.obs}</div>}
                  {p != null && <div style={{ fontWeight: 700, color: pk }}>{fmtR(p)}</div>}
                </div>
              );
            })}
          </div>

          {/* Resumo financeiro */}
          <div style={{ borderTop: "2px dashed #333", marginTop: 8, paddingTop: 8, background: "#f9f9f9", padding: 8, borderRadius: 4 }}>
            <div style={{ fontWeight: 900, fontSize: 14 }}>💰 RESUMO FINANCEIRO</div>
            <div><b>TOTAL:</b> {order.valor ? fmtR(order.valor) : "Sob consulta"}</div>
            <div><b>SINAL (50%):</b> {order.caucao ? fmtR(order.caucao) : "—"}</div>
            {saldo > 0 && <div style={{ fontWeight: 900, fontSize: 14, marginTop: 4 }}><b>SALDO: {fmtR(saldo)}</b></div>}
            {PIX_KEY && <div style={{ marginTop: 4, fontSize: 11 }}>PIX: <b>{PIX_KEY}</b></div>}
          </div>

          {order.checksum && (
            <div style={{ fontSize: 10, color: "#aaa", fontFamily: "monospace", marginTop: 6 }}>#{order.checksum}</div>
          )}
        </div>

        {/* Botões (não imprimem) */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }} className="no-print">
          <button
            onClick={() => window.print()}
            style={{ flex: 1, background: pk, color: "#fff", border: "none", borderRadius: 10, padding: 11, fontWeight: 700, cursor: "pointer" }}
          >
            🖨️ Imprimir
          </button>
          <BtnS ch="Fechar" st={{ flex: 1 }} onClick={onClose} />
        </div>
      </div>
    </div>
  );
}