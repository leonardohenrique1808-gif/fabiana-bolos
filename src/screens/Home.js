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
      background: "#FFF8F6", // Tom de creme quente e acolhedor
      minHeight: "100vh", 
      paddingBottom: "120px",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* Cabeçalho */}
      <header style={{ padding: "40px 20px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
           <p style={{ margin: 0, fontSize: "12px", color: "#A1887F" }}>Bem-vindo(a)!</p>
           <h1 style={{ fontSize: 24, fontWeight: 900, color: "#5D4037", margin: 0 }}>Fabiana Bolos</h1>
        </div>
        <div onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null} 
             style={{ background: "#fff", padding: "10px", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>🛒</div>
      </header>

      {/* Carrossel de Produtos */}
      <div style={{ padding: "0 20px 30px 20px" }}>
        <h3 style={{ color: "#5D4037", marginBottom: "15px", fontSize: "16px" }}>Bolos Mais Pedidos</h3>
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
          {produtos.map((p, i) => (
            <div key={i} style={{ 
              minWidth: "140px", background: "#fff", padding: "15px", borderRadius: "20px", 
              textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.03)"
            }}>
              <div style={{ background: "#FDF0EF", height: "70px", borderRadius: "15px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🍰</div>
              <p style={{ fontSize: "12px", fontWeight: "700", margin: "5px 0", color: "#5D4037" }}>{p.nome}</p>
              <span style={{ fontWeight: "800", color: "#D81B60", fontSize: "13px" }}>R$ {p.preco}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cluster de Ações - O Design da Imagem */}
      <div style={{ 
        flex: 1,
        background: "white", 
        padding: "40px 20px 20px 20px", 
        borderRadius: "40px 40px 0 0", 
        boxShadow: "0 -10px 30px rgba(0,0,0,0.03)",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        
        {/* Linha de botões */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%", maxWidth: "400px" }}>
             
             {/* Registrar */}
             <div onClick={() => setScreen("registro")} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ background: "#FDF0EF", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>👤</div>
                <p style={{ fontSize: "11px", color: "#5D4037", fontWeight: "600" }}>Registrar</p>
             </div>

             {/* Fazer Pedido (Botão Flutuante) */}
             <button onClick={onPedido} style={{ 
               width: "120px", height: "120px", borderRadius: "50%", 
               background: "linear-gradient(135deg, #FFB7C5, #E91E63)", 
               color: "#fff", border: "none", fontSize: "14px", fontWeight: "bold", 
               cursor: "pointer", boxShadow: "0 10px 20px rgba(233, 30, 99, 0.3)",
               marginTop: "-80px", // Efeito de sobreposição
               display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
             }}>
               <span>🎂</span> Pedir
             </button>

             {/* Login */}
             <div onClick={onLogin} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ background: "#FDF0EF", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>🔐</div>
                <p style={{ fontSize: "11px", color: "#5D4037", fontWeight: "600" }}>Login</p>
             </div>
        </div>

        {/* Acesso Administrativo (Bem abaixo, separado) */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <button onClick={() => setScreen("admin")} style={{ 
            background: "transparent", border: "1px solid #D4A5A5", 
            borderRadius: "15px", padding: "8px 20px", color: "#D4A5A5", cursor: "pointer", fontSize: "12px",
            fontWeight: "500"
          }}>
            ⚙️ Painel Administrativo
          </button>
        </div>
      </div>

      {/* Nav Inferior */}
      <footer style={{ 
        position: "fixed", bottom: 0, width: "100%", 
        background: "#fff", display: "flex", justifyContent: "space-around", 
        padding: "15px 0", borderTop: "1px solid #eee",
        fontSize: "24px"
      }}>
        <span>🏠</span> <span>☰</span> <span>👤</span> <span>🛒</span>
      </footer>
    </div>
  );
}