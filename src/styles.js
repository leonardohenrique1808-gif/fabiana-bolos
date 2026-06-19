// src/styles.js
// ─── Tokens de design centralizados ──────────────────────────────
// Substitui os valores #E91E8C, #FFF0F8, etc. espalhados pelo código.
// Importe Colors, Typography e Spacing onde precisar de estilo inline.

export const Colors = {
  // Primária (rosa)
  primary:       "#E91E8C",
  primaryLight:  "#FFF0F8",
  primaryDark:   "#C2185B",

  // Fundo e superfície
  bg:            "#FDF6FB",
  bgAlt:         "#FFF9F2",
  surface:       "#ffffff",
  border:        "#E5D0EE",

  // Texto
  textDark:      "#1A1A1A",
  textMid:       "#333333",
  textSoft:      "#6B4C7A",
  textMuted:     "#888888",
  textLight:     "#9CA3AF",

  // Semânticas
  success:       "#15803D",
  successLight:  "#F0FDF4",
  warning:       "#B45309",
  warningLight:  "#FFFBEB",
  danger:        "#DC2626",
  dangerLight:   "#FEF2F2",
  info:          "#7E22CE",
  infoLight:     "#FAF5FF",

  // Especiais (Home)
  brown:         "#4A2C2A",
  gold:          "#E6C280",
  blush:         "#E598A8",
  blushDark:     "#C25975",
  pink:          "#FFC2D1",

  // WhatsApp
  wpp:           "#25D366",
};

export const Typography = {
  fontBase:   "'Nunito', sans-serif",
  fontSerif:  "'Playfair Display', serif",
  fontMono:   "'Share Tech Mono', monospace",
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
};

export const Radii = {
  sm:   8,
  md:  10,
  lg:  14,
  xl:  16,
  xxl: 20,
  pill: 999,
};

// ─── Estilo base de input reutilizável ────────────────────────────
export const inputStyle = {
  width:       "100%",
  border:      `1px solid ${Colors.border}`,
  borderRadius: Radii.md,
  padding:     "10px 12px",
  fontSize:    14,
  outline:     "none",
  background:  Colors.surface,
  fontFamily:  Typography.fontBase,
  boxSizing:   "border-box",
};