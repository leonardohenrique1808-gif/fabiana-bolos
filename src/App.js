// src/App.js
import React, { useState, useEffect, useRef } from "react";
import { CSS, NOME_APP, DEFAULT_CFG, TIPOS_BASE, STATUS_UNICO, STATUS_LEGACY_MAP, WHATSAPP } from "./utils/constants";
import { san, getPrecoItem, fmtR, fmtDt, gerarChecksumPedido, sanitizeInput, obfClt, deobfClt, maskPh } from "./utils/helpers";

// ── Firebase ───────────────────────────────────────────────────────
import {
  subscribeOrders,
  subscribeClients,
  saveOrder,
  saveAllOrders,
  deleteOrder,
  saveClient,
  saveAllClients,
  getCfg,  saveCfg,
  getTipos, saveTipos,
  getMaintenance, saveMaintenance,
} from "./utils/db";

// ── Telas e componentes ────────────────────────────────────────────
import { Home }                 from "./screens/Home";
import { PedidoInfo }           from "./screens/PedidoInfo";
import { PedidoCart }           from "./screens/PedidoCart";
import { PedidoConfirm }        from "./screens/PedidoConfirm";
import { PedidoDoneScreen }     from "./screens/PedidoDone";
import { AdminPanel }           from "./screens/AdminPanel";
import { AdminLoginScreen }     from "./screens/AdminLogin";
import { ClientArea }           from "./screens/ClientArea";
import { ClientLoginScreen }    from "./screens/ClientLogin";
import { ClientRegisterScreen } from "./screens/ClientRegister";
import { KernelLoginScreen }    from "./screens/KernelLogin";
import { KernelPanel }          from "./screens/KernelPanel";
import { UpsellModal }          from "./components/UpsellModal";
import { LabelModal }           from "./components/LabelModal";
import { PinDlg }               from "./components/PinDlg";

