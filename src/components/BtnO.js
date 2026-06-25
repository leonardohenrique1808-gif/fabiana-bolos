import React from "react";

export function BtnO({ active, ch, st, ...p }) {
  return (
    <button
      className={`btn-opcao${active ? " ativo" : ""}`}
      style={st}
      {...p}
    >
      {ch}
    </button>
  );
}
