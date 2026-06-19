// src/hooks/useSettings.js
import { useState } from "react";
import { LS, san } from "../utils/helpers";
import { DEFAULT_CFG } from "../utils/constants";

export function useSettings() {
  const [cfg, setCfgState] = useState(() => {
    const saved = LS.get("fab_cfg") ?? san(DEFAULT_CFG);
    // Garante que os novos campos existam mesmo em configs antigas
    return {
      pixLink:       "",
      cardLink:      "",
      wppTemplate:   "Olá {NOME}! 🎂\n📅 Entrega: {DATA_ENTREGA}\n💰 Total: {TOTAL}\n💳 Caução: {CAUCAO}\n📌 Saldo: {SALDO}",
      ...saved,
    };
  });

  const setCfg = (next) => {
    const v = typeof next === "function" ? next(cfg) : next;
    const merged = san(v);
    setCfgState(merged);
    LS.set("fab_cfg", merged);
  };

  return { cfg, setCfg };
}