export default function App() {
  // ── Estado principal ────────────────────────────────────────────
  const [cfg,             setCfgState]       = useState(san(DEFAULT_CFG));
  const [orders,          setOrders]         = useState([]);
  const [clients,         setClients]        = useState([]);
  const [clientUser,      setClientUser]     = useState(null);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [tipos,           setTiposState]     = useState(san(TIPOS_BASE));
  const [loading,         setLoading]        = useState(true);

  const TIPOS = tipos?.length ? tipos : TIPOS_BASE;

  // ── Wrappers que salvam no Firestore ao mudar estado ────────────
  const setCfg = (valOrFn) => {
    setCfgState(prev => {
      const next = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      saveCfg(next);
      return next;
    });
  };

  const setMaintenanceMode = (val) => {
    setMaintenanceModeState(val);
    saveMaintenance(val);
  };

  const setTipos = (valOrFn) => {
    setTiposState(prev => {
      const next = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      saveTipos(next);
      return next;
    });
  };

  // ── Carregamento inicial do Firebase ────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const [cfgData, tiposData, maintenance] = await Promise.all([
          getCfg(san(DEFAULT_CFG)),
          getTipos(san(TIPOS_BASE)),
          getMaintenance(),
        ]);
        setCfgState(cfgData);
        setTiposState(tiposData);
        setMaintenanceModeState(maintenance);

        // Sessão local do cliente (mantida no localStorage por segurança)
        const sessaoRaw = localStorage.getItem("fab_session");
        if (sessaoRaw) {
          try { setClientUser(deobfClt(JSON.parse(sessaoRaw))); } catch {}
        }
      } catch (e) {
        console.error("Erro ao carregar dados do Firebase:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ── Listeners em tempo real (pedidos e clientes) ────────────────
  useEffect(() => {
    const unsubOrders  = subscribeOrders(data => {
      const normalized = data.map(o => {
        if (!STATUS_UNICO.includes(o.status))
          o.status = STATUS_LEGACY_MAP[o.status?.toLowerCase()] || "Aguardando Caução";
        if (!o.checksum) o.checksum = gerarChecksumPedido(o);
        return o;
      });
      setOrders(normalized);
    });

    const unsubClients = subscribeClients(data => {
      setClients(data.map(deobfClt));
    });

    return () => {
      unsubOrders();
      unsubClients();
    };
  }, []);

  // ── Persiste sessão do cliente no localStorage ──────────────────
  useEffect(() => {
    try {
      if (clientUser) localStorage.setItem("fab_session", JSON.stringify(obfClt(clientUser)));
      else            localStorage.removeItem("fab_session");
    } catch {}
  }, [clientUser]);

  // ── Navegação ───────────────────────────────────────────────────
  const [screen, setScreen] = useState("home");

  // ── Pedido em construção ────────────────────────────────────────
  const [cart,     setCart]    = useState([]);
  const [pedInfo,  setPedInfo] = useState({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
  const [editIdx,  setEditIdx] = useState(null);
  const [addingIt, setAddingIt]= useState(false);
  const [dateErr,  setDateErr] = useState("");

  // ── Modais ──────────────────────────────────────────────────────
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [labelOrd,   setLabelOrd]   = useState(null);
  const [pinDlg,     setPinDlg]     = useState(null);
  const [doneData,   setDoneData]   = useState({ caucao: 0, wppUrl: "", total: null, saldo: null });

  // ── Segurança: lock admin ───────────────────────────────────────
  const [lockedUntil, setLockedUntil] = useState(() => {
    try { return Number(localStorage.getItem("fab_lockuntil") || 0); } catch { return 0; }
  });
  const [lockLeft,    setLockLeft]    = useState(0);
  const loginAttempts = useRef(0);
  const lastActivity  = useRef(Date.now());
  const autoLogoutRef = useRef(null);

  // ── Logo click (5→admin, 7→kernel) ─────────────────────────────
  const [clickCt,   setClickCt] = useState(0);
  const clickTimer              = useRef(null);
  const handleLogoClick = () => {
    setClickCt(p => {
      const n = p + 1;
      if (n >= 7) { setScreen("kernel-login"); clearTimeout(clickTimer.current); return 0; }
      if (n === 5) setScreen("admin-login");
      return n;
    });
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCt(0), 3000);
  };

  // ── Totais do carrinho ──────────────────────────────────────────
  const cartTotal        = cart.reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0);
  const isRegiaoRetirada = pedInfo.regiao?.isRetirada ?? false;
  const taxaReg          = isRegiaoRetirada ? 0 : Number(pedInfo.regiao?.taxa || 0);
  const cartFinal        = cartTotal + taxaReg;
  const cartCaucao       = Math.ceil(cartFinal * 0.5);
  const cartSaldo        = cartFinal - cartCaucao;

  // ── Lock timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!lockedUntil || Date.now() >= lockedUntil) return;
    const iv = setInterval(() => {
      const left = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLockLeft(Math.max(0, left));
      if (left <= 0) {
        setLockedUntil(0);
        try { localStorage.setItem("fab_lockuntil", "0"); } catch {}
        loginAttempts.current = 0;
        clearInterval(iv);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [lockedUntil]);

  // ── Auto-logout admin ───────────────────────────────────────────
  useEffect(() => {
    if (screen !== "admin") return;
    const track = () => { lastActivity.current = Date.now(); };
    window.addEventListener("click",      track);
    window.addEventListener("touchstart", track);
    autoLogoutRef.current = setInterval(() => {
      if (Date.now() - lastActivity.current > (15 * 60 * 1000)) setScreen("home");
    }, 30000);
    return () => {
      clearInterval(autoLogoutRef.current);
      window.removeEventListener("click",      track);
      window.removeEventListener("touchstart", track);
    };
  }, [screen]);

  // ── Helpers de pedido ───────────────────────────────────────────
  const resetPed = () => {
    setCart([]);
    setPedInfo({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
    setEditIdx(null);
    setAddingIt(false);
    setDateErr("");
  };

  // updateOrd: atualiza localmente e salva no Firebase
  const updateOrd = (id, patch) => {
    setOrders(p => {
      const next = san(p.map(o => {
        if (o.id !== id) return o;
        const upd = { ...o, ...patch };
        upd.freteManual = Number(upd.freteManual || 0);
        const totalItens = (upd.itens ?? []).reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0);
        const totalFinal = totalItens + Number(upd.regiao?.taxa || 0) + upd.freteManual;
        upd.valor   = totalFinal || null;
        upd.caucao  = totalFinal ? Math.ceil(totalFinal * 0.5) : null;
        upd.checksum = gerarChecksumPedido(upd);
        return upd;
      }));
      const updated = next.find(o => o.id === id);
      if (updated) saveOrder(updated);
      return next;
    });
  };

  // removeOrd: remove localmente e no Firebase
  const removeOrd = (id) => {
    setOrders(p => p.filter(o => o.id !== id));
    deleteOrder(id);
  };

  // ── Confirmar pedido ────────────────────────────────────────────
  const confirmarPedidoFinal = (extraItems = []) => {
    const upsellItems = extraItems.map(u => ({ tipo: "upsell", upsellId: u.id, nome: u.nome, desc: u.desc }));
    const allCart     = [...cart, ...upsellItems];
    const totalItens  = allCart.reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0);
    const totalFinal  = totalItens + taxaReg;
    const caucaoFinal = totalFinal ? Math.ceil(totalFinal * 0.5) : 0;
    const saldoFinal  = totalFinal - caucaoFinal;

    const nomeSan     = sanitizeInput(clientUser?.nome || "");
    const obsSan      = sanitizeInput(pedInfo.obs);
    const enderecoSan = sanitizeInput(pedInfo.enderecoEntrega || "");
    const novoId      = Date.now() + Math.floor(Math.random() * 1000);

    const novo = san({
      id:          novoId,
      clienteId:   clientUser?.id ?? null,
      nome:        nomeSan,
      telefone:    clientUser?.telefone ?? "",
      endereco:    enderecoSan,
      entrega:     pedInfo.entrega,
      hora:        pedInfo.hora || "",
      regiao:      pedInfo.regiao ?? null,
      obs:         obsSan,
      itens:       allCart,
      valor:       totalFinal || null,
      caucao:      caucaoFinal || null,
      freteManual: 0,
      status:      "Aguardando Caução",
      criadoEm:    new Date().toISOString(),
    });
    novo.checksum = gerarChecksumPedido(novo);

    // Salva no Firebase (listener vai atualizar o estado automaticamente)
    saveOrder(novo);

    // Atualiza histórico do cliente
    if (clientUser) {
      const clienteAtualizado = {
        ...clientUser,
        historico: [...(clientUser.historico ?? []), novo.id],
      };
      setClients(p => san(p.map(c => c.id === clientUser.id ? clienteAtualizado : c)));
      saveClient(obfClt(clienteAtualizado));
    }

    if (cfg.webhookUrl)
      try { fetch(cfg.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(san(novo)) }); } catch {}

    const wppTxt = encodeURIComponent(
      `Olá! Pedido 🎂\n👤 ${nomeSan}\n📅 ${fmtDt(pedInfo.entrega)}\n💰 Total: ${totalFinal ? fmtR(totalFinal) : "?"}\n💳 Caução: ${fmtR(caucaoFinal)}\n📌 SALDO: ${fmtR(saldoFinal)}`
    );

    setDoneData({ caucao: caucaoFinal, wppUrl: `https://wa.me/${WHATSAPP}?text=${wppTxt}`, total: totalFinal, saldo: saldoFinal });
    resetPed();
    setScreen("pedido-done");
  };

  // ── Tela de loading ─────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF0F8", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 36 }}>🎂</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#E91E8C", fontSize: 16 }}>Carregando...</div>
    </div>
  );

  // ── Modais globais ──────────────────────────────────────────────
  const GlobalModais = () => (<>
    {pinDlg    && <PinDlg   msg={pinDlg.msg} onOk={() => { pinDlg.onOk(); setPinDlg(null); }} onCancel={() => setPinDlg(null)} />}
    {labelOrd  && <LabelModal order={labelOrd} cfg={cfg} tipos={TIPOS} onClose={() => setLabelOrd(null)} />}
    {upsellOpen && <UpsellModal onAdd={ex => { setUpsellOpen(false); confirmarPedidoFinal(ex); }} onSkip={() => { setUpsellOpen(false); confirmarPedidoFinal([]); }} />}
  </>);

  // ── Roteamento ──────────────────────────────────────────────────
  if (screen === "admin-login")
    return <AdminLoginScreen
      onLogin={() => { loginAttempts.current = 0; lastActivity.current = Date.now(); setScreen("admin"); }}
      onBack={() => setScreen("home")}
      lockedUntil={lockedUntil}
      lockLeft={lockLeft}
    />;

  if (screen === "kernel-login")
    return <KernelLoginScreen
      onLogin={() => setScreen("kernel")}
      onBack={() => setScreen("home")}
      lockedUntil={lockedUntil}
      lockLeft={lockLeft}
    />;

  if (screen === "kernel")
    return <KernelPanel
      orders={orders}
      clients={clients}
      cfg={cfg}
      maintenanceMode={maintenanceMode}
      onSetMaintenance={setMaintenanceMode}
      onSetLicense={d => setCfg(c => san({ ...c, licenseExpiry: d }))}
      onSetOrders={v => { setOrders(san(v)); saveAllOrders(san(v)); }}
      onSetClients={v => { setClients(san(v)); saveAllClients(san(v).map(obfClt)); }}
      onSetCfg={v => setCfg(san(v))}
      onBack={() => setScreen("home")}
    />;

  if (screen === "client-login")
    return <ClientLoginScreen
      clients={clients}
      onLogin={c => { setClientUser(san(c)); setScreen("client-area"); }}
      onRegister={() => setScreen("client-register")}
      onBack={() => setScreen("home")}
    />;

  if (screen === "client-register")
    return <ClientRegisterScreen
      onSave={f => {
        const c = san({ id: Date.now(), ...f, historico: [], endereco: "" });
        setClients(p => san([...p, c]));
        saveClient(obfClt(c));
        setClientUser(c);
        setScreen("client-area");
      }}
      onBack={() => setScreen("client-login")}
    />;

  if (screen === "client-area" && clientUser)
    return <ClientArea
      clientUser={clientUser}
      orders={orders}
      tipos={TIPOS}
      cfg={cfg}
      maintenanceMode={maintenanceMode}
      onNovoPedido={() => setScreen("pedido-info")}
      onLogout={() => { setClientUser(null); setScreen("home"); }}
      onBack={() => setScreen("home")}
    />;

  if (screen === "pedido-done")
    return <PedidoDoneScreen
      caucao={doneData.caucao}
      wppUrl={doneData.wppUrl}
      total={doneData.total}
      saldo={doneData.saldo}
      hasClient={!!clientUser}
      onClientArea={() => setScreen("client-area")}
      onHome={() => setScreen("home")}
    />;

  if (screen === "pedido-info")
    return <PedidoInfo
      pedInfo={pedInfo}
      setPedInfo={setPedInfo}
      cfg={cfg}
      dateErr={dateErr}
      setDateErr={setDateErr}
      onBack={() => setScreen(clientUser ? "client-area" : "home")}
      onProximo={() => setScreen("pedido-cart")}
    />;

  if (screen === "pedido-cart")
    return <>
      <GlobalModais />
      <PedidoCart
        cart={cart}
        setCart={setCart}
        setScreen={setScreen}
        editIdx={editIdx}
        setEditIdx={setEditIdx}
        addingIt={addingIt}
        setAddingIt={setAddingIt}
        taxaReg={taxaReg}
        cartFinal={cartFinal}
        cartCaucao={cartCaucao}
        cartSaldo={cartSaldo}
        cfg={cfg}
        TIPOS={TIPOS}
      />
    </>;

  if (screen === "pedido-confirm")
    return <>
      <GlobalModais />
      <PedidoConfirm
        cart={cart}
        pedInfo={pedInfo}
        clientUser={clientUser}
        cfg={cfg}
        taxaReg={taxaReg}
        cartFinal={cartFinal}
        cartCaucao={cartCaucao}
        cartSaldo={cartSaldo}
        setScreen={setScreen}
        setUpsellOpen={setUpsellOpen}
        TIPOS={TIPOS}
      />
    </>;

  if (screen === "admin")
    return <>
      <GlobalModais />
      <AdminPanel
        orders={orders}
        setOrders={setOrders}
        updateOrd={updateOrd}
        removeOrd={removeOrd}
        cfg={cfg}
        setCfg={setCfg}
        tipos={tipos}
        setTipos={setTipos}
        TIPOS={TIPOS}
        clients={clients}
        maintenanceMode={maintenanceMode}
        setMaintenanceMode={setMaintenanceMode}
        setPinDlg={setPinDlg}
        setLabelOrd={setLabelOrd}
        onBack={() => setScreen("home")}
      />
    </>;

  // HOME (default)
  return <>
    <style>{CSS}</style>
    <GlobalModais />
    <Home
      NOME_APP={NOME_APP}
      cart={cart}
      clientUser={clientUser}
      maintenanceMode={maintenanceMode}
      setScreen={setScreen}
      onLogoClick={handleLogoClick}
      onPedido={() => {
        if (!clientUser) { setScreen("client-login"); return; }
        if (maintenanceMode) return;
        setScreen("pedido-info");
      }}
      onLogin={() => setScreen("client-login")}
      onAccount={() => clientUser ? setScreen("client-area") : setScreen("client-login")}
    />
  </>;
}