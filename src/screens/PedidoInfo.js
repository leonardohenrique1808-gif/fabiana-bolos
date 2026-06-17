import React from "react";
import { Hdr } from "../components/Hdr";
import { Fld } from "../components/Fld";
import { Btn } from "../components/Btn";

export function PedidoInfo({ pedInfo, setPedInfo, onBack, onProximo }) {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      <Hdr title="📅 Dados do pedido" onBack={onBack} />
      
      <div style={{ padding: 18, maxWidth: 500, margin: "0 auto" }}>
        <Fld label="Data de entrega">
           <input 
             type="date" 
             value={pedInfo.entrega} 
             onChange={e => setPedInfo({...pedInfo, entrega: e.target.value})} 
             style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} 
           />
        </Fld>
        
        <Fld label="Observações">
           <input 
             value={pedInfo.obs} 
             placeholder="Ex: Alergia a amendoim, entregar de tarde..."
             onChange={e => setPedInfo({...pedInfo, obs: e.target.value})} 
             style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5D0EE" }} 
           />
        </Fld>
        
        <br />
        <Btn ch="Montar meu pedido →" onClick={onProximo} />
      </div>
    </div>
  );
}