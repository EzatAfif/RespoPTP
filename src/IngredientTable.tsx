import { ClipboardList, Plus, Trash2 } from 'lucide-react';
import type { Unit } from './UnitConverterUtility';
import { formatQuantity, purchasingQuantity } from './UnitConverterUtility';

export type Category = 'Dry Goods' | 'Chilled / Dairy' | 'Meat / Poultry' | 'Produce / Vegetables';
export type Ingredient = { id: string; name: string; quantity: number; unit: Unit; category: Category; wastage: number };

const units: Unit[] = ['g', 'kg', 'ml', 'L', 'unit', 'pinch'];
const categories: Category[] = ['Dry Goods', 'Chilled / Dairy', 'Meat / Poultry', 'Produce / Vegetables'];

type IngredientTableProps = {
  ingredients: Ingredient[];
  portions: number;
  basePortions: number;
  lockUnits: boolean;
  onChange: (id: string, patch: Partial<Ingredient>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onOpenSummary: () => void;
};

export default function IngredientTable({ ingredients, portions, basePortions, lockUnits, onChange, onRemove, onAdd, onOpenSummary }: IngredientTableProps) {
  const factor = portions / basePortions;
  return (
    <section className="panel ingredient-panel">
      <div className="section-heading">
        <div><div className="eyebrow">THE RECIPE BREAKDOWN</div><h2>Ingredients <span className="count-pill">{ingredients.length}</span></h2><p>Quantities update instantly as you scale.</p></div>
        <button className="button button-primary requisition-button" type="button" onClick={onOpenSummary}><ClipboardList size={17} /> Build purchase order</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>INGREDIENT</th><th>BASE QTY <span className="th-sub">({basePortions} portions)</span></th><th>TO BUY <span className="th-sub">({portions} portions)</span></th><th>CATEGORY</th><th>WASTAGE</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {ingredients.map((ingredient) => {
              const scaled = ingredient.quantity * factor * (1 + ingredient.wastage / 100);
              const display = purchasingQuantity(scaled, ingredient.unit, lockUnits);
              return <tr key={ingredient.id}>
                <td><input className="cell-input ingredient-name" aria-label="Ingredient name" value={ingredient.name} placeholder="Ingredient name" onChange={(event) => onChange(ingredient.id, { name: event.target.value })} /></td>
                <td><div className="quantity-cell"><input className="cell-input quantity-input" aria-label="Base quantity" type="number" min="0" step="any" value={ingredient.quantity} onChange={(event) => onChange(ingredient.id, { quantity: Math.max(0, Number(event.target.value) || 0) })} /><select aria-label="Unit" value={ingredient.unit} onChange={(event) => onChange(ingredient.id, { unit: event.target.value as Unit })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></div></td>
                <td><div className="scaled-cell"><strong>{formatQuantity(display.quantity, display.unit === 'g' || display.unit === 'ml' ? 1 : 2)}</strong><span>{display.unit}</span>{ingredient.wastage > 0 && <span className="yield-indicator">+{ingredient.wastage}%</span>}</div></td>
                <td><select className="category-select" aria-label="Ingredient category" value={ingredient.category} onChange={(event) => onChange(ingredient.id, { category: event.target.value as Category })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></td>
                <td><div className="wastage-cell"><input aria-label="Wastage percentage" type="number" min="0" max="200" value={ingredient.wastage} onChange={(event) => onChange(ingredient.id, { wastage: Math.max(0, Math.min(200, Number(event.target.value) || 0)) })} /><span>%</span></div></td>
                <td><button className="icon-button delete-button" type="button" aria-label={`Remove ${ingredient.name || 'ingredient'}`} onClick={() => onRemove(ingredient.id)}><Trash2 size={16} /></button></td>
              </tr>;
            })}
            {ingredients.length === 0 && <tr><td colSpan={6} className="empty-row">Your ingredient list is empty. Add your first ingredient to get started.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer"><button className="add-ingredient" type="button" onClick={onAdd}><span><Plus size={16} /></span> Add an ingredient</button><span className="table-hint">Wastage is added to the purchasing quantity.</span></div>
    </section>
  );
}
