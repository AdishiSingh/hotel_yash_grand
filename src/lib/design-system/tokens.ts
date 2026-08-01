/**
 * HOTEL YASH GRAND — World-Class Luxury Design Tokens (YG-DS v2.0)
 * Single Source of Truth for Enterprise Royal Palette, Typography & Glassmorphism
 */

export const YG_TOKENS = {
  colors: {
    // Luxury Surface Depths
    surfaceBase: "#0B0F14",
    surfaceElevated: "#121820",
    surfaceCard: "#171E27",
    surfaceGlass: "rgba(23, 30, 39, 0.75)",

    // Royal Champagne Gold Branding
    goldPrimary: "#D4AF37",
    goldSecondary: "#B8902F",
    goldMuted: "#8C723F",
    goldGlow: "rgba(212, 175, 55, 0.25)",
    goldBorder: "rgba(212, 175, 55, 0.3)",

    // Typography
    textPrimary: "#FFFFFF",
    textSecondary: "#E2E8F0",
    textMuted: "#94A3B8",

    // Status Colors (Emerald, Amber, Ruby)
    status: {
      success: {
        bg: "rgba(52, 211, 153, 0.1)",
        fg: "#34D399",
        border: "rgba(52, 211, 153, 0.3)",
      },
      warning: {
        bg: "rgba(251, 191, 36, 0.1)",
        fg: "#FBBF24",
        border: "rgba(251, 191, 36, 0.3)",
      },
      danger: {
        bg: "rgba(248, 113, 113, 0.1)",
        fg: "#F87171",
        border: "rgba(248, 113, 113, 0.3)",
      },
      info: {
        bg: "rgba(56, 189, 248, 0.1)",
        fg: "#38BDF8",
        border: "rgba(56, 189, 248, 0.3)",
      },
      neutral: {
        bg: "rgba(148, 163, 184, 0.1)",
        fg: "#94A3B8",
        border: "rgba(148, 163, 184, 0.3)",
      },
    },
  },
  typography: {
    fontSerif: "var(--font-playfair), Playfair Display, Georgia, serif",
    fontSans: "var(--font-inter), Inter, system-ui, sans-serif",
    fontMono: "var(--font-mono), JetBrains Mono, monospace",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "8px",
    md: "14px",
    lg: "20px",
    xl: "28px",
    full: "9999px",
  },
  shadows: {
    goldGlow: "0 8px 30px rgba(212, 175, 55, 0.25)",
    cardElevated: "0 12px 35px -10px rgba(0, 0, 0, 0.6)",
    glassmorphic: "0 10px 40px 0 rgba(0, 0, 0, 0.45)",
  },
} as const;

export type YgColorToken = keyof typeof YG_TOKENS.colors;
