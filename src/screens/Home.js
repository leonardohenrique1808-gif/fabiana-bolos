import React from "react";

export function Home({ onLogin, onPedido, clientUser, cart, setScreen, NOME_APP }) {
  const produtos = [
    { nome: "Red Velvet", preco: "5,50" },
    { nome: "Chocolate", preco: "12,00" },
    { nome: "Fruit Cake", preco: "8,00" }
  ];

  return (
    <div style={{ 
      fontFamily: "'Nunito', sans-serif", 
      background: "#FFFBF9", // Fundo creme suave premium
      minHeight: "100vh", 
      paddingBottom: "100px",
      position: "relative"
    }}>
      
      {/* Cabeçalho */}
      <header style={{ 
        padding: "25px 20px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#D4A5A5", margin: 0 }}>{NOME_APP}</h1>
        <div onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null} 
             style={{ fontSize: 22, color: "#5D4037", cursor: "pointer" }}>🛒</div>
      </header>

      <div style={{ padding: "0 20px" }}>
        
        {/* Destaques */}
        <h3 style={{ color: "#5D4037", marginBottom: "15px", fontSize: "18px" }}>Bolos Mais Pedidos</h3>
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "20px" }}>
          {produtos.map((p, i) => (
            <div key={i} style={{ 
              minWidth: "130px", background: "#fff", padding: "15px", borderRadius: "20px", 
              textAlign: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
              border: "1px solid #FDF0EF"
            }}>
              <div style={{ background: "#FDF0EF", height: "80px", borderRadius: "15px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🍰</div>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "5px 0", color: "#4A148C" }}>{p.nome}</p>
              <span style={{ fontWeight: "bold", color: "#D81B60", fontSize: "14px" }}>R$ {p.preco}</span>
            </div>
          ))}
        </div>

        {/* Área Principal - O Design da Imagem */}
        <div style={{ 
          marginTop: "40px", 
          background: "white", 
          padding: "30px 20px", 
          borderRadius: "40px 40px 0 0", 
          boxShadow: "0 -10px 30px rgba(0,0,0,0.03)",
          display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          
          <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginBottom: "20px" }}>
             {/* Botão Registrar */}
             <div onClick={() => alert("Cadastro")} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ background: "#FDF0EF", width: "65px", height: "65px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", fontSize: "20px" }}>👤</div>
                <p style={{ fontSize: "12px", color: "#8D6E63", fontWeight: "600" }}>Registrar</p>
             </div>

             {/* Fazer Pedido - Botão Destaque */}
             <button onClick={onPedido} style={{ 
               width: "140px", height: "140px", borderRadius: "50%", 
               background: "linear-gradient(135deg, #FFB7C5, #E91E63)", 
               color: "#fff", border: "none", fontSize: "16px", fontWeight: "bold", 
               cursor: "pointer", boxShadow: "0 15px 30px rgba(233, 30, 99, 0.3)",
               marginTop: "-70px", // Esse margin negativo faz ele "sobrepor" o layout
               display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px"
             }}>
               <span>🎂</span> Fazer Pedido
             </button>

             {/* Botão Login */}
             <div onClick={onLogin} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ background: "#FDF0EF", width: "65px", height: "65px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", fontSize: "20px" }}>🔐</div>
                <p style={{ fontSize: "12px", color: "#8D6E63", fontWeight: "600" }}>Login</p>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Fixo */}
      <footer style={{ 
        position: "fixed", bottom: 0, width: "100%", 
        background: "#fff", display: "flex", justifyContent: "space-around", 
        padding: "20px 0", borderTop: "1px solid #eee",
        borderRadius: "20px 20px 0 0" 
      }}>
        <span>🏠</span> <span>☰</span> <span>👤</span> <span>🛒</span>
      </footer>

      {/* Admin Discreto */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button onClick={() => setScreen("admin")} style={{ 
          background: "none", border: "1px solid #D81B60", 
          borderRadius: "20px", padding: "5px 15px", color: "#D81B60", cursor: "pointer", fontSize: "10px" 
        }}>
          ⚙️ Painel Admin
        </button>
      </div>
    </div>
  );
}