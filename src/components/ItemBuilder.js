import React, { useState } from "react";
import { Fld } from "./Fld";
import { Slct } from "./Slct";
import { Btn, BtnS } from "./Btn";
import { BtnO } from "./BtnO";
import { Card } from "./Card";
import { san, fmtR, calcItem } from "../utils/helpers";
import { TIPOS_BASE, PRECOS, MASSAS, R_TRAD, R_GOUR, R_BENTO_T, R_BENTO_G, S_DOC_T, S_DOC_G } from "../utils/constants";

const EMPTY_IT = { tipo:"",formato:"redondo",fatias:"",subtipo:"tradicional",quantidade:"50",massa:"Baunilha",recheio1:"",recheio2:"",bentoTipo:"tradicional",obs:"" };

export function ItemBuilder({ init, onSave, onCancel, isEdit, gAdic = 0, tipos }) {
  const pk = "#E91E8C";
  const pkL = "#FFF0F8";
  const T = (tipos && tipos.length) ? tipos : TIPOS_BASE;
  const [f, setF] = useState(san(init ?? EMPTY_IT));
  const F = (p) => setF(x => san({ ...x, ...p }));
  
  const isBento = f.tipo === "bento", isDoc = f.tipo === "docinhos", isGr = f.tipo && !isBento && !isDoc;
  const temRet = ["chantilly","palitinhos"].includes(f.tipo);
  const tams = isGr ? Object.entries(PRECOS[f.tipo]?.[f.formato] ?? {}).map(([k, v]) => ({ k, v })) : [];
  const rT = isBento ? R_BENTO_T : R_TRAD;
  const rG = isBento ? R_BENTO_G : R_GOUR;
  const preco = calcItem(f, gAdic);
  const ok = f.tipo && (isBento ? f.recheio1 : isDoc ? (f.quantidade && f.recheio1) : (f.fatias && f.massa && f.recheio1));

  return (
    <Card style={{ border:`2px solid ${pkL}` }} ch={
      <div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:13,fontWeight:700,color:"#6B4C7A",marginBottom:6,display:"block" }}>Tipo *</label>
          {T.map(t => (
            <div key={t.id} className="hov" style={{ border:`2px solid ${f.tipo===t.id?pk:"#E5D0EE"}`,borderRadius:12,padding:"9px 13px",cursor:"pointer",background:f.tipo===t.id?pkL:"#fff",marginBottom:6 }} onClick={() => F({ tipo:t.id,fatias:"",formato:"redondo",recheio1:"",recheio2:"" })}>
              {t.fotoUrl
                ? <img src={t.fotoUrl} style={{ width:"100%",height:80,objectFit:"cover",borderRadius:8,marginBottom:6 }} alt={t.nome} onError={e => { e.target.style.display="none"; }} />
                : <div style={{ width:"100%",height:60,background:"#F3E6F0",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#888" }}>📷 sem foto</div>
              }
              <div style={{ fontWeight:800,fontSize:14,color:f.tipo===t.id?pk:"#1A1A1A" }}>{t.nome}</div>
              <div style={{ fontSize:12,color:"#888" }}>{t.desc}</div>
            </div>
          ))}
        </div>
        
        {isDoc && <>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13,fontWeight:700 }}>Categoria *</label>
            <div style={{ display:"flex",gap:8 }}>
              {["tradicional","gourmet"].map(v => <BtnO key={v} active={f.subtipo===v} ch={v.charAt(0).toUpperCase()+v.slice(1)} st={{ flex:1 }} onClick={() => F({ subtipo:v,recheio1:"" })} />)}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13,fontWeight:700 }}>Quantidade *</label>
            <div style={{ display:"flex",gap:8 }}>
              {["50","100"].map(v => <BtnO key={v} active={f.quantidade===v} ch={`${v} un · ${fmtR(PRECOS.docinhos[f.subtipo]?.[Number(v)] || 0)}`} st={{ flex:1 }} onClick={() => F({ quantidade:v })} />)}
            </div>
          </div>
          <Slct label="Sabor *" value={f.recheio1} onChange={e => F({ recheio1:e.target.value })} options={<><option value="">Escolha</option>{(f.subtipo==="gourmet"?S_DOC_G:S_DOC_T).map(r => <option key={r} value={r}>{r}</option>)}</>} />
        </>}
        
        {isBento && <>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13,fontWeight:700 }}>Tipo *</label>
            <div style={{ display:"flex",gap:8 }}>
              {[{v:"tradicional",p:50},{v:"gourmet",p:55}].map(({v,p}) => <BtnO key={v} active={f.bentoTipo===v} ch={`${v.charAt(0).toUpperCase()+v.slice(1)} · ${fmtR(p)}`} st={{ flex:1 }} onClick={() => F({ bentoTipo:v,recheio1:"" })} />)}
            </div>
          </div>
          <Slct label="Recheio *" value={f.recheio1} onChange={e => F({ recheio1:e.target.value })} options={<><option value="">Escolha</option>{(f.bentoTipo==="gourmet"?R_BENTO_G:R_BENTO_T).map(r => <option key={r} value={r}>{r}</option>)}</>} />
        </>}
        
        {isGr && <>
          {temRet && (
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:13,fontWeight:700 }}>Formato *</label>
              <div style={{ display:"flex",gap:8 }}>
                {["redondo","retangular"].map(v => <BtnO key={v} active={f.formato===v} ch={v.charAt(0).toUpperCase()+v.slice(1)} st={{ flex:1 }} onClick={() => F({ formato:v,fatias:"" })} />)}
              </div>
            </div>
          )}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13,fontWeight:700 }}>Tamanho *</label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {tams.map(({k,v}) => (
                <div key={k} style={{ border:`2px solid ${f.fatias===k?pk:"#E5D0EE"}`,borderRadius:12,padding:"9px 12px",cursor:"pointer",background:f.fatias===k?pkL:"#fff" }} onClick={() => F({ fatias:k })}>
                  <div style={{ fontWeight:800 }}>{k} fatias</div>
                  <div style={{ fontSize:13,color:pk,fontWeight:700 }}>{fmtR(v)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13,fontWeight:700 }}>Massa *</label>
            <div style={{ display:"flex",gap:8 }}>
              {MASSAS.map(m => <BtnO key={m} active={f.massa===m} ch={m} st={{ flex:1 }} onClick={() => F({ massa:m })} />)}
            </div>
          </div>
          <Slct label="1º Recheio *" value={f.recheio1} onChange={e => F({ recheio1:e.target.value })} options={<><option value="">Escolha</option><optgroup label="── Tradicionais">{rT.map(r => <option key={r} value={r}>{r}</option>)}</optgroup><optgroup label="── Gourmet ⭐">{rG.map(r => <option key={r} value={r}>{r}</option>)}</optgroup></>} />
          <Slct label="2º Recheio (opcional)" value={f.recheio2} onChange={e => F({ recheio2:e.target.value })} options={<><option value="">Nenhum</option><optgroup label="── Tradicionais">{rT.map(r => <option key={r} value={r}>{r}</option>)}</optgroup><optgroup label="── Gourmet ⭐">{rG.map(r => <option key={r} value={r}>{r}</option>)}</optgroup></>} />
        </>}
        
        {f.tipo && (
          <Fld label="Obs. deste item">
            <input value={f.obs} onChange={e => F({ obs:e.target.value })} style={{ width:"100%",border:"1px solid #E5D0EE",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",background:"#fff",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" }} />
          </Fld>
        )}
        
        {preco != null && <div style={{ background:pkL,borderRadius:10,padding:"8px 14px",marginBottom:12,fontWeight:800,color:pk }}>💰 {fmtR(preco)}</div>}
        
        <div style={{ display:"flex",gap:8 }}>
          <BtnS ch="Cancelar" st={{ flex:1 }} onClick={onCancel} />
          <Btn ch={isEdit ? "💾 Salvar" : "✅ Adicionar"} st={{ flex:2,opacity:ok?1:.5 }} disabled={!ok} onClick={() => ok && onSave(san(f))} />
        </div>
      </div>
    } />
  );
}