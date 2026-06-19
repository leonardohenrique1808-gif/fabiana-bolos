// src/App.js  ── versão refatorada ──────────────────────────────
import React, { useState, useEffect, useRef } from "react";

import { CSS, NOME_APP, TIPOS_BASE, WHATSAPP } from "./utils/constants";
import { LS, san, getPrecoItem, fmtR, fmtDt,
         gerarChecksumPedido, sanitizeInput, obfClt, deobfClt } from "./utils/helpers";

// Custom hooks
import { useOrders   } from "./hooks/useOrders";
import { useClients  } from "./hooks/useClients";
import { useCart     } from "./hooks/useCart";
import { useSettings } from "./hooks/useSettings";

// Telas
import { Home                } from "./screens/Home";
import { PedidoInfo          } from "./screens/PedidoInfo";
import { PedidoCart          } from "./screens/PedidoCart";
import { PedidoConfirm       } from "./screens/PedidoConfirm";
import { PedidoDoneScreen    } from "./screens/PedidoDone";
import { AdminPanel          } from "./screens/AdminPanel";
import { AdminLoginScreen    } from "./screens/AdminLogin";
import { ClientArea          } from "./screens/ClientArea";
import { ClientLoginScreen   } from "./screens/ClientLogin";
import { ClientRegisterScreen} from "./screens/ClientRegister";
import { KernelLoginScreen   } from "./screens/KernelLogin";
import { KernelPanel         } from "./screens/KernelPanel";

// Componentes globais
import { UpsellModal } from "./components/UpsellModal";
import { LabelModal  } from "./components/LabelModal";
import { PinDlg      } from "./components/PinDlg";

