// src/hooks/useOrders.js
import { useState } from "react";
import { LS, san, getPrecoItem, gerarChecksumPedido } from "../utils/helpers";
import { STATUS_UNICO, STATUS_LEGACY_MAP } from "../utils/constants";

// Se o projeto usa Firebase, troque os imports abaixo pelos do db.js
// import { saveOrder, deleteOrder } from "../utils/db";
const saveOrder   = () => {};
const deleteOrder = () => {};

function normalizeOrder(o) {
  if (!STATUS_UNICO.includes(o.status))
    o.status = STATUS_LEGACY_MAP[o.status?.toLowerCase()] || "Aguardando Caução";
  if (!o.checksum) o.checksum = gerarChecksumPedido(o);
  return o;
}

export function useOrders(adicionalGourmet = 0) {
  const [orders, setOrders] = useState(() =>
    (LS.get("fab_orders") ?? []).map(normalizeOrder)
  );

  const persist = (next) => {
    setOrders(next);
    LS.set("fab_orders", next);
  };

  const addOrder = (novo) => {
    persist(san([...orders, novo]));
    saveOrder(novo);
  };

  const updateOrd = (id, patch) => {
    const next = san(orders.map(o => {
      if (o.id !== id) return o;
      const upd = { ...o, ...patch };
      upd.freteManual = Number(upd.freteManual || 0);
      const totalItens = (upd.itens ?? []).reduce(
        (s, it) => s + (getPrecoItem(it, adicionalGourmet) ?? 0), 0
      );
      const totalFinal = totalItens + Number(upd.regiao?.taxa || 0) + upd.freteManual;
      upd.valor    = totalFinal || null;
      upd.caucao   = totalFinal ? Math.ceil(totalFinal * 0.5) : null;
      upd.checksum = gerarChecksumPedido(upd);
      return upd;
    }));
    persist(next);
    const updated = next.find(o => o.id === id);
    if (updated) saveOrder(updated);
  };

  const removeOrd = (id) => {
    persist(orders.filter(o => o.id !== id));
    deleteOrder(id);
  };

  const setOrdersRaw = (v) => persist(san(v));

  return { orders, addOrder, updateOrd, removeOrd, setOrders: setOrdersRaw };
}