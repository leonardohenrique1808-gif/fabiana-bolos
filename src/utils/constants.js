// ─── CONFIGURAÇÕES GERAIS ──────────────────────────────────────
export const NOME_APP = "Fabiana Bolos";
export const ADMIN_PASS = "Leo";
export const PIN_MASTER = "Leo";
export const DEV_PASS = "dev2026";
export const PIX_KEY = "31999154485";
export const WHATSAPP = "5531999154485";
export const MAX_ATTEMPTS = 5;
export const LOCK_MS = 120_000;
export const AUTO_LOGOUT_MS = 15 * 60 * 1000;
export const SOFT_LOCK_DAYS = 5;

// Cores Padrão
export const pk = "#E91E8C";
export const pkD = "#C2185B";
export const pkL = "#FFF0F8";

export const DEFAULT_CFG = {
  prazoMinHoras: 48, adicionalGourmet: 20, webhookUrl: "", licenseExpiry: "2027-12-31",
  licenseCheckUrl: "", datasTravadas: [], dominiosAutorizados: [], coresPreset: "confeitaria",
  regioes: [
    { id: 1, nome: "Retirada no local", taxa: 0, isRetirada: true },
    { id: 2, nome: "Entrega (A combinar)", taxa: 0, isRetirada: false },
  ],
};

// ─── CARDÁPIO E PREÇOS ────────────────────────────────────────
export const TIPOS_BASE = [
  { id: "chantilly", nome: "Bolo Chantilly", desc: "A partir de R$ 110", fotoUrl: "" },
  { id: "palitinhos", nome: "Palitinhos de Chocolate",desc: "A partir de R$ 130", fotoUrl: "" },
  { id: "chocolatudo", nome: "Bolo Chocolatudo", desc: "A partir de R$ 175", fotoUrl: "" },
  { id: "bento", nome: "Bentô Cake", desc: "R$ 50 – R$ 55", fotoUrl: "" },
  { id: "docinhos", nome: "Docinhos", desc: "A partir de R$ 45/50 un",fotoUrl: "" },
];

export const PRECOS = {
  chantilly: { redondo: { 12:110,20:165,30:195,40:220,60:280,100:330 }, retangular: { 25:185,50:260,80:300,100:350,120:380 } },
  palitinhos: { redondo: { 12:130,20:185,30:220,40:240,60:310,100:370 }, retangular: { 25:200,50:260,80:330,100:390,120:420 } },
  chocolatudo: { redondo: { 12:175,20:230,30:295,60:360 } },
  bento: { tradicional: 50, gourmet: 55 },
  docinhos: { tradicional: { 50:45,100:90 }, gourmet: { 50:55,100:110 } },
};

export const MASSAS = ["Baunilha", "Chocolate"];
export const R_TRAD = ["Brigadeiro Preto","Brigadeiro Branco","Beijinho de Coco","Bicho de Pé","Churros","Doce de Leite","Doce de Leite c/ Chocolate","Mousse de Morango","Mousse de Maracujá","Mousse de Limão","Ninho","Prestígio (2 recheios)"];
export const R_GOUR = ["Abacaxi","Ameixa","Creme de Nutella","Ganache Choc. Preto","Ganache Choc. Branco","Mousse de Chocolate","Nutella","Nozes","Ninho","Ninho c/ Morango","Pêssego","Romeu e Julieta"];
export const R_BENTO_T = ["Brigadeiro Preto","Brigadeiro Branco","Beijinho de Coco","Doce de Leite","Mousse de Morango","Mousse de Maracujá","Ninho","Ninho c/ Morango"];
export const R_BENTO_G = ["Nutella","Ninho com Nutella"];
export const S_DOC_T = ["Beijinho de Coco","Brigadeiro","Brigadeiro Branco","Cajuzinho","Ele e Ela","Olho de Sogra","Ninho","Abacaxi c/ Coco","Maracujá c/ Coco","Morango c/ Coco","Limão c/ Coco"];
export const S_DOC_G = ["Ninho com Nutella","Churros"];
export const ALL_G = [...R_GOUR, ...R_BENTO_G];

