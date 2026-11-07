export type Unit = 'g' | 'kg' | 'ml' | 'L' | 'unit' | 'pinch';

export function toBaseQuantity(quantity: number, unit: Unit): number {
  if (unit === 'kg') return quantity * 1000;
  if (unit === 'L') return quantity * 1000;
  return quantity;
}

export function fromBaseQuantity(quantity: number, unit: Unit): number {
  if (unit === 'kg' || unit === 'L') return quantity / 1000;
  return quantity;
}

export function formatQuantity(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(Number(value.toFixed(decimals)));
}

/** Promotes metric purchasing quantities at 1,000 g/ml unless precision mode locks units. */
export function purchasingQuantity(
  quantity: number,
  unit: Unit,
  lockUnits = false,
): { quantity: number; unit: Unit } {
  if (lockUnits) return { quantity, unit };
  if (unit === 'g' && quantity >= 1000) return { quantity: quantity / 1000, unit: 'kg' };
  if (unit === 'kg' && quantity * 1000 >= 1000) return { quantity, unit: 'kg' };
  if (unit === 'kg') return { quantity: quantity * 1000, unit: 'g' };
  if (unit === 'ml' && quantity >= 1000) return { quantity: quantity / 1000, unit: 'L' };
  if (unit === 'L' && quantity * 1000 >= 1000) return { quantity, unit: 'L' };
  if (unit === 'L') return { quantity: quantity * 1000, unit: 'ml' };
  return { quantity, unit };
}
