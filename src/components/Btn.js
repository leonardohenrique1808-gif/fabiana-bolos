import React from "react";

export function Btn({ ch, st, ...p }) {
  return <button style={{ width:"100%",padding:"13px 18px",background:"#E91E8C",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:800,fontFamily:"'Nunito',sans-serif", ...st }} {...p}>{ch}</button>;
}

export function BtnS({ ch, st, ...p }) {
  return <button style={{ width:"100%",padding:"12px 16px",background:"#FFF0F8",color:"#E91E8C",border:"none",borderRadius:14,fontSize:14,fontWeight:700,fontFamily:"'Nunito',sans-serif", ...st }} {...p}>{ch}</button>;
}