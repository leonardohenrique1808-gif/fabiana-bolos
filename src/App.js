import React, { useState, useEffect } from "react";
import { NOME_APP, CSS, DEFAULT_CFG, TIPOS_BASE } from "./utils/constants";
import { LS, san, getPrecoItem, fmtR, fmtDt, gerarChecksumPedido } from "./utils/helpers";

import { Home } from "./screens/Home";
import { PedidoInfo } from "./screens/PedidoInfo";
import { PedidoCart } from "./screens/PedidoCart";
import { PedidoConfirm } from "./screens/PedidoConfirm";
import { PedidoDoneScreen } from "./screens/PedidoDone";
import { AdminPanel } from "./screens/AdminPanel";
import { ClientRegisterScreen } from "./screens/ClientRegister";
import { ClientLoginScreen } from "./screens/ClientLogin";
import { UpsellModal } from "./components/UpsellModal";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [cart, setCart] = useState([]);
  
  // Estados para Usuários e Login
  const [orders, setOrders] = useState(() => LS.get("fab_orders") ?? []);
  const [clients, setClients] = useState(() => LS.get("fab_clients") ?? []);
  const [clientUser, setClientUser] = useState(() => LS.get("fab_active_user") ?? null);
  
  const [pedInfo, setPedInfo] = useState({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
  const [cfg, setCfg] = useState(() => LS.get("fab_cfg") ?? san(DEFAULT_CFG));
  
  const [editIdx, setEditIdx] = useState(null);
  const [addingIt, setAddingIt] = useState(false);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [doneData, setDoneData] = useState({ caucao: 0, wppUrl: "", total: null, saldo: null });

  useEffect(() => { LS.set("fab_orders", orders); }, [orders]);
  useEffect(() => { LS.set("fab_clients", clients); }, [clients]);
  useEffect(() => { LS.set("fab_active_user", clientUser); }, [clientUser]);

  const cartTotal = cart.reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0);
  const taxaReg = pedInfo.regiao?.isRetirada ? 0 : Number(pedInfo.regiao?.taxa || 0);
  const cartFinal = cartTotal + taxaReg;

  const confirmarPedidoFinal = (extraItems = []) => {
    const allCart = [...cart, ...extraItems.map(u => ({ tipo: "upsell", upsellId: u.id, nome: u.nome, desc: u.desc }))];
    const totalFinal = allCart.reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0) + taxaReg;
    
    const novoPedido = san({
      id: Date.now(),
      nome: clientUser?.nome || "Cliente",
      itens: allCart,
      valor: totalFinal,
      status: "Aguardando Caução",
      criadoEm: new Date().toISOString()
    });

    setOrders(p => [...p, novoPedido]);
    setCart([]);
    setScreen("pedido-done");
  };

  return (
    <div className="App">
       <style>{CSS}</style>
       
       {upsellOpen && (
         <UpsellModal onAdd={(ex) => { setUpsellOpen(false); confirmarPedidoFinal(ex); }} onSkip={() => { setUpsellOpen(false); confirmarPedidoFinal([]); }} />
       )}

       {screen === "home" && (
         <Home 
            NOME_APP={NOME_APP} 
            cart={cart} 
            clientUser={clientUser}
            setScreen={setScreen} 
            onLogout={() => setClientUser(null)}
            onPedido={() => {
                if (!clientUser) {
                    alert("Por favor, faça login ou crie uma conta para pedir!");
                    setScreen("client-login");
                } else {
                    setScreen("pedido-info");
                }
            }} 
            onLogin={() => setScreen("client-login")} 
         />
       )}

       {screen === "client-register" && (
         <ClientRegisterScreen 
            onSave={(c) => { setClients([...clients, c]); setClientUser(c); setScreen("home"); }}
            onBack={() => setScreen("home")} 
         />
       )}

       {screen === "client-login" && (
         <ClientLoginScreen 
            clients={clients}
            onLogin={(c) => { setClientUser(c); setScreen("home"); }}
            onRegister={() => setScreen("client-register")}
            onBack={() => setScreen("home")}
         />
       )}

       {screen === "pedido-info" && (<PedidoInfo pedInfo={pedInfo} setPedInfo={setPedInfo} onBack={() => setScreen("home")} onProximo={() => setScreen("pedido-cart")} />)}
       {screen === "pedido-cart" && (<PedidoCart cart={cart} setCart={setCart} setScreen={setScreen} />)}
       {screen === "pedido-done" && (<PedidoDoneScreen onHome={() => setScreen("home")} />)}
       {screen === "admin" && (<AdminPanel orders={orders} setOrders={setOrders} onBack={() => setScreen("home")} />)}
    </div>
  );
}