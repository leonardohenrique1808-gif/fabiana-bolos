// src/hooks/useSettings.js
import { useState } from "react";
import { LS, san } from "../utils/helpers";
import { DEFAULT_CFG, TIPOS_BASE } from "../utils/constants";

const DEFAULT_WPP_MSG =
  "Olá, {NOME}! 🎂\nSeu pedido foi confirmado!\n" +
  "📅 Entrega: {DATA_ENTREGA}\n" +
  "💰 Total: {TOTAL}\n" +
  "💳 Caução (50%): {CAUCAO}\n" +
  "📌 SALDO A COBRAR: {SALDO}";

export function useSettings() {
  const [cfg, setCfgState] = useState(() => {
    const saved = LS.get("fab_cfg") ?? san(DEFAULT_CFG);
    // garante campos novos para migrações de versões anteriores
    return {
      pixLink:    "",
      cardLink:   "",
      wppMsg:     DEFAULT_WPP_MSG,
      ...saved,
    };
  });

  const [maintenanceMode, setMaintenanceModeState] = useState(
    () => LS.get("fab_maintenance") ?? false
  );

  const [tipos, setTiposState] = useState(
    () => LS.get("fab_tipos") ?? san(TIPOS_BASE)
  );

  const setCfg = (next) => {
    const v = typeof next === "function" ? next(cfg) : next;
    setCfgState(v);
    LS.set("fab_cfg", v);
  };

  const setMaintenanceMode = (v) => {
    setMaintenanceModeState(v);
    LS.set("fab_maintenance", v);
  };

  const setTipos = (next) => {
    const v = typeof next === "function" ? next(tipos) : next;
    setTiposState(v);
    LS.set("fab_tipos", v);
  };

  /**
   * Gera a mensagem de WhatsApp substituindo variáveis dinâmicas.
   */
  const buildWppMsg = ({ nome, total, caucao, saldo, dataEntrega }) => {
    const template = cfg.wppMsg || DEFAULT_WPP_MSG;
    const fmtR = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
    return template
      .replace(/{NOME}/g,          nome        || "")
      .replace(/{TOTAL}/g,         fmtR(total  || 0))
      .replace(/{CAUCAO}/g,        fmtR(caucao || 0))
      .replace(/{SALDO}/g,         fmtR(saldo  || 0))
      .replace(/{DATA_ENTREGA}/g,  dataEntrega || "");
  };

  return {
    cfg,        setCfg,
    maintenanceMode, setMaintenanceMode,
    tipos,      setTipos,
    buildWppMsg,
  };
}