import React from "react";

export function Home({ onLogin, onPedido, clientUser, cart, setScreen, NOME_APP }) {
  // Dados simulados para os cards (você pode carregar isso dinamicamente depois)
  const produtos = [
    { nome: "Red Velvet", preco: "5,50" },
    { nome: "Chocolate", preco: "12,00" },
    { nome: "Fruit Cake", preco: "8,00" }
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FDF6FB", minHeight: "100vh", paddingBottom: "80px" }}>
      
      {/* Cabeçalho */}
      <header style={{ background: "#fff", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#E91E8C", margin: 0 }}>{NOME_APP}</h1>
        <div onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null} style={{ fontSize: 20 }}>🛒 {cart.length}</div>
      </header>

      <div style={{ padding: "20px" }}>
        {/* Seção de Destaques */}
        <h3 style={{ color: "#5D4037" }}>Bolos Mais Pedidos</h3>
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
          {produtos.map((p, i) => (
            <div key={i} style={{ minWidth: "120px", background: "#fff", padding: "10px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ background: "#eee", height: "80px", borderRadius: "10px", marginBottom: "5px" }}>🍰</div>
              <p style={{ fontSize: 12, margin: "5px 0" }}>{p.nome}</p>
              <span style={{ fontWeight: "bold", fontSize: 14 }}>R$ {p.preco}</span>
            </div>
          ))}
        </div>

        {/* Área Principal de Ações */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px", gap: "20px" }}>
          
          <div style={{ display: "flex", width: "100%", gap: "10px", justifyContent: "center" }}>
            <button onClick={() => alert("Cadastro")} style={{ padding: "10px 20px", borderRadius: "20px", border: "none", background: "#f8bbd0", color: "#880e4f", cursor: "pointer" }}>Registrar</button>
            <button onClick={onLogin} style={{ padding: "10px 20px", borderRadius: "20px", border: "none", background: "#f8bbd0", color: "#880e4f", cursor: "pointer" }}>Login</button>
          </div>

          <button 
            onClick={onPedido}
            style={{ 
              width: "180px", height: "180px", borderRadius: "50%", 
              background: "linear-gradient(135deg, #FF80AB, #E91E63)", 
              color: "#fff", border: "none", fontSize: "18px", fontWeight: "bold", 
              cursor: "pointer", boxShadow: "0 10px 20px rgba(233, 30, 99, 0.3)",
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
            }}
          >
            🎂 Fazer Pedido
          </button>
        </div>
      </div>

      {/* Menu Inferior (Navigation Bar) */}
      <footer style={{ position: "fixed", bottom: 0, width: "100%", background: "#fff", display: "flex", justifyContent: "space-around", padding: "15px 0", borderTop: "1px solid #eee" }}>
        <span style={{ fontSize: 20 }}>🏠</span>
        <span style={{ fontSize: 20 }}>☰</span>
        <span style={{ fontSize: 20 }}>👤</span>
        <span style={{ fontSize: 20 }}>🛒</span>
      </footer>

      {/* Admin discreto */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => setScreen("admin")} style={{ background: "none", border: "none", color: "#ccc", fontSize: 10 }}>⚙️ Acesso Admin</button>
      </div>
    </div>
  );
}