// ─── UPSELL (ADICIONAIS DO CARRINHO) ──────────────────────────
export const UPSELL = [
  { id:"topper", nome:"🎂 Topo de Bolo", desc:"Personalizado", preco: 18 },
  { id:"docinhos50",nome:"🍬 Docinhos Trad.", desc:"50 unidades", preco: 45 },
  { id:"bento_ex", nome:"🎁 Bentô Cake extra", desc:"Mini bolo 10cm", preco: 50 },
];
export const UPSELL_PRECOS = Object.fromEntries(UPSELL.map(u => [u.id, u.preco]));
export const PRECOS_MESTRES = { cardapio: PRECOS, upsell: UPSELL_PRECOS };

// ─── STATUS DO SISTEMA ────────────────────────────────────────
export const STATUS_UNICO = [
  "Aguardando Caução",
  "Confirmado",
  "Em Produção",
  "Pronto para Entrega/Retirada",
  "Finalizado",
  "Cancelado",
];

export const STATUS_META = {
  "Aguardando Caução": { bg:"#FFF7ED", text:"#C2410C", brd:"#FED7AA", em:"⏳" },
  "Confirmado": { bg:"#F0FDF4", text:"#15803D", brd:"#BBF7D0", em:"✅" },
  "Em Produção": { bg:"#FFFBEB", text:"#B45309", brd:"#FDE68A", em:"👩‍🍳" },
  "Pronto para Entrega/Retirada": { bg:"#FAF5FF", text:"#7E22CE", brd:"#E9D5FF", em:"🎂" },
  "Finalizado": { bg:"#F1F5F9", text:"#475569", brd:"#CBD5E1", em:"🚀" },
  "Cancelado": { bg:"#FEF2F2", text:"#DC2626", brd:"#FECACA", em:"❌" },
};

export const STATUS_LEGACY_MAP = {
  "aguardando caução": "Aguardando Caução",
  "confirmado": "Confirmado",
  "em preparo": "Em Produção",
  "pronto": "Pronto para Entrega/Retirada",
  "entregue": "Finalizado",
  "cancelado": "Cancelado",
};

// ─── CSS GLOBAL ORIGINAL ──────────────────────────────────────
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&family=Share+Tech+Mono&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{margin:0;background:#FDF6FB;font-family:'Nunito',sans-serif;}
button{cursor:pointer;transition:all .15s;}
button:active{transform:scale(0.96);}
.fu{animation:fadeUp .3s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.hov:hover{box-shadow:0 4px 18px rgba(233,30,140,.13);transform:translateY(-1px);}
.pulse{animation:pulse .35s ease;}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-thumb{background:#F9A8D4;border-radius:3px;}
.item-img{width:100%;height:120px;object-fit:cover;border-radius:12px 12px 0 0;}
.status-bar{display:flex;gap:4px;margin-top:8px;}
.status-step{flex:1;height:6px;border-radius:3px;background:#E5D0EE;}
.status-step.active{background:#E91E8C;}
.status-step.done{background:#15803D;}
.kernel-bg{background:#0a0a0a;color:#00ff88;font-family:'Share Tech Mono',monospace;}
.kernel-input{background:#111;border:1px solid #00ff88;color:#00ff88;font-family:'Share Tech Mono',monospace;padding:8px 12px;border-radius:6px;width:100%;outline:none;font-size:13px;}
.kernel-btn{background:transparent;border:1px solid #00ff88;color:#00ff88;padding:6px 14px;border-radius:6px;font-family:'Share Tech Mono',monospace;cursor:pointer;}
.kernel-btn:hover{background:#00ff88;color:#0a0a0a;}
.kernel-tab{background:transparent;border:none;color:#555;padding:8px 14px;font-family:'Share Tech Mono',monospace;cursor:pointer;font-size:12px;border-bottom:2px solid transparent;}
.kernel-tab.active{color:#00ff88;border-bottom-color:#00ff88;}
@media print{.no-print{display:none!important;}.lbl{font-family:monospace;font-size:13px;line-height:1.8;color:#000;}}
`;