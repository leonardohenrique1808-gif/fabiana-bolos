// src/hooks/useOrders.js
import { useState } from "react";
import { LS, san, getPrecoItem, gerarChecksumPedido } from "../utils/helpers";
import { STATUS_UNICO, STATUS_LEGACY_MAP } from "../utils/constants";

function normalizeOrder(o) {
  if (!STATUS_UNICO.includes(o.status))
    o.status = STATUS_LEGACY_MAP[o.status?.toLowerCase()] || "Aguardando Caução";
  if (!o.checksum) o.checksum = gerarChecksumPedido(o);
  return o;
}

export function useOrders(adicionalGourmet = 0) {
  const [orders, setOrdersState] = useState(() =>
    (LS.get("fab_orders") ?? []).map(normalizeOrder)
  );

  const persist = (next) => {
    setOrdersState(next);
    LS.set("fab_orders", next);
  };

  const addOrder = (novo) => {
    persist(san([...orders, novo]));
  };

  const updateOrd = (id, patch) => {
    const next = san(
      orders.map((o) => {
        if (o.id !== id) return o;
        const upd = { ...o, ...patch };
        upd.freteManual = Number(upd.freteManual || 0);
        const totalItens = (upd.itens ?? []).reduce(
          (s, it) => s + (getPrecoItem(it, adicionalGourmet) ?? 0),
          0
        );
        const totalFinal = totalItens + Number(upd.regiao?.taxa || 0) + upd.freteManual;
        upd.valor    = totalFinal || null;
        upd.caucao   = totalFinal ? Math.ceil(totalFinal * 0.5) : null;
        upd.checksum = gerarChecksumPedido(upd);
        return upd;
      })
    );
    persist(next);
  };

  const removeOrd = (id) => persist(orders.filter((o) => o.id !== id));

  const setOrders = (v) => persist(san(v));

  return { orders, addOrder, updateOrd, removeOrd, setOrders };
}