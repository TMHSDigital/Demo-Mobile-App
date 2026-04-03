export const colors = {
  background: "#FFFBF5",
  surface: "#FFFFFF",
  surfaceAlt: "#F9F5EB",
  border: "#F3E8D8",
  text: "#1F2937",
  textSecondary: "#9CA3AF",
  accent: "#D97706",
  accentLight: "#FEF3C7",
  accentDark: "#78350F",
  danger: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(0,0,0,0.5)",
  overlayLight: "rgba(0,0,0,0.3)",
  cameraControlBg: "rgba(255,255,255,0.15)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 22,
  full: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 20, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  bodySmall: { fontSize: 14, fontWeight: "400" as const },
  caption: { fontSize: 13, fontWeight: "400" as const },
  label: { fontSize: 12, fontWeight: "400" as const },
  micro: { fontSize: 11, fontWeight: "700" as const },
  tag: { fontSize: 10, fontWeight: "700" as const },
} as const;
