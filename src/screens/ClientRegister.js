import React, { useState } from "react";

export function ClientRegisterScreen({ setScreen }) {
  const [form, setForm] = useState({ nome: "", telefone: "", aniversario: "" });

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Conta criada com sucesso!\nBem-vindo(a), ${form.nome}!`);
    setScreen("home");
  };

  return (
    <div style={{ 
      fontFamily: "'Nunito', sans-serif", 
      background: "#FFF9F2", 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      
      <header style={{ padding: "30px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => setScreen("home")} style={{ 
          background: "none", border: "none", fontSize: "24px", color: "#4A2C2A", cursor: "pointer" 
        }}>
          ←
        </button>
        <h2 style={{ color: "#4A2C2A", margin: "0 auto", fontSize: "20px" }}>Criar Conta</h2>
        <div style={{ width: "24px" }}></div>
      </header>

      <div style={{ 
        background: "#fff", 
        flex: 1, 
        marginTop: "20px", 
        borderTopLeftRadius: "50px", 
        borderTopRightRadius: "50px", 
        padding: "40px 30px", 
        boxShadow: "0 -10px 20px rgba(0,0,0,0.03)" 
      }}>
        <p style={{ color: "#D89A9E", textAlign: "center", marginBottom: "30px", fontWeight: "bold", fontSize: "16px" }}>
          Junte-se à Fabiana Bolos! 🍰
        </p>
        
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "12px", color: "#4A2C2A", fontWeight: "bold", marginLeft: "10px" }}>Nome Completo *</label>
            <input 
              type="text" 
              placeholder="Ex: Maria Silva" 
              required
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              style={{ padding: "15px", borderRadius: "20px", border: "1px solid #FFC2D1", fontSize: "14px", background: "#FFF9F2", outline: "none", color: "#4A2C2A" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "12px", color: "#4A2C2A", fontWeight: "bold", marginLeft: "10px" }}>Número de Celular *</label>
            <input 
              type="tel" 
              placeholder="(DD) 99999-9999" 
              required
              value={form.telefone}
              onChange={(e) => setForm({...form, telefone: e.target.value})}
              style={{ padding: "15px", borderRadius: "20px", border: "1px solid #FFC2D1", fontSize: "14px", background: "#FFF9F2", outline: "none", color: "#4A2C2A" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "12px", color: "#4A2C2A", fontWeight: "bold", marginLeft: "10px" }}>Data de Aniversário 🎂 *</label>
            <input 
              type="date" 
              required
              value={form.aniversario}
              onChange={(e) => setForm({...form, aniversario: e.target.value})}
              style={{ padding: "15px", borderRadius: "20px", border: "1px solid #FFC2D1", fontSize: "14px", background: "#FFF9F2", outline: "none", color: "#4A2C2A" }}
            />
          </div>

          <button type="submit" style={{ 
            marginTop: "10px", padding: "18px", borderRadius: "25px", 
            background: "linear-gradient(135deg, #E598A8, #C25975)", 
            color: "#fff", border: "none", fontSize: "16px", fontWeight: "bold", 
            cursor: "pointer", boxShadow: "0 10px 20px rgba(194, 89, 117, 0.3)" 
          }}>
            Criar Conta
          </button>

        </form>
      </div>
    </div>
  );
}