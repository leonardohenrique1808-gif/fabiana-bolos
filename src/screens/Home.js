import React from "react";

export function Home({ onLogin, onPedido, clientUser, cart, setScreen, NOME_APP }) {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FDF6FB", minHeight: "100vh" }}>
      <header style={{ background: "#fff", borderBottom: "2px solid #FFF0F8", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#E91E8C", cursor: "pointer" }}>
          {NOME_APP}
        </span>
        <div style={{ color: "#E91E8C", cursor: "pointer", fontWeight: "bold" }} onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null}>
          🛒 {cart.length}
        </div>
      </header>

      <div style={{ padding: "20px 18px" }}>
        <h2>{clientUser ? `Bem-vinda, ${clientUser.nome}` : "Bem-vinda!"}</h2>
        <br />
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={onPedido}
            style={{ flex: 1, padding: "12px", background: "#fff", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
          >
            🎂 Fazer Pedido
          </button>
          <button 
            onClick={onLogin}
            style={{ flex: 1, padding: "12px", background: "#fff", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
          >
            👤 Entrar
          </button>
        </div>

        {/* Botão discreto para acessar o Painel Administrativo */}
        <button 
          onClick={() => setScreen("admin")} 
          style={{ 
            background: "none", 
            border: "none", 
            color: "#ccc", 
            fontSize: 12, 
            marginTop: 40, 
            width: "100%", 
            cursor: "pointer" 
          }}
        >
          ⚙️ Admin
        </button>
      </div>
    </div>
  );
}