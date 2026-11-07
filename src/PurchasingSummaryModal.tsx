import { Check, Clipboard, Download, Printer, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Category, Ingredient } from './IngredientTable';
import type { Unit } from './UnitConverterUtility';
import { formatQuantity, purchasingQuantity } from './UnitConverterUtility';

const categoryOrder: Category[] = ['Produce / Vegetables', 'Meat / Poultry', 'Chilled / Dairy', 'Dry Goods'];
type PurchasingSummaryModalProps = { open: boolean; onClose: () => void; ingredients: Ingredient[]; portions: number; basePortions: number; recipeTitle: string; lockUnits: boolean };

export default function PurchasingSummaryModal({ open, onClose, ingredients, portions, basePortions, recipeTitle, lockUnits }: PurchasingSummaryModalProps) {
  const [copied, setCopied] = useState(false);
  const groups = useMemo(() => {
    const result = new Map<Category, Map<string, { name: string; quantity: number; unit: Unit }>>();
    for (const ingredient of ingredients) {
      const quantity = ingredient.quantity * (portions / basePortions) * (1 + ingredient.wastage / 100);
      const converted = purchasingQuantity(quantity, ingredient.unit, lockUnits);
      const category = result.get(ingredient.category) ?? new Map();
      const key = `${ingredient.name.trim().toLocaleLowerCase()}|${converted.unit}`;
      const previous = category.get(key);
      category.set(key, { name: ingredient.name.trim() || 'Unnamed ingredient', quantity: (previous?.quantity ?? 0) + converted.quantity, unit: converted.unit });
      result.set(ingredient.category, category);
    }
    return categoryOrder.map((category) => ({ category, items: [...(result.get(category)?.values() ?? [])] })).filter((group) => group.items.length > 0);
  }, [ingredients, portions, basePortions, lockUnits]);
  if (!open) return null;

  const textSummary = () => [`SENARAI TEMPAHAN BAHAN | ${recipeTitle}`, `Purchase order · ${portions} portions`, '', ...groups.flatMap((group) => [group.category.toUpperCase(), ...group.items.map((item) => `☐  ${item.name} — ${formatQuantity(item.quantity, 2)} ${item.unit}`), '']), 'Prepared with mise.'].join('\n');
  const exportCsv = () => {
    const rows = [['Category', 'Ingredient', 'Quantity', 'Unit'], ...groups.flatMap((group) => group.items.map((item) => [group.category, item.name, String(Number(item.quantity.toFixed(2))), item.unit]))];
    const csv = rows.map((row) => row.map((field) => `"${field.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${recipeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-purchase-order.csv`; anchor.click(); URL.revokeObjectURL(url);
  };
  const copySummary = async () => { try { await navigator.clipboard.writeText(textSummary()); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
      <div className="modal-top"><div className="modal-icon"><Clipboard size={19} /></div><button type="button" className="icon-button modal-close" aria-label="Close purchase order" onClick={onClose}><X size={19} /></button></div>
      <div className="eyebrow">KITCHEN REQUISITION · {portions} PORTIONS</div><h2 id="purchase-title">Senarai Tempahan<br />Bahan</h2><p className="modal-subtitle">Purchase Order / Requisition Form <span>·</span> {recipeTitle}</p>
      <div className="summary-list">
        {groups.map((group) => <div className="summary-group" key={group.category}><h3>{group.category}</h3>{group.items.map((item) => <div className="summary-item" key={`${item.name}-${item.unit}`}><span className="check-box" /><span className="summary-name">{item.name}</span><strong>{formatQuantity(item.quantity, 2)} <small>{item.unit}</small></strong></div>)}</div>)}
        {groups.length === 0 && <p className="empty-summary">Add ingredients to see your purchasing list here.</p>}
      </div>
      <div className="modal-actions"><button type="button" className="button button-outline" onClick={() => window.print()}><Printer size={16} /> Print</button><button type="button" className="button button-outline" onClick={exportCsv}><Download size={16} /> Export CSV</button><button type="button" className="button button-primary" onClick={copySummary}>{copied ? <Check size={16} /> : <Clipboard size={16} />}{copied ? 'Copied!' : 'Copy summary'}</button></div>
      <div className="modal-footnote">Quantities include the wastage allowance you entered.</div>
    </section>
  </div>;
}
