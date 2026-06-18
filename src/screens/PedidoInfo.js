import React from "react";
import { Hdr }  from "../components/Hdr";
import { Fld }  from "../components/Fld";
import { Slct } from "../components/Slct";
import { Btn }  from "../components/Btn";
import { validateDate, minDt, fmtDt } from "../utils/helpers";

const fs = { width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" };

export function PedidoInfo({ pedInfo, setPedInfo, cfg, dateErr, setDateErr, onBack, onProximo }) {
  const isRetirada = pedInfo.regiao?.isRetirada ?? false;

  const podeAvancar =
    pedInfo.entrega &&
    !dateErr &&
    pedInfo.regiao &&
    (isRetirada || !!pedInfo.enderecoEntrega);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      <Hdr title="📅 Dados do pedido" onBack={onBack} />

      <div style={{ padding: "18px", maxWidth: 500, margin: "0 auto" }}>

        {/* Data de entrega com validação */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#6B4C7A", display: "block", marginBottom: 4 }}>
            Data de entrega *
          </label>
          <input
            type="date"
            value={pedInfo.entrega}
            min={minDt(cfg?.prazoMinHoras ?? 48)}
            onChange={e => {
              const v = e.target.value;
              const r = validateDate(v, cfg ?? { prazoMinHoras: 48, datasTravadas: [] });
              setDateErr(r.msg);
              setPedInfo(x => ({ ...x, entrega: r.ok ? v : "" }));
            }}
            style={{ ...fs, border: `1px solid ${dateErr ? "#DC2626" : "#E5D0EE"}` }}
          />
          {dateErr      && <div style={{ color: "#DC2626", fontSize: 12, marginTop: 3 }}>{dateErr}</div>}
          {!dateErr && pedInfo.entrega && <div style={{ color: "#15803D", fontSize: 12, marginTop: 3 }}>✅ Data disponível</div>}
        </div>

        {/* Horário */}
        <Fld label="Horário (opcional)">
          <input
            type="time"
            value={pedInfo.hora ?? ""}
            onChange={e => setPedInfo(x => ({ ...x, hora: e.target.value }))}
            style={fs}
          />
        </Fld>

        {/* Região */}
        {(cfg?.regioes ?? []).length > 0 && (
          <Slct
            label="Região / Entrega *"
            value={pedInfo.regiao?.id ?? ""}
            onChange={e => {
              const r = (cfg.regioes ?? []).find(x => String(x.id) === e.target.value);
              setPedInfo(p => ({ ...p, regiao: r ?? null }));
            }}
            options={<>
              <option value="">Selecione</option>
              {(cfg.regioes ?? []).map(r => (
                <option key={r.id} value={r.id}>
                  {r.nome}{!r.isRetirada && r.taxa > 0 ? ` (+R$ ${r.taxa.toFixed(2).replace(".", ",")})` : ""}
                </option>
              ))}
            </>}
          />
        )}

        {/* Endereço – só para entrega */}
        {!isRetirada && pedInfo.regiao && (
          <Fld label="Endereço de Entrega *">
            <input
              placeholder="Rua, número, bairro, cidade..."
              value={pedInfo.enderecoEntrega ?? ""}
              onChange={e => setPedInfo(x => ({ ...x, enderecoEntrega: e.target.value }))}
              style={fs}
            />
          </Fld>
        )}

        {/* Observações */}
        <Fld label="Observações">
          <input
            value={pedInfo.obs ?? ""}
            placeholder="Ex: Alergia a amendoim, entregar de tarde..."
            onChange={e => setPedInfo(x => ({ ...x, obs: e.target.value }))}
            style={fs}
          />
        </Fld>

        <Btn
          ch="Montar meu pedido →"
          disabled={!podeAvancar}
          st={{ opacity: podeAvancar ? 1 : 0.5 }}
          onClick={() => podeAvancar && onProximo()}
        />
      </div>
    </div>
  );
}