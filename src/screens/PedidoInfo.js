import React from "react";
import { Hdr }         from "../components/Hdr";
import { Fld }         from "../components/Fld";
import { Slct }        from "../components/Slct";
import { Btn }         from "../components/Btn";
import { PageWrapper } from "../components/PageWrapper";
import { validateDate, minDt, fmtDt } from "../utils/helpers";

export function PedidoInfo({ pedInfo, setPedInfo, cfg, dateErr, setDateErr, onBack, onProximo }) {
  const isRetirada = pedInfo.regiao?.isRetirada ?? false;

  const podeAvancar =
    pedInfo.entrega &&
    !dateErr &&
    pedInfo.regiao &&
    (isRetirada || !!pedInfo.enderecoEntrega);

  return (
    <PageWrapper>
      <Hdr title="📅 Dados do pedido" onBack={onBack} />

      <div style={{ padding: "18px", maxWidth: 500, margin: "0 auto" }}>

        {/* Data de entrega com validação */}
        <div style={{ marginBottom: 12 }}>
          <label className="fld-label">Data de entrega *</label>
          <input
            type="date"
            className="input-padrao"
            value={pedInfo.entrega}
            min={minDt(cfg?.prazoMinHoras ?? 48)}
            style={{ border: `1px solid ${dateErr ? "#DC2626" : "#E5D0EE"}` }}
            onChange={e => {
              const v = e.target.value;
              const r = validateDate(v, cfg ?? { prazoMinHoras: 48, datasTravadas: [] });
              setDateErr(r.msg);
              setPedInfo(x => ({ ...x, entrega: r.ok ? v : "" }));
            }}
          />
          {dateErr && (
            <div style={{ color: "#DC2626", fontSize: 12, marginTop: 3 }}>{dateErr}</div>
          )}
          {!dateErr && pedInfo.entrega && (
            <div style={{ color: "#15803D", fontSize: 12, marginTop: 3 }}>✅ Data disponível</div>
          )}
        </div>

        {/* Horário */}
        <Fld
          label="Horário (opcional)"
          type="time"
          value={pedInfo.hora ?? ""}
          onChange={e => setPedInfo(x => ({ ...x, hora: e.target.value }))}
        />

        {/* Região */}
        {(cfg?.regioes ?? []).length > 0 && (
          <Slct
            label="Região / Entrega *"
            value={pedInfo.regiao?.id ?? ""}
            onChange={e => {
              const r = (cfg.regioes ?? []).find(x => String(x.id) === e.target.value);
              setPedInfo(p => ({ ...p, regiao: r ?? null }));
            }}
            options={
              <>
                <option value="">Selecione</option>
                {(cfg.regioes ?? []).map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nome}
                    {!r.isRetirada && r.taxa > 0
                      ? ` (+R$ ${r.taxa.toFixed(2).replace(".", ",")})`
                      : ""}
                  </option>
                ))}
              </>
            }
          />
        )}

        {/* Endereço — só para entrega */}
        {!isRetirada && pedInfo.regiao && (
          <Fld
            label="Endereço de Entrega *"
            placeholder="Rua, número, bairro, cidade..."
            value={pedInfo.enderecoEntrega ?? ""}
            onChange={e => setPedInfo(x => ({ ...x, enderecoEntrega: e.target.value }))}
          />
        )}

        {/* Observações */}
        <Fld
          label="Observações"
          value={pedInfo.obs ?? ""}
          placeholder="Ex: Alergia a amendoim, entregar de tarde..."
          onChange={e => setPedInfo(x => ({ ...x, obs: e.target.value }))}
        />

        <Btn
          ch="Montar meu pedido →"
          disabled={!podeAvancar}
          st={{ opacity: podeAvancar ? 1 : 0.5 }}
          onClick={() => podeAvancar && onProximo()}
        />
      </div>
    </PageWrapper>
  );
}
