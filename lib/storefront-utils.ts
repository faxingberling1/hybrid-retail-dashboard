import { headers } from 'next/headers';
import { db } from '@/lib/db';

export async function getStorefrontOrg() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Extract subdomain (e.g., 'test-org' from 'test-org.localhost:3000' or 'test-org.hybridpos.pk')
  // If it's just localhost:3000, subdomain might be empty or 'localhost'
  let subdomain = '';
  const parts = host.split('.');
  
  // Basic subdomain extraction
  if (parts.length >= 2 && !host.startsWith('localhost:')) {
    subdomain = parts[0];
  } else if (host.includes('.localhost:')) {
    subdomain = host.split('.localhost:')[0];
  }

  if (!subdomain || subdomain === 'www' || subdomain === 'localhost') {
    return null;
  }

  // Query organization by subdomain
  const orgStorefront = await db.queryOne(
    `SELECT organization_id, theme_config FROM organization_storefronts WHERE subdomain = $1`,
    [subdomain]
  );

  return orgStorefront || null;
}

export function hexToHsl(hex: string): string {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  // Calculate hue
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}
