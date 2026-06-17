import React, { useState, useEffect } from "react";
// Utils & Constants
import { NOME_APP, CSS, DEFAULT_CFG, TIPOS_BASE } from "./utils/constants";
import { LS, san, getPrecoItem, fmtR, fmtDt, gerarChecksumPedido } from "./utils/helpers";

// Screens
import { Home } from "./screens/Home";
import { PedidoInfo } from "./screens/PedidoInfo";
import { PedidoCart } from "./screens/PedidoCart";
import { PedidoConfirm } from "./screens/PedidoConfirm";
import { PedidoDoneScreen } from "./screens/PedidoDone";
import { AdminPanel } from "./screens/AdminPanel"; // Novo: Painel Admin

// Components
import { UpsellModal } from "./components/UpsellModal";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [cart, setCart] = useState([]);
  
  // Persistência: Pedidos são carregados do localStorage ao iniciar
  const [orders, setOrders] = useState(() => LS.get("fab_orders") ?? []);
  
  const [pedInfo, setPedInfo] = useState({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
  const [cfg, setCfg] = useState(() => LS.get("fab_cfg") ?? san(DEFAULT_CFG));
  
  // Estados Extras para fluxo completo
  const [editIdx, setEditIdx] = useState(null);
  const [addingIt, setAddingIt] = useState(false);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [doneData, setDoneData] = useState({ caucao: 0, wppUrl: "", total: null, saldo: null });

  // Salva pedidos automaticamente sempre que a lista mudar
  useEffect(() => {
    LS.set("fab_orders", orders);
  }, [orders]);

  // Cálculos do Carrinho
  const cartTotal = cart.reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0);
  const taxaReg = pedInfo.regiao?.isRetirada ? 0 : Number(pedInfo.regiao?.taxa || 0);
  const cartFinal = cartTotal + taxaReg;
  const cartCaucao = Math.ceil(cartFinal * 0.5);
  const cartSaldo = cartFinal - cartCaucao;

  // Lógica de finalização de pedido
  const confirmarPedidoFinal = (extraItems = []) => {
    const upsellItems = extraItems.map(u => ({ tipo: "upsell", upsellId: u.id, nome: u.nome, desc: u.desc }));
    const allCart = [...cart, ...upsellItems];
    const totalItens = allCart.reduce((s, it) => s + (getPrecoItem(it, cfg.adicionalGourmet) ?? 0), 0);
    const totalFinal = totalItens + taxaReg;
    const caucaoFinal = totalFinal ? Math.ceil(totalFinal * 0.5) : 0;
    const saldoFinal = totalFinal ? totalFinal - caucaoFinal : 0;

    const novoPedido = san({
      id: Date.now(),
      nome: "Cliente",
      entrega: pedInfo.entrega,
      hora: pedInfo.hora,
      itens: allCart,
      valor: totalFinal,
      caucao: caucaoFinal,
      status: "Aguardando Caução",
      checksum: gerarChecksumPedido({ id: Date.now(), valor: totalFinal }),
      criadoEm: new Date().toISOString()
    });

    setOrders(p => [...p, novoPedido]);
    
    const wppTxt = encodeURIComponent(`Olá! Pedido 🎂\nData: ${fmtDt(pedInfo.entrega)}\nTotal: ${fmtR(totalFinal)}\nCaução: ${fmtR(caucaoFinal)}\nSALDO: ${fmtR(saldoFinal)}`);
    
    setDoneData({ caucao: caucaoFinal, wppUrl: `https://wa.me/5531999154485?text=${wppTxt}`, total: totalFinal, saldo: saldoFinal });
    
    setCart([]);
    setPedInfo({ entrega: "", hora: "", obs: "", regiao: null, enderecoEntrega: "" });
    setScreen("pedido-done");
  };

  return (
 <div className="App">
       <style>{CSS}</style>
       
       {upsellOpen && (
         <UpsellModal 
           onAdd={(extras) => { setUpsellOpen(false); confirmarPedidoFinal(extras); }} 
           onSkip={() => { setUpsellOpen(false); confirmarPedidoFinal([]); }} 
         />
       )}

       {screen === "home" && (
         <Home 
            NOME_APP={NOME_APP} 
            cart={cart} 
            setScreen={setScreen} 
            onPedido={() => setScreen("pedido-info")} 
            onLogin={() => setScreen("admin")} 
         />
       )}

       {screen === "pedido-info" && (
         <PedidoInfo pedInfo={pedInfo} setPedInfo={setPedInfo} onBack={() => setScreen("home")} onProximo={() => setScreen("pedido-cart")} />
       )}

       {screen === "pedido-cart" && (
         <PedidoCart cart={cart} setCart={setCart} setScreen={setScreen} editIdx={editIdx} setEditIdx={setEditIdx} addingIt={addingIt} setAddingIt={setAddingIt} taxaReg={taxaReg} cartFinal={cartFinal} cartCaucao={cartCaucao} cartSaldo={cartSaldo} cfg={cfg} TIPOS={TIPOS_BASE} />
       )}

       {screen === "pedido-confirm" && (
         <PedidoConfirm cart={cart} pedInfo={pedInfo} cfg={cfg} taxaReg={taxaReg} cartFinal={cartFinal} cartCaucao={cartCaucao} cartSaldo={cartSaldo} setScreen={setScreen} setUpsellOpen={setUpsellOpen} TIPOS={TIPOS_BASE} />
       )}

       {screen === "pedido-done" && (
         <PedidoDoneScreen {...doneData} onHome={() => setScreen("home")} />
       )}

       {screen === "admin" && (
         <AdminPanel orders={orders} setOrders={setOrders} cfg={cfg} onBack={() => setScreen("home")} />
       )}
  </div>
  );
}