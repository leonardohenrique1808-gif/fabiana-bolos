import React from "react";

export function Btn({ ch, st, ...p }) {
  return (
    <button className="btn-primary" style={st} {...p}>
      {ch}
    </button>
  );
}

export function BtnS({ ch, st, ...p }) {
  return (
    <button className="btn-secondary" style={st} {...p}>
      {ch}
    </button>
  );
}
