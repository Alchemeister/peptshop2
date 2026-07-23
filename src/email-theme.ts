/**
 * Presentation-only tokens for PeptShop email clients.
 *
 * The private application owns recipients, copy, links, and delivery logic.
 * This public handoff owns only the visual values consumed by that renderer.
 */
export const peptShopEmailTheme = {
  accent: '#FFA300',
  accentHover: '#EB9600',
  accentSoft: '#FFF4DC',
  canvas: '#F4F5F7',
  paper: '#FFFFFF',
  surface: '#EEF1F4',
  ink: '#12161D',
  inkSoft: '#252B34',
  muted: '#5D6673',
  faint: '#8993A0',
  line: '#DFE3E8',
  lineStrong: '#C7CDD5',
  success: '#167A53',
  successSoft: '#E8F7F0',
  warning: '#8B5A00',
  warningSoft: '#FFF4DC',
  danger: '#A43737',
  dangerSoft: '#FFF0EF',
  info: '#245D8F',
  infoSoft: '#EDF6FC',
  deep: '#111419',
} as const

export type PeptShopEmailTheme = typeof peptShopEmailTheme
