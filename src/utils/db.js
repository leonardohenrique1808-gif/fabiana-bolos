// src/utils/db.js
// ─────────────────────────────────────────────────────────────────
// Camada de dados: Firestore + localStorage como cache local.
// O app funciona offline (lê do cache) e sincroniza quando conectar.
// ─────────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Nomes das coleções no Firestore ───────────────────────────────
// "fab_orders"  → coleção "orders"
// "fab_clients" → coleção "clients"
// "fab_cfg"     → documento único "app/config"
// "fab_tipos"   → documento único "app/tipos"
// "fab_maintenance" → documento único "app/maintenance"

// ── Helpers internos de localStorage (cache) ──────────────────────
const LSget = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const LSset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ─────────────────────────────────────────────────────────────────
// PEDIDOS
// ─────────────────────────────────────────────────────────────────

/** Busca todos os pedidos do Firestore. Retorna array. */
export async function getOrders() {
  try {
    const snap = await getDocs(collection(db, "orders"));
    const orders = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    LSset("fab_orders", orders); // atualiza cache
    return orders;
  } catch {
    // offline → usa cache
    return LSget("fab_orders") ?? [];
  }
}

/** Salva ou atualiza um pedido. O id do pedido vira o id do documento. */
export async function saveOrder(order) {
  try {
    await setDoc(doc(db, "orders", String(order.id)), order);
    // atualiza cache local
    const cached = LSget("fab_orders") ?? [];
    const idx = cached.findIndex(o => String(o.id) === String(order.id));
    if (idx >= 0) cached[idx] = order; else cached.push(order);
    LSset("fab_orders", cached);
  } catch (e) {
    console.error("saveOrder error:", e);
  }
}

/** Salva múltiplos pedidos de uma vez (usado na sincronização inicial). */
export async function saveAllOrders(orders) {
  await Promise.all(orders.map(o => saveOrder(o)));
}

/** Remove um pedido. */
export async function deleteOrder(id) {
  try {
    await deleteDoc(doc(db, "orders", String(id)));
    const cached = (LSget("fab_orders") ?? []).filter(o => String(o.id) !== String(id));
    LSset("fab_orders", cached);
  } catch (e) {
    console.error("deleteOrder error:", e);
  }
}

/**
 * Listener em tempo real para pedidos.
 * Chama `callback(orders)` sempre que algo mudar no Firestore.
 * Retorna a função de unsubscribe.
 */
export function subscribeOrders(callback) {
  return onSnapshot(collection(db, "orders"), (snap) => {
    const orders = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    LSset("fab_orders", orders);
    callback(orders);
  }, (err) => {
    console.error("subscribeOrders error:", err);
    // em caso de erro, usa cache
    callback(LSget("fab_orders") ?? []);
  });
}

// ─────────────────────────────────────────────────────────────────
// CLIENTES
// ─────────────────────────────────────────────────────────────────

export async function getClients() {
  try {
    const snap = await getDocs(collection(db, "clients"));
    const clients = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    LSset("fab_clients", clients);
    return clients;
  } catch {
    return LSget("fab_clients") ?? [];
  }
}

export async function saveClient(client) {
  try {
    await setDoc(doc(db, "clients", String(client.id)), client);
    const cached = LSget("fab_clients") ?? [];
    const idx = cached.findIndex(c => String(c.id) === String(client.id));
    if (idx >= 0) cached[idx] = client; else cached.push(client);
    LSset("fab_clients", cached);
  } catch (e) {
    console.error("saveClient error:", e);
  }
}

export async function saveAllClients(clients) {
  await Promise.all(clients.map(c => saveClient(c)));
}

export function subscribeClients(callback) {
  return onSnapshot(collection(db, "clients"), (snap) => {
    const clients = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    LSset("fab_clients", clients);
    callback(clients);
  }, (err) => {
    console.error("subscribeClients error:", err);
    callback(LSget("fab_clients") ?? []);
  });
}

// ─────────────────────────────────────────────────────────────────
// CONFIGURAÇÕES (documento único: app/config)
// ─────────────────────────────────────────────────────────────────

export async function getCfg(defaultCfg) {
  try {
    const snap = await getDocs(collection(db, "app"));
    const cfgDoc = snap.docs.find(d => d.id === "config");
    if (cfgDoc) {
      const cfg = cfgDoc.data();
      LSset("fab_cfg", cfg);
      return cfg;
    }
    return LSget("fab_cfg") ?? defaultCfg;
  } catch {
    return LSget("fab_cfg") ?? defaultCfg;
  }
}

export async function saveCfg(cfg) {
  try {
    await setDoc(doc(db, "app", "config"), cfg);
    LSset("fab_cfg", cfg);
  } catch (e) {
    console.error("saveCfg error:", e);
    LSset("fab_cfg", cfg); // pelo menos salva local
  }
}

// ─────────────────────────────────────────────────────────────────
// TIPOS DE PRODUTO (documento único: app/tipos)
// ─────────────────────────────────────────────────────────────────

export async function getTipos(defaultTipos) {
  try {
    const snap = await getDocs(collection(db, "app"));
    const tiposDoc = snap.docs.find(d => d.id === "tipos");
    if (tiposDoc) {
      const { lista } = tiposDoc.data();
      LSset("fab_tipos", lista);
      return lista;
    }
    return LSget("fab_tipos") ?? defaultTipos;
  } catch {
    return LSget("fab_tipos") ?? defaultTipos;
  }
}

export async function saveTipos(tipos) {
  try {
    await setDoc(doc(db, "app", "tipos"), { lista: tipos });
    LSset("fab_tipos", tipos);
  } catch (e) {
    console.error("saveTipos error:", e);
    LSset("fab_tipos", tipos);
  }
}

// ─────────────────────────────────────────────────────────────────
// MODO MANUTENÇÃO (documento único: app/maintenance)
// ─────────────────────────────────────────────────────────────────

export async function getMaintenance() {
  try {
    const snap = await getDocs(collection(db, "app"));
    const mDoc = snap.docs.find(d => d.id === "maintenance");
    if (mDoc) {
      const { active } = mDoc.data();
      LSset("fab_maintenance", active);
      return active;
    }
    return LSget("fab_maintenance") ?? false;
  } catch {
    return LSget("fab_maintenance") ?? false;
  }
}

export async function saveMaintenance(active) {
  try {
    await setDoc(doc(db, "app", "maintenance"), { active });
    LSset("fab_maintenance", active);
  } catch (e) {
    console.error("saveMaintenance error:", e);
    LSset("fab_maintenance", active);
  }
}