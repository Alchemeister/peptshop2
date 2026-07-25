/**
 * Dynamic vial image component — renders a colored vial SVG inline.
 * Cap color and content color can be customized per product.
 * Default: blue cap, white lyophilized powder (matches original vial.svg).
 */

import type { VialColorKey } from '../contracts'

interface VialPreset {
  capColor: string
  capColorDark: string
  contentColor: string
  contentColorEnd: string
  glowColor: string
}

/** Color presets matching product categories */
export const VIAL_PRESETS: Record<VialColorKey, VialPreset> = {
  blue:   { capColor: '#2563eb', capColorDark: '#1e3a5f', contentColor: '#ffffff', contentColorEnd: '#d8e2ec', glowColor: '#2563eb' },
  red:    { capColor: '#dc2626', capColorDark: '#991b1b', contentColor: '#fef2f2', contentColorEnd: '#fecaca', glowColor: '#dc2626' },
  amber:  { capColor: '#d97706', capColorDark: '#92400e', contentColor: '#fef3c7', contentColorEnd: '#fde68a', glowColor: '#d97706' },
  green:  { capColor: '#059669', capColorDark: '#065f46', contentColor: '#f0fdf4', contentColorEnd: '#bbf7d0', glowColor: '#059669' },
  purple: { capColor: '#7c3aed', capColorDark: '#5b21b6', contentColor: '#faf5ff', contentColorEnd: '#ddd6fe', glowColor: '#7c3aed' },
  cyan:   { capColor: '#0891b2', capColorDark: '#155e75', contentColor: '#ecfeff', contentColorEnd: '#a5f3fc', glowColor: '#0891b2' },
  clear:  { capColor: '#94a3b8', capColorDark: '#475569', contentColor: '#f0f9ff', contentColorEnd: '#bae6fd', glowColor: '#94a3b8' },
  gold:   { capColor: '#ca8a04', capColorDark: '#854d0e', contentColor: '#fefce8', contentColorEnd: '#fef08a', glowColor: '#ca8a04' },
}

export function getVialPreset(key?: VialColorKey): VialPreset {
  return (key && VIAL_PRESETS[key]) || VIAL_PRESETS.blue
}