export default function App() {
  // ── Hooks de domínio ─────────────────────────────────────────
  const { cfg, setCfg }                         = useSettings();
  const { orders, addOrder, updateOrd, removeOrd, setOrders } = useOrders(cfg.adicionalGourmet);
  const { clients, addClient, preRegisterClient, updateClient, setClients } = useClients();
  const { cart, setCart, editIdx, setEditIdx, addingIt, setAddingIt,
          calcTotals, resetCart }               = useCart(cfg.adicionalGourmet);

  // ── Estado local de navegação/sessão ─────────────────────────
  const [screen,      setScreen]     = useState("home");
  const [clientUser,  setClientUser] = useState(() => {
    const s = LS.get("fab_session"); return s ? deobfClt(s) : null;
  });
  const [maintenanceMode, setMaintenanceMode] = useState(() => LS.get("fab_maintenance") ?? false);
  const [tipos,  setTipos]  = useState(() => LS.get("fab_tipos") ?? san(TIPOS_BASE));
  const TIPOS = tipos?.length ? tipos : TIPOS_BASE;

  // ── Pedido em construção ──────────────────────────────────────
  const [pedInfo, setPedInfo] = useState({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
  const [dateErr, setDateErr] = useState("");

  // ── Modais ────────────────────────────────────────────────────
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [labelOrd,   setLabelOrd]   = useState(null);
  const [pinDlg,     setPinDlg]     = useState(null);
  const [doneData,   setDoneData]   = useState({ caucao: 0, wppUrl: "", total: null, saldo: null });

  // ── Segurança: lock admin ─────────────────────────────────────
  const [lockedUntil, setLockedUntil] = useState(() => LS.get("fab_lockuntil") ?? 0);
  const [lockLeft,    setLockLeft]    = useState(0);
  const loginAttempts = useRef(0);
  const lastActivity  = useRef(Date.now());
  const autoLogoutRef = useRef(null);

  // ── Logo click (5→admin, 7→kernel) ───────────────────────────
  const [clickCt, setClickCt] = useState(0);
  const clickTimer = useRef(null);
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

  // ── Totais do carrinho ────────────────────────────────────────
  const taxaReg = pedInfo.regiao?.isRetirada ? 0 : Number(pedInfo.regiao?.taxa || 0);
  const { cartFinal, cartCaucao, cartSaldo } = calcTotals(taxaReg);

  // ── Persistência ─────────────────────────────────────────────
  useEffect(() => { LS.set("fab_maintenance", maintenanceMode); }, [maintenanceMode]);
  useEffect(() => { LS.set("fab_tipos", tipos); },               [tipos]);
  useEffect(() => {
    try {
      if (clientUser) localStorage.setItem("fab_session", JSON.stringify(obfClt(clientUser)));
      else            localStorage.removeItem("fab_session");
    } catch {}
  }, [clientUser]);

  // ── Lock timer ────────────────────────────────────────────────
  useEffect(() => {
    if (!lockedUntil || Date.now() >= lockedUntil) return;
    const iv = setInterval(() => {
      const left = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLockLeft(Math.max(0, left));
      if (left <= 0) { setLockedUntil(0); LS.set("fab_lockuntil", 0); loginAttempts.current = 0; clearInterval(iv); }
    }, 1000);
    return () => clearInterval(iv);
  }, [lockedUntil]);

  // ── Auto-logout admin (15 min) ────────────────────────────────
  useEffect(() => {
    if (screen !== "admin") return;
    const track = () => { lastActivity.current = Date.now(); };
    window.addEventListener("click",      track);
    window.addEventListener("touchstart", track);
    autoLogoutRef.current = setInterval(() => {
      if (Date.now() - lastActivity.current > 15 * 60 * 1000) setScreen("home");
    }, 30000);
    return () => {
      clearInterval(autoLogoutRef.current);
      window.removeEventListener("click",      track);
      window.removeEventListener("touchstart", track);
    };
  }, [screen]);

  // ── Helper: reset pedido ──────────────────────────────────────
  const resetPed = () => {
    resetCart();
    setPedInfo({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
    setDateErr("");
  };

  // ── Confirmar pedido ──────────────────────────────────────────
  const confirmarPedidoFinal = (extraItems = []) => {
    if (!LS.check()) return;
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
      id: novoId, clienteId: clientUser?.id ?? null,
      nome: nomeSan, telefone: clientUser?.telefone ?? "",
      endereco: enderecoSan, entrega: pedInfo.entrega,
      hora: pedInfo.hora || "", regiao: pedInfo.regiao ?? null,
      obs: obsSan, itens: allCart,
      valor: totalFinal || null, caucao: caucaoFinal || null,
      freteManual: 0, status: "Aguardando Caução",
      criadoEm: new Date().toISOString(),
    });
    novo.checksum = gerarChecksumPedido(novo);

    addOrder(novo);

    if (clientUser) {
      updateClient(clientUser.id, {
        historico: [...(clientUser.historico ?? []), novo.id],
      });
    }

    if (cfg.webhookUrl)
      try { fetch(cfg.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(san(novo)) }); } catch {}

    // ── Monta mensagem WhatsApp com template dinâmico ───────────
    const template = cfg.wppTemplate ||
      "Olá {NOME}! 🎂\n📅 {DATA_ENTREGA}\n💰 Total: {TOTAL}\n💳 Caução: {CAUCAO}\n📌 Saldo: {SALDO}";

    const wppMsg = template
      .replace(/{NOME}/g,          nomeSan)
      .replace(/{TOTAL}/g,         totalFinal ? fmtR(totalFinal) : "?")
      .replace(/{CAUCAO}/g,        fmtR(caucaoFinal))
      .replace(/{SALDO}/g,         fmtR(saldoFinal))
      .replace(/{DATA_ENTREGA}/g,  fmtDt(pedInfo.entrega));

    const wppUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(wppMsg)}`;

    setDoneData({
      caucao:  caucaoFinal,
      wppUrl,
      total:   totalFinal,
      saldo:   saldoFinal,
      pixLink: cfg.pixLink  || "",
      cardLink:cfg.cardLink || "",
    });
    resetPed();
    setScreen("pedido-done");
  };

  // ── Modais globais ────────────────────────────────────────────
  const GlobalModais = () => (<>
    {pinDlg    && <PinDlg   msg={pinDlg.msg} onOk={() => { pinDlg.onOk(); setPinDlg(null); }} onCancel={() => setPinDlg(null)} />}
    {labelOrd  && <LabelModal order={labelOrd} cfg={cfg} tipos={TIPOS} onClose={() => setLabelOrd(null)} />}
    {upsellOpen && <UpsellModal onAdd={ex => { setUpsellOpen(false); confirmarPedidoFinal(ex); }} onSkip={() => { setUpsellOpen(false); confirmarPedidoFinal([]); }} />}
  </>);

  // ── Roteamento com switch/case ────────────────────────────────
  const renderScreen = () => {
    switch (screen) {

      case "admin-login":
        return <AdminLoginScreen
          onLogin={() => { loginAttempts.current = 0; lastActivity.current = Date.now(); setScreen("admin"); }}
          onBack={() => setScreen("home")}
          lockedUntil={lockedUntil}
          lockLeft={lockLeft}
        />;

      case "kernel-login":
        return <KernelLoginScreen
          onLogin={() => setScreen("kernel")}
          onBack={() => setScreen("home")}
          lockedUntil={lockedUntil}
          lockLeft={lockLeft}
        />;

      case "kernel":
        return <KernelPanel
          orders={orders} clients={clients} cfg={cfg}
          maintenanceMode={maintenanceMode}
          onSetMaintenance={setMaintenanceMode}
          onSetLicense={d => setCfg(c => san({ ...c, licenseExpiry: d }))}
          onSetOrders={v => setOrders(san(v))}
          onSetClients={v => setClients(san(v))}
          onSetCfg={v => setCfg(san(v))}
          onBack={() => setScreen("home")}
        />;

      case "client-login":
        return <ClientLoginScreen
          clients={clients}
          onLogin={c => { setClientUser(san(c)); setScreen("client-area"); }}
          onRegister={() => setScreen("client-register")}
          onBack={() => setScreen("home")}
        />;

      case "client-register":
        return <ClientRegisterScreen
          clients={clients}
          onSave={dados => {
            const c = addClient(dados);
            setClientUser(c);
            setScreen("client-area");
          }}
          onBack={() => setScreen("client-login")}
        />;

      case "client-area":
        return clientUser
          ? <ClientArea
              clientUser={clientUser} orders={orders} tipos={TIPOS} cfg={cfg}
              maintenanceMode={maintenanceMode}
              onNovoPedido={() => setScreen("pedido-info")}
              onLogout={() => { setClientUser(null); setScreen("home"); }}
              onBack={() => setScreen("home")}
            />
          : null;  // redireciona no default (home)

      case "pedido-done":
        return <PedidoDoneScreen
          caucao={doneData.caucao}  wppUrl={doneData.wppUrl}
          total={doneData.total}    saldo={doneData.saldo}
          pixLink={doneData.pixLink} cardLink={doneData.cardLink}
          hasClient={!!clientUser}
          onClientArea={() => setScreen("client-area")}
          onHome={() => setScreen("home")}
        />;

      case "pedido-info":
        return <PedidoInfo
          pedInfo={pedInfo} setPedInfo={setPedInfo} cfg={cfg}
          dateErr={dateErr} setDateErr={setDateErr}
          onBack={() => setScreen(clientUser ? "client-area" : "home")}
          onProximo={() => setScreen("pedido-cart")}
        />;

      case "pedido-cart":
        return <>
          <GlobalModais />
          <PedidoCart
            cart={cart} setCart={setCart} setScreen={setScreen}
            editIdx={editIdx} setEditIdx={setEditIdx}
            addingIt={addingIt} setAddingIt={setAddingIt}
            taxaReg={taxaReg} cartFinal={cartFinal}
            cartCaucao={cartCaucao} cartSaldo={cartSaldo}
            cfg={cfg} TIPOS={TIPOS}
          />
        </>;

      case "pedido-confirm":
        return <>
          <GlobalModais />
          <PedidoConfirm
            cart={cart} pedInfo={pedInfo} clientUser={clientUser} cfg={cfg}
            taxaReg={taxaReg} cartFinal={cartFinal}
            cartCaucao={cartCaucao} cartSaldo={cartSaldo}
            setScreen={setScreen} setUpsellOpen={setUpsellOpen} TIPOS={TIPOS}
          />
        </>;

      case "admin":
        return <>
          <GlobalModais />
          <AdminPanel
            orders={orders} setOrders={setOrders}
            updateOrd={updateOrd} removeOrd={removeOrd}
            cfg={cfg} setCfg={setCfg}
            tipos={tipos} setTipos={setTipos} TIPOS={TIPOS}
            clients={clients}
            onPreRegisterClient={preRegisterClient}
            maintenanceMode={maintenanceMode} setMaintenanceMode={setMaintenanceMode}
            setPinDlg={setPinDlg} setLabelOrd={setLabelOrd}
            onBack={() => setScreen("home")}
          />
        </>;

      // HOME (default)
      default:
        return <>
          <style>{CSS}</style>
          <GlobalModais />
          <Home
            NOME_APP={NOME_APP} cart={cart} clientUser={clientUser}
            maintenanceMode={maintenanceMode} setScreen={setScreen}
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
  };

  return <div className="App">{renderScreen()}</div>;
}