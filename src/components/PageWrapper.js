import React from "react";

export function PageWrapper({ children, style }) {
  return (
    <div className="page-base" style={style}>
      {children}
    </div>
  );
}
