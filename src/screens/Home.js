// src/screens/Home.js
import React from "react";
import { PageWrapper } from "../components/PageWrapper";
import { pk, pkD }    from "../utils/constants";

const DESTAQUES = [
  { nome: "Bolo Chantilly",          preco: "a partir de R$ 110", emoji: "🎂", id: "chantilly" },
  { nome: "Palitinhos de Chocolate", preco: "a partir de R$ 130", emoji: "🍫", id: "palitinhos" },
  { nome: "Bentô Cake",              preco: "R$ 50 – R$ 55",      emoji: "🎁", id: "bento" },
  { nome: "Docinhos",                preco: "a partir de R$ 45",  emoji: "🍬", id: "docinhos" },
];

export function Home({
  NOME_APP, cart, clientUser, maintenanceMode,
  setScreen, onLogoClick, onPedido, onLogin, onAccount,
}) {
  const cartCount = cart.length;

  return (
    <PageWrapper style={{
      background: "#FFF9F2",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>

      {/* ── Header ───────────────────────────────────────── */}
      <header style={{
        padding: "40px 20px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        {/* Logo clicável (gatilho admin/kernel) */}
        <div onClick={onLogoClick} style={{ cursor: "pointer" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#D89A9E", fontWeight: 700 }}>
            {clientUser ? `Olá, ${clientUser.nome?.split(" ")[0]}! 🌸` : "Bem-vinda! 🌸"}
          </p>
          <h1 style={{
            fontSize: 26, fontWeight: 900, color: "#4A2C2A",
            margin: 0, fontFamily: "serif",
          }}>
            {NOME_APP}
          </h1>
          {clientUser && (
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#A1887F" }}>
              Toque no nome para acesso especial
            </p>
          )}
        </div>

        {/* Ícone carrinho com badge */}
        <div
          onClick={() => cartCount > 0 ? setScreen("pedido-cart") : null}
          style={{
            background: "#fff", padding: 10, borderRadius: "50%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
            cursor: cartCount > 0 ? "pointer" : "default",
            fontSize: 20, position: "relative",
            transition: "transform .15s",
          }}
        >
          🛒
          {cartCount > 0 && (
            <span className="pulse" style={{
              position: "absolute", top: -4, right: -4,
              background: pk, color: "#fff",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 11, fontWeight: 900,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(233,30,140,.4)",
            }}>
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* ── Aviso de manutenção ──────────────────────────── */}
      {maintenanceMode && (
        <div style={{
          background: "#FFF7ED", border: "1px solid #FED7AA",
          borderRadius: 12, margin: "0 20px 12px",
          padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>🔧</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>
              Manutenção em andamento
            </div>
            <div style={{ fontSize: 11, color: "#B45309" }}>
              Pedidos temporariamente suspensos
            </div>
          </div>
        </div>
      )}

      {/* ── Destaques (scroll horizontal) ────────────────── */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 12,
        }}>
          <h3 style={{ color: "#4A2C2A", fontSize: 15, margin: 0, fontWeight: 800 }}>
            Nossas Delícias
          </h3>
          <span style={{ fontSize: 11, color: "#A1887F", fontWeight: 700 }}>
            Feito com amor 🧁
          </span>
        </div>

        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {DESTAQUES.map((p, i) => (
            <div
              key={i}
              onClick={() => !maintenanceMode && onPedido()}
              className="hov"
              style={{
                minWidth: 120, background: "#fff", padding: 12, borderRadius: 14,
                textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                flexShrink: 0, cursor: maintenanceMode ? "default" : "pointer",
                border: "1.5px solid transparent",
                transition: "border-color .2s",
              }}
            >
              <div style={{
                background: "linear-gradient(135deg,#FDF0EF,#FFF0F8)",
                height: 64, borderRadius: 10, marginBottom: 8,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 26,
              }}>
                {p.emoji}
              </div>
              <p style={{
                fontSize: 10, fontWeight: 800, margin: "0 0 3px",
                color: "#4A2C2A", lineHeight: 1.3,
              }}>
                {p.nome}
              </p>
              <span style={{ fontWeight: 700, color: pk, fontSize: 10 }}>
                {p.preco}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Seção escura com botões ───────────────────────── */}
      <div style={{
        background: "#FFC2D1",
        borderTopLeftRadius: 50, borderTopRightRadius: 50,
        flex: 1, display: "flex", flexDirection: "column", marginTop: 10,
      }}>
        <div style={{
          background: "#4A2C2A",
          borderTopLeftRadius: 50, borderTopRightRadius: 50,
          flex: 1, marginTop: 60, padding: "0 20px 100px",
          display: "flex", flexDirection: "column", alignItems: "center",
          position: "relative",
        }}>

          {/* ── Trio de botões flutuantes ─── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", width: "100%", maxWidth: 340, marginTop: -55,
          }}>

            {/* Minha conta */}
            <div
              onClick={onAccount}
              style={{
                textAlign: "center", cursor: "pointer",
                background: clientUser ? "linear-gradient(135deg,#E598A8,#C25975)" : "#E598A8",
                padding: "14px 5px", borderRadius: "30px 30px 10px 10px",
                width: 78, boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
                transition: "transform .15s",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 3 }}>
                {clientUser ? "👤" : "🔑"}
              </div>
              <p style={{
                fontSize: 10, color: "#fff", fontWeight: 800,
                margin: 0, lineHeight: 1.3,
              }}>
                {clientUser ? "Minha\nConta" : "Entrar /\nCadastrar"}
              </p>
              {clientUser && (
                <div style={{
                  fontSize: 9, color: "rgba(255,255,255,.7)",
                  marginTop: 2, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: 68,
                }}>
                  {clientUser.nome?.split(" ")[0]}
                </div>
              )}
            </div>

            {/* Botão FAZER PEDIDO (central) */}
            <button
              onClick={onPedido}
              disabled={maintenanceMode}
              style={{
                width: 128, height: 128, borderRadius: "50%",
                background: maintenanceMode
                  ? "#888"
                  : "linear-gradient(135deg, #E598A8, #C25975)",
                color: "#fff",
                border: "6px solid #E6C280",
                fontSize: 13, fontWeight: 800,
                cursor: maintenanceMode ? "not-allowed" : "pointer",
                boxShadow: maintenanceMode
                  ? "none"
                  : "0 12px 28px rgba(0,0,0,.35), 0 0 0 3px rgba(230,194,128,.3)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                transform: "translateY(-15px)",
                lineHeight: 1.3,
                transition: "box-shadow .2s, transform .15s",
              }}
            >
              <span style={{ fontSize: 28, marginBottom: 4 }}>🎂</span>
              <span>Fazer<br />Pedido</span>
            </button>

            {/* Meus pedidos */}
            <div
              onClick={() => clientUser ? setScreen("client-area") : setScreen("client-login")}
              style={{
                textAlign: "center", cursor: "pointer",
                background: "#E6C280",
                padding: "14px 5px", borderRadius: "30px 30px 10px 10px",
                width: 78, boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
                transition: "transform .15s",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 3 }}>🛒</div>
              <p style={{
                fontSize: 10, color: "#4A2C2A", fontWeight: 800,
                margin: 0, lineHeight: 1.3,
              }}>
                Meus<br />Pedidos
              </p>
              {cartCount > 0 && (
                <div style={{
                  background: pk, color: "#fff",
                  borderRadius: 10, fontSize: 9, fontWeight: 900,
                  padding: "1px 6px", marginTop: 4, display: "inline-block",
                }}>
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>

          {/* ── Texto de boas-vindas ─── */}
          <div style={{
            marginTop: 32, textAlign: "center",
            color: "rgba(255,255,255,.5)", fontSize: 12,
          }}>
            {clientUser ? (
              <>
                <div style={{ fontSize: 16, marginBottom: 4 }}>✨</div>
                Bem-vinda de volta, {clientUser.nome?.split(" ")[0]}!
              </>
            ) : (
              <>
                <div style={{ fontSize: 16, marginBottom: 4 }}>🌸</div>
                Faça login para acompanhar seus pedidos
              </>
            )}
          </div>

          {/* ── Acesso Administrativo ─── */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setScreen("admin-login")}
              style={{
                background: "transparent",
                border: "1px solid rgba(230,194,128,.4)",
                borderRadius: 25, padding: "10px 26px",
                color: "rgba(230,194,128,.7)",
                cursor: "pointer", fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 8,
                transition: "border-color .2s, color .2s",
              }}
            >
              <span>⚙️</span> Acesso Administrativo
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer de navegação ───────────────────────────── */}
      <footer style={{
        position: "fixed", bottom: 0, width: "100%",
        background: "#FFF9F2",
        display: "flex", justifyContent: "space-around",
        padding: "12px 0 14px",
        borderTop: "1px solid rgba(230,194,128,.5)",
        borderRadius: "20px 20px 0 0",
        zIndex: 10,
        boxShadow: "0 -4px 20px rgba(0,0,0,.06)",
      }}>
        <button
          onClick={() => setScreen("home")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "0 12px",
          }}
        >
          <span style={{ fontSize: 22 }}>🏠</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: pk }}>Início</span>
        </button>

        <button
          onClick={onPedido}
          disabled={maintenanceMode}
          style={{
            background: "none", border: "none",
            cursor: maintenanceMode ? "default" : "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "0 12px", opacity: maintenanceMode ? 0.4 : 1,
          }}
        >
          <span style={{ fontSize: 22 }}>🎂</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#4A2C2A" }}>Pedido</span>
        </button>

        <button
          onClick={onAccount}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "0 12px",
          }}
        >
          <span style={{ fontSize: 22 }}>👤</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#4A2C2A" }}>
            {clientUser ? "Conta" : "Entrar"}
          </span>
        </button>

        <button
          onClick={() => cartCount > 0 ? setScreen("pedido-cart") : null}
          style={{
            background: "none", border: "none",
            cursor: cartCount > 0 ? "pointer" : "default",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "0 12px", position: "relative",
            opacity: cartCount > 0 ? 1 : 0.45,
          }}
        >
          <span style={{ fontSize: 22 }}>🛒</span>
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: 2,
              background: pk, color: "#fff",
              borderRadius: "50%", width: 16, height: 16,
              fontSize: 10, fontWeight: 900,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {cartCount}
            </span>
          )}
          <span style={{ fontSize: 9, fontWeight: 700, color: "#4A2C2A" }}>Carrinho</span>
        </button>
      </footer>
    </PageWrapper>
  );
}