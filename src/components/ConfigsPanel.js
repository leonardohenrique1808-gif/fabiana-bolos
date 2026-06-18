import React, { useState } from "react";
import { Card } from "./Card";
import { Btn }  from "./Btn";
import { Slct } from "./Slct";
import { Fld }  from "./Fld";
import { san }  from "../utils/helpers";
import { LS, TIPOS_BASE } from "../utils/constants";

const fs = { width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" };

export function ConfigsPanel({ cfg, onSave, tipos, onUpdateTipos, maintenanceMode, onSetMaintenance }) {
  const [c,          setC]          = useState(san(cfg));
  const [saved,      setSaved]      = useState(false);
  const [prodSelect, setProdSelect] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const C = (p) => setC(x => san({ ...x, ...p }));

  function save() {
    onSave(san(c));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleUpload() {
    if (!uploadFile || !prodSelect) return;
    const url   = URL.createObjectURL(uploadFile);
    const novos = (tipos || TIPOS_BASE).map(t => t.id === prodSelect ? { ...t, fotoUrl: url } : t);
    onUpdateTipos(novos);
    LS.set("fab_tipos", novos);
    setUploadFile(null);
    setProdSelect("");
  }

  return (
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>⚙️ Configurações</h3>

      {/* Manutenção */}
      <Card ch={<>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🔧 Modo Manutenção</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onSetMaintenance(true)}
            style={{ flex: 1, background: maintenanceMode?"#DC2626":"#fff", color: maintenanceMode?"#fff":"#DC2626", border: "1.5px solid #DC2626", borderRadius: 10, padding: 10, fontWeight: 700, cursor: "pointer" }}
          >Ativar</button>
          <button
            onClick={() => onSetMaintenance(false)}
            style={{ flex: 1, background: !maintenanceMode?"#15803D":"#fff", color: !maintenanceMode?"#fff":"#15803D", border: "1.5px solid #15803D", borderRadius: 10, padding: 10, fontWeight: 700, cursor: "pointer" }}
          >Desativar</button>
        </div>
        <div style={{ fontSize: 12, color: maintenanceMode?"#DC2626":"#15803D", marginTop: 8, fontWeight: 700 }}>
          {maintenanceMode ? "🔴 Loja fechada para pedidos" : "🟢 Loja aberta"}
        </div>
      </>} />

      {/* Prazo mínimo */}
      <Card ch={<>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>⏰ Prazo Mínimo</div>
        <Fld label="Horas mínimas para encomenda">
          <input type="number" value={c.prazoMinHoras} onChange={e => C({ prazoMinHoras: Number(e.target.value) })} style={fs} />
        </Fld>
      </>} />

      {/* Adicional gourmet */}
      <Card ch={<>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>⭐ Adicional Gourmet (R$)</div>
        <input type="number" value={c.adicionalGourmet} onChange={e => C({ adicionalGourmet: Number(e.target.value) })} style={fs} />
      </>} />

      {/* Upload de foto de produto */}
      <Card ch={<>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>🖼️ Upload de Foto do Produto</div>
        <Slct
          label="Produto"
          value={prodSelect}
          onChange={e => setProdSelect(e.target.value)}
          options={<>
            <option value="">Selecione</option>
            {(tipos || TIPOS_BASE).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </>}
        />
        <Fld label="Imagem (PNG / JPG)">
          <input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files?.[0] || null)} style={fs} />
        </Fld>
        <Btn ch="Fazer Upload" st={{ marginBottom: 8 }} onClick={handleUpload} disabled={!uploadFile || !prodSelect} />
        {(tipos || TIPOS_BASE).find(t => t.id === prodSelect)?.fotoUrl && (
          <img src={(tipos || TIPOS_BASE).find(t => t.id === prodSelect)?.fotoUrl} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 8 }} alt="" onError={e => { e.target.style.display = "none"; }} />
        )}
        <div style={{ fontSize: 10, color: "#888", marginTop: 6 }}>⚠️ Fotos são temporárias (sessão). Use URLs externas para persistência.</div>
      </>} />

      <Btn ch={saved ? "✅ Salvo!" : "💾 Salvar Configurações"} st={{ background: saved ? "#15803D" : undefined }} onClick={save} />
    </div>
  );
}