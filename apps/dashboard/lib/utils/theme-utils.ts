// Color conversion utilities
export function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace(/^#/, '')
  
  // Parse the hex values
  let r: number, g: number, b: number
  
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else {
    throw new Error('Invalid hex color')
  }
  
  // Convert to HSL
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    
    h /= 6
  }
  
  // Convert to CSS HSL format
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)
  
  return `${h} ${s}% ${l}%`
}

export function generateColorShades(hexColor: string): Record<string, string> {
  const hsl = hexToHsl(hexColor)
  const [h, s, l] = hsl.split(' ').map(val => parseFloat(val.replace('%', '')))
  
  // Generate shades based on lightness
  return {
    '50': `${h} ${s}% ${Math.min(l + 40, 95)}%`,
    '100': `${h} ${s}% ${Math.min(l + 30, 90)}%`,
    '200': `${h} ${s}% ${Math.min(l + 20, 80)}%`,
    '300': `${h} ${s}% ${Math.min(l + 10, 70)}%`,
    '400': `${h} ${s}% ${Math.min(l + 5, 60)}%`,
    '500': `${h} ${s}% ${l}%`,
    '600': `${h} ${s}% ${Math.max(l - 5, 40)}%`,
    '700': `${h} ${s}% ${Math.max(l - 10, 30)}%`,
    '800': `${h} ${s}% ${Math.max(l - 20, 20)}%`,
    '900': `${h} ${s}% ${Math.max(l - 30, 10)}%`,
  }
}

export function applyThemeToDocument(theme: {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  density: 'comfortable' | 'compact'
  animations: boolean
  borderRadius: string
  shadow: string
}) {
  const root = document.documentElement
  
  // Apply theme mode
  if (theme.mode === 'dark') {
    root.classList.add('dark')
  } else if (theme.mode === 'light') {
    root.classList.remove('dark')
  } else {
    // System mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
  
  // Apply animations
  if (theme.animations) {
    root.classList.add('theme-animations')
  } else {
    root.classList.remove('theme-animations')
  }
  
  // Apply primary color
  try {
    const primaryHsl = hexToHsl(theme.primaryColor)
    root.style.setProperty('--primary', primaryHsl)
    
    // Generate and apply shades
    const shades = generateColorShades(theme.primaryColor)
    Object.entries(shades).forEach(([shade, value]) => {
      root.style.setProperty(`--primary-${shade}`, value)
    })
  } catch (error) {
    console.error('Failed to apply primary color:', error)
    // Fallback to default purple
    root.style.setProperty('--primary', '243 75% 59%')
  }
  
  // Apply font size
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px'
  }
  root.style.setProperty('--font-size-base', fontSizeMap[theme.fontSize])
  
  // Apply density
  const spacingMap = {
    compact: '0.75rem',
    comfortable: '1rem'
  }
  root.style.setProperty('--spacing-unit', spacingMap[theme.density])
  
  // Apply border radius
  const borderRadiusMap = {
    none: '0px',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  }
  root.style.setProperty('--radius', borderRadiusMap[theme.borderRadius as keyof typeof borderRadiusMap] || '0.375rem')
  
  // Apply shadow
  const shadowMap = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
  root.style.setProperty('--shadow', shadowMap[theme.shadow as keyof typeof shadowMap] || '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)')
}

// Theme presets
export const themePresets = {
  default: {
    mode: 'light' as const,
    primaryColor: '#4F46E5',
    fontSize: 'medium' as const,
    density: 'comfortable' as const,
    animations: true,
    borderRadius: 'md' as const,
    shadow: 'md' as const
  },
  dark: {
    mode: 'dark' as const,
    primaryColor: '#8B5CF6',
    fontSize: 'medium' as const,
    density: 'comfortable' as const,
    animations: true,
    borderRadius: 'md' as const,
    shadow: 'lg' as const
  },
  compact: {
    mode: 'light' as const,
    primaryColor: '#3B82F6',
    fontSize: 'small' as const,
    density: 'compact' as const,
    animations: true,
    borderRadius: 'sm' as const,
    shadow: 'sm' as const
  },
  minimal: {
    mode: 'light' as const,
    primaryColor: '#10B981',
    fontSize: 'medium' as const,
    density: 'comfortable' as const,
    animations: false,
    borderRadius: 'none' as const,
    shadow: 'none' as const
  }
}

// Detect system preferences
export function detectSystemPreferences() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  return {
    mode: prefersDark ? 'dark' : 'light',
    animations: !prefersReducedMotion
  }
}