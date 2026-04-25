export function formatCOP(centavos: number | null | undefined): string {
  if (centavos == null) return '';
  const pesos = centavos / 100;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos);
}

export function parseCOP(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  return parseInt(clean || '0', 10) * 100;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function parseDate(display: string): string {
  // Accept DD/MM/YYYY → YYYY-MM-DD
  const match = display.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  return display;
}
