import React from "react";

export function Card({ ch, style }) {
  return (
    <div style={{ background:"#fff",border:"1px solid #FFF0F8",borderRadius:16,padding:16,marginBottom:12, ...style }}>
      {ch}
    </div>
  );
}