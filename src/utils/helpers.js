import { PRECOS, ALL_G, PRECOS_MESTRES } from "./constants";

// ─── STORAGE E CACHE ──────────────────────────────────────────
export const LS = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
  check: () => { try { localStorage.setItem("_hc", "1"); return localStorage.getItem("_hc") === "1"; } catch { return false; } },
  usage: () => {
    try {
      let t = 0; const items = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith("fab_")) {
          const sz = (localStorage.getItem(k) || "").length * 2;
          t += sz;
          items.push({ k, sz: (sz / 1024).toFixed(1) + "KB" });
        }
      }
      return { totalKB: (t / 1024).toFixed(1), items };
    } catch { return { totalKB: "?", items: [] }; }
  },
};

// ─── OBFUSCAÇÃO E SEGURANÇA ───────────────────────────────────
export const obf = (s) => { try { return btoa(encodeURIComponent(s || "")); } catch { return s || ""; } };
export const deobf = (s) => { try { return decodeURIComponent(atob(s || "")); } catch { return s || ""; } };
export const obfClt = (c) => c ? { ...c, telefone: obf(c.telefone), aniversario: obf(c.aniversario || "") } : c;
export const deobfClt = (c) => c ? { ...c, telefone: deobf(c.telefone), aniversario: deobf(c.aniversario || "") } : c;
export const sanitizeInput = (text) => { if (!text) return ""; return String(text).replace(/[<>"'/]/g, ""); };

export const gerarChecksumPedido = (pedido) => {
  if (!pedido) return "";
  const dados = [
    pedido.id || "", pedido.nome || "", pedido.telefone || "",
    pedido.entrega || "", pedido.valor || 0, pedido.caucao || 0,
    pedido.status || "", JSON.stringify(pedido.itens || []),
  ].join("|");
  let hash = 0;
  for (let i = 0; i < dados.length; i++) {
    const char = dados.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
};

// ─── UTILITÁRIOS E FORMATAÇÃO ─────────────────────────────────
export const san = (d) => JSON.parse(JSON.stringify(d));
export const fmtR = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
export const fmtDt = (d) => { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day}/${m}/${y}`; };
export const today = () => new Date().toISOString().split("T")[0];
export const minDt = (h) => { const d = new Date(); d.setHours(d.getHours() + Number(h)); return d.toISOString().split("T")[0]; };

export const maskPh = (v) => {
  let r = v.replace(/\D/g, "").slice(0, 11);
  if (r.length > 10) return r.replace(/^(\d\d)(\d{5})(\d{4})/, "($1) $2-$3");
  if (r.length > 6) return r.replace(/^(\d\d)(\d{4})(\d{0,4})/, "($1) $2-$3");
  if (r.length > 2) return r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  return r;
};

// ─── REGRAS DE NEGÓCIO E DATAS ────────────────────────────────
export const isMonday = (s) => { const d = new Date(s + "T12:00:00"); return d.getDay() === 1; };
export const isTravada = (s, arr) => (arr || []).includes(s);

export const validateDate = (s, cfg) => {
  if (!s) return { ok: false, msg: "" };
  if (s < minDt(cfg.prazoMinHoras)) return { ok: false, msg: `⏰ Prazo mínimo ${cfg.prazoMinHoras}h. Disponível a partir de ${fmtDt(minDt(cfg.prazoMinHoras))}` };
  if (isMonday(s)) return { ok: false, msg: "❌ Não atendemos às segundas-feiras" };
  if (isTravada(s, cfg.datasTravadas)) return { ok: false, msg: "❌ Data bloqueada — indisponível" };
  return { ok: true, msg: "" };
};

export const isSinalPago = (status) => ["Confirmado","Em Produção","Pronto para Entrega/Retirada","Finalizado"].includes(status);
export const calcPontos = (cId, orders) => Math.floor(orders.filter(o => o.clienteId === cId && o.status !== "Cancelado").reduce((s, o) => s + Number(o.valor || 0), 0));

// ─── MOTOR DE PRECIFICAÇÃO (O CÉREBRO) ────────────────────────
export const calcItem = (it, gAdic = 0) => {
  if (!it.tipo) return null;
  if (it.tipo === "upsell") return null;
  
  let b = null;
  if (it.tipo === "bento") b = PRECOS.bento[it.bentoTipo ?? "tradicional"] ?? 50;
  else if (it.tipo === "docinhos") b = PRECOS.docinhos[it.subtipo ?? "tradicional"]?.[Number(it.quantidade ?? 50)] ?? null;
  else b = PRECOS[it.tipo]?.[it.formato ?? "redondo"]?.[Number(it.fatias)] ?? null;
  
  if (b === null) return null;
  
  const g = (ALL_G.includes(it.recheio1) ? 1 : 0) + (ALL_G.includes(it.recheio2) ? 1 : 0);
  return b + g * Number(gAdic);
};

export const getPrecoItem = (item, adicionalGourmet = 0) => {
  if (!item || !item.tipo) return null;
  if (item.tipo === "upsell" && item.upsellId) return PRECOS_MESTRES.upsell[item.upsellId] ?? null;
  return calcItem(item, adicionalGourmet);
};