interface VialImageProps {
  color?: VialColorKey
  capColor?: string
  capColorDark?: string
  contentColor?: string
  contentColorEnd?: string
  glowColor?: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

export function VialImage({
  color,
  capColor,
  capColorDark,
  contentColor,
  contentColorEnd,
  glowColor,
  alt,
  className,
  style,
}: VialImageProps) {
  const preset = getVialPreset(color)
  const _capColor = capColor ?? preset.capColor
  const _capColorDark = capColorDark ?? preset.capColorDark
  const _contentColor = contentColor ?? preset.contentColor
  const _contentColorEnd = contentColorEnd ?? preset.contentColorEnd
  const _glowColor = glowColor ?? preset.glowColor
  const uid = `${_capColor.replace('#', '')}-${_contentColor.replace('#', '')}`
  const glassBody = `glassBody-${uid}`
  const capGrad = `capGrad-${uid}`
  const powderGrad = `powderGrad-${uid}`
  const glassShine = `glassShine-${uid}`
  const shadowGrad = `shadowGrad-${uid}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="800"
      viewBox="0 0 600 800"
      role="img"
      aria-label={alt}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={glassBody} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8f0f5" stopOpacity="0.85" />
          <stop offset="20%" stopColor="#c5d8e3" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#f0f7fa" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#c5d8e3" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a0bdd0" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={capGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={_capColorDark} />
          <stop offset="30%" stopColor={_capColor} />
          <stop offset="50%" stopColor={_capColor} />
          <stop offset="70%" stopColor={_capColor} />
          <stop offset="100%" stopColor={_capColorDark} />
        </linearGradient>
        <linearGradient id={powderGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={_contentColor} stopOpacity="0.95" />
          <stop offset="40%" stopColor={_contentColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={_contentColorEnd} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={glassShine} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={shadowGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="300" cy="720" rx="120" ry="20" fill={`url(#${shadowGrad})`} />

      <g transform="translate(300, 400)">
        {/* Cap */}
        <rect x="-70" y="-310" width="140" height="70" rx="8" fill={`url(#${capGrad})`} />
        <rect x="-70" y="-310" width="140" height="12" rx="8" fill={_capColorDark} opacity="0.5" />
        <line x1="-55" y1="-295" x2="-55" y2="-250" stroke={_capColorDark} strokeWidth="2" opacity="0.3" />
        <line x1="-30" y1="-295" x2="-30" y2="-250" stroke={_capColorDark} strokeWidth="2" opacity="0.3" />
        <line x1="-5" y1="-295" x2="-5" y2="-250" stroke={_capColorDark} strokeWidth="2" opacity="0.3" />
        <line x1="20" y1="-295" x2="20" y2="-250" stroke={_capColorDark} strokeWidth="2" opacity="0.3" />
        <line x1="45" y1="-295" x2="45" y2="-250" stroke={_capColorDark} strokeWidth="2" opacity="0.3" />

        {/* Neck */}
        <rect x="-50" y="-240" width="100" height="30" fill={`url(#${glassBody})`} />
        <rect x="-50" y="-240" width="100" height="6" fill={_capColor} opacity="0.3" />

        {/* Shoulder */}
        <path d="M -50,-210 Q -50,-195 -65,-185 L -65,-180 L 65,-180 L 65,-185 Q 50,-195 50,-210 Z" fill={`url(#${glassBody})`} />

        {/* Body */}
        <rect x="-85" y="-180" width="170" height="490" rx="12" fill={`url(#${glassBody})`} />

        {/* Content (powder/liquid) */}
        <path d="M -83,200 L -83,305 Q -83,312 -76,312 L 76,312 Q 83,312 83,305 L 83,200 Z" fill={`url(#${powderGrad})`} />

        {/* Texture dots */}
        <g opacity="0.4">
          <circle cx="-50" cy="210" r="3" fill={_contentColor} />
          <circle cx="-20" cy="225" r="2.5" fill={_contentColor} />
          <circle cx="15" cy="215" r="3" fill={_contentColor} />
          <circle cx="45" cy="230" r="2.5" fill={_contentColor} />
          <circle cx="-60" cy="245" r="2" fill={_contentColor} />
          <circle cx="-30" cy="255" r="3" fill={_contentColor} />
          <circle cx="0" cy="250" r="2.5" fill={_contentColor} />
          <circle cx="30" cy="260" r="2" fill={_contentColor} />
          <circle cx="55" cy="248" r="3" fill={_contentColor} />
          <circle cx="-45" cy="275" r="2.5" fill={_contentColor} />
          <circle cx="-10" cy="280" r="2" fill={_contentColor} />
          <circle cx="25" cy="278" r="3" fill={_contentColor} />
          <circle cx="50" cy="285" r="2.5" fill={_contentColor} />
          <circle cx="-60" cy="295" r="2" fill={_contentColor} />
          <circle cx="-20" cy="300" r="2.5" fill={_contentColor} />
          <circle cx="15" cy="295" r="2" fill={_contentColor} />
          <circle cx="45" cy="300" r="2.5" fill={_contentColor} />
        </g>

        {/* Shine */}
        <rect x="-78" y="-170" width="20" height="470" rx="10" fill={`url(#${glassShine})`} opacity="0.5" />
        <rect x="60" y="-170" width="15" height="470" rx="7" fill="#ffffff" opacity="0.2" />

        {/* Edges */}
        <rect x="-85" y="-180" width="3" height="490" rx="1.5" fill="#ffffff" opacity="0.5" />
        <rect x="82" y="-180" width="3" height="490" rx="1.5" fill="#ffffff" opacity="0.3" />

        {/* Bottom */}
        <ellipse cx="0" cy="310" rx="85" ry="12" fill="#a0bdd0" opacity="0.3" />

        {/* Brand tint */}
        <rect x="-85" y="-180" width="170" height="490" rx="12" fill={_glowColor} opacity="0.04" />
      </g>

      {/* Glow */}
      <ellipse cx="300" cy="450" rx="140" ry="350" fill={_glowColor} opacity="0.05" />
    </svg>
  )
}