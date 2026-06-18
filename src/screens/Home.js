import React from "react";
import { TIPOS_BASE, pk, pkD, pkL } from "../utils/constants";

const DESTAQUES = [
  { nome: "Bolo Chantilly",          preco: "a partir de R$ 110",  emoji: "🎂" },
  { nome: "Palitinhos de Chocolate", preco: "a partir de R$ 130",  emoji: "🍫" },
  { nome: "Bentô Cake",              preco: "R$ 50 – R$ 55",       emoji: "🎁" },
];

export function Home({ NOME_APP, cart, clientUser, maintenanceMode, setScreen, onLogoClick, onPedido, onLogin, onAccount }) {
  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: "#FFF9F2",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Header */}
      <header style={{ padding: "40px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={onLogoClick} style={{ cursor: "pointer" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#D89A9E", fontWeight: 700 }}>Bem-vinda! 🌸</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#4A2C2A", margin: 0, fontFamily: "serif" }}>{NOME_APP}</h1>
          {clientUser && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#A1887F" }}>Olá, {clientUser.nome?.split(" ")[0]}!</p>}
        </div>
        <div
          onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null}
          style={{ background: "#fff", padding: 10, borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.06)", cursor: "pointer", fontSize: 20, position: "relative" }}
        >
          🛒
          {cart.length > 0 && (
            <span style={{ position: "absolute", top: -4, right: -4, background: pk, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cart.length}
            </span>
          )}
        </div>
      </header>

      {/* Manutenção */}
      {maintenanceMode && (
        <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, margin: "0 20px 12px", padding: "10px 14px", fontSize: 13, color: "#92400E", fontWeight: 700 }}>
          🔧 Sistema em manutenção — pedidos temporariamente suspensos
        </div>
      )}

      {/* Destaques */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: "#4A2C2A", fontSize: 15, margin: 0, fontWeight: 800 }}>Nossas Delícias</h3>
          <span style={{ fontSize: 11, color: "#A1887F", fontWeight: 700 }}>Feito com amor 🧁</span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {DESTAQUES.map((p, i) => (
            <div key={i} style={{
              minWidth: 130, background: "#fff", padding: 12, borderRadius: 14,
              textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", flexShrink: 0,
            }}>
              <div style={{ background: "#FDF0EF", height: 70, borderRadius: 10, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                {p.emoji}
              </div>
              <p style={{ fontSize: 11, fontWeight: 800, margin: "0 0 3px", color: "#4A2C2A", lineHeight: 1.3 }}>{p.nome}</p>
              <span style={{ fontWeight: 700, color: pk, fontSize: 10 }}>{p.preco}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Corpo escuro */}
      <div style={{ background: "#FFC2D1", borderTopLeftRadius: 50, borderTopRightRadius: 50, flex: 1, display: "flex", flexDirection: "column", marginTop: 10 }}>
        <div style={{
          background: "#4A2C2A",
          borderTopLeftRadius: 50, borderTopRightRadius: 50,
          flex: 1, marginTop: 60, padding: "0 20px 100px",
          display: "flex", flexDirection: "column", alignItems: "center",
          position: "relative",
        }}>
          {/* Botões principais */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", maxWidth: 340, marginTop: -55 }}>

            <div
              onClick={onAccount}
              style={{ textAlign: "center", cursor: "pointer", background: "#E598A8", padding: "15px 5px", borderRadius: "30px 30px 10px 10px", width: 78, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>{clientUser ? "👤" : "🔑"}</div>
              <p style={{ fontSize: 10, color: "#4A2C2A", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                {clientUser ? "Minha\nConta" : "Entrar /\nCadastrar"}
              </p>
            </div>

            <button
              onClick={onPedido}
              disabled={maintenanceMode}
              style={{
                width: 125, height: 125, borderRadius: "50%",
                background: maintenanceMode
                  ? "#999"
                  : "linear-gradient(135deg, #E598A8, #C25975)",
                color: "#fff", border: "6px solid #E6C280",
                fontSize: 13, fontWeight: 800, cursor: maintenanceMode ? "not-allowed" : "pointer",
                boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                transform: "translateY(-15px)", lineHeight: 1.3,
              }}
            >
              <span style={{ fontSize: 26, marginBottom: 3 }}>🎂</span>
              <span>Fazer<br />Pedido</span>
            </button>

            <div
              onClick={() => setScreen("client-login")}
              style={{ textAlign: "center", cursor: "pointer", background: "#E6C280", padding: "15px 5px", borderRadius: "30px 30px 10px 10px", width: 78, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>🛒</div>
              <p style={{ fontSize: 10, color: "#4A2C2A", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                Meus<br />Pedidos
              </p>
            </div>
          </div>

          {/* Acesso admin */}
          <div style={{ marginTop: 40 }}>
            <button
              onClick={() => setScreen("admin-login")}
              style={{
                background: "transparent", border: "1px solid #E6C280",
                borderRadius: 25, padding: "11px 28px", color: "#E6C280",
                cursor: "pointer", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span style={{ fontSize: 15 }}>⚙️</span> Acesso Administrativo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: "fixed", bottom: 0, width: "100%",
        background: "#FFF9F2", display: "flex", justifyContent: "space-around",
        padding: "13px 0", borderTop: "1px solid #E6C280",
        fontSize: 22, borderRadius: "20px 20px 0 0", zIndex: 10,
      }}>
        <span onClick={() => setScreen("home")}         style={{ cursor: "pointer", color: pk }}>🏠</span>
        <span onClick={onPedido}                        style={{ cursor: "pointer", color: "#4A2C2A" }}>🎂</span>
        <span onClick={onAccount}                       style={{ cursor: "pointer", color: "#4A2C2A" }}>👤</span>
        <span onClick={() => cart.length > 0 ? setScreen("pedido-cart") : null} style={{ cursor: "pointer", color: "#4A2C2A" }}>🛒</span>
      </footer>
    </div>
  );
}