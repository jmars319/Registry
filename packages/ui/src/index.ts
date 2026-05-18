export const registryTheme = {
  colors: {
    canvas: "#0D0D0F",
    panel: "#1E1E22",
    panelStrong: "#2C2C30",
    border: "rgba(242, 242, 245, 0.14)",
    text: "#f2f2f5",
    muted: "#A0A0A0",
    accent: "#09A6D6",
    accentSoft: "rgba(9, 166, 214, 0.14)",
    warning: "#a14d2a",
    warningSoft: "rgba(161, 77, 42, 0.18)"
  },
  radii: {
    small: 10,
    medium: 18,
    large: 28
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  shadows: {
    panel: "0 18px 40px rgba(0, 0, 0, 0.28)"
  }
} as const;

export const registryCssVariables = {
  "--rg-color-canvas": registryTheme.colors.canvas,
  "--rg-color-panel": registryTheme.colors.panel,
  "--rg-color-panel-strong": registryTheme.colors.panelStrong,
  "--rg-color-border": registryTheme.colors.border,
  "--rg-color-text": registryTheme.colors.text,
  "--rg-color-muted": registryTheme.colors.muted,
  "--rg-color-accent": registryTheme.colors.accent,
  "--rg-color-accent-soft": registryTheme.colors.accentSoft,
  "--rg-color-warning": registryTheme.colors.warning,
  "--rg-color-warning-soft": registryTheme.colors.warningSoft,
  "--rg-radius-small": `${registryTheme.radii.small}px`,
  "--rg-radius-medium": `${registryTheme.radii.medium}px`,
  "--rg-radius-large": `${registryTheme.radii.large}px`,
  "--rg-shadow-panel": registryTheme.shadows.panel
} as const;

export function formatCountLabel(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
