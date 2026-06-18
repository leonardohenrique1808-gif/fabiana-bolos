import React from "react";

export function Home({ onLogin, onPedido, clientUser, cart, setScreen, NOME_APP }) {
  const produtos = [
    { nome: "Red Velvet", preco: "5,50" },
    { nome: "Brigadeiro", preco: "6,00" },
    { nome: "Leite Ninho", preco: "6,00" }
  ];

  return (
    <div style={{ 
      fontFamily: "'Nunito', sans-serif", 
      background: "#FFF9F2",
      minHeight: "100vh", 
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      
      <header style={{ padding: "40px 20px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
           <p style={{ margin: 0, fontSize: "14px", color: "#D89A9E", fontWeight: "bold" }}>Bem-vindo(a)!</p>
           <h1 style={{ fontSize: 26, fontWeight: 900, color: "#4A2C2A", margin: 0, fontFamily: "serif" }}>{NOME_APP}</h1>
        </div>
        <div onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null} 
             style={{ background: "#fff", padding: "10px", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", cursor: "pointer", fontSize: "20px" }}>
          🛒
        </div>
      </header>

      <div style={{ padding: "0 20px 20px 20px", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ color: "#4A2C2A", fontSize: "16px", margin: 0 }}>Bolos Mais Pedidos</h3>
            <span style={{ fontSize: "12px", color: "#A1887F", fontWeight: "bold" }}>Delícias do Dia</span>
        </div>
        
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
          {produtos.map((p, i) => (
            <div key={i} style={{ 
              minWidth: "140px", background: "#fff", padding: "12px", borderRadius: "15px", 
              textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
            }}>
              <div style={{ background: "#FDF0EF", height: "80px", borderRadius: "10px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>🍰</div>
              <p style={{ fontSize: "12px", fontWeight: "700", margin: "5px 0", color: "#4A2C2A" }}>{p.nome}</p>
              <span style={{ fontWeight: "800", color: "#4A2C2A", fontSize: "13px" }}>R$ {p.preco}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        background: "#FFC2D1", 
        borderTopLeftRadius: "50px", 
        borderTopRightRadius: "50px", 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        marginTop: "10px"
      }}>
        
        <div style={{
           background: "#4A2C2A", 
           borderTopLeftRadius: "50px",
           borderTopRightRadius: "50px",
           flex: 1,
           marginTop: "60px",
           padding: "0 20px 80px 20px",
           display: "flex", flexDirection: "column", alignItems: "center",
           position: "relative"
        }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", maxWidth: "350px", marginTop: "-55px" }}>
               
               <div onClick={() => setScreen("registro")} style={{ textAlign: "center", cursor: "pointer", background: "#E598A8", padding: "15px 5px", borderRadius: "30px 30px 10px 10px", width: "80px", boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}>
                  <div style={{ fontSize: "20px", marginBottom: "2px" }}>👤</div>
                  <p style={{ fontSize: "11px", color: "#4A2C2A", fontWeight: "800", margin: 0, lineHeight: "1.2" }}>Registrar<br/>Cliente</p>
               </div>

               <button onClick={onPedido} style={{ 
                 width: "125px", height: "125px", borderRadius: "50%", 
                 background: "linear-gradient(135deg, #E598A8, #C25975)", 
                 color: "#fff", 
                 border: "6px solid #E6C280",
                 fontSize: "14px", fontWeight: "bold", 
                 cursor: "pointer", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
                 display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                 transform: "translateY(-15px)"
               }}>
                 <span style={{ fontSize: "26px", marginBottom: "2px" }}>🎂</span>
                 <span style={{ lineHeight: "1.2" }}>Fazer<br/>Pedido</span>
               </button>

               <div onClick={onLogin} style={{ textAlign: "center", cursor: "pointer", background: "#E6C280", padding: "15px 5px", borderRadius: "30px 30px 10px 10px", width: "80px", boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}>
                  <div style={{ fontSize: "20px", marginBottom: "2px" }}>🔐</div>
                  <p style={{ fontSize: "11px", color: "#4A2C2A", fontWeight: "800", margin: 0, lineHeight: "1.2" }}>Login<br/>Cliente</p>
               </div>
            </div>

            <div style={{ marginTop: "40px", width: "100%", display: "flex", justifyContent: "center" }}>
              <button onClick={() => setScreen("admin")} style={{ 
                background: "transparent", border: "1px solid #E6C280", 
                borderRadius: "25px", padding: "12px 30px", color: "#E6C280", cursor: "pointer", fontSize: "12px",
                fontWeight: "700", display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{ fontSize: "16px" }}>⚙️</span> Acesso Administrativo
              </button>
            </div>

        </div>
      </div>

      <footer style={{ 
        position: "fixed", bottom: 0, width: "100%", 
        background: "#FFF9F2", display: "flex", justifyContent: "space-around", 
        padding: "15px 0", borderTop: "1px solid #E6C280",
        fontSize: "22px", borderRadius: "20px 20px 0 0", zIndex: 10
      }}>
        <span style={{ cursor: "pointer", color: "#D89A9E" }}>🏠</span> 
        <span style={{ cursor: "pointer", color: "#4A2C2A" }}>☰</span> 
        <span onClick={() => setScreen("registro")} style={{ cursor: "pointer", color: "#4A2C2A" }}>👤</span> 
        <span style={{ cursor: "pointer", color: "#4A2C2A" }}>🛒</span>
      </footer>
    </div>
  );
}