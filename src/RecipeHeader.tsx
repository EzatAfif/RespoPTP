import { Minus, Plus, Scale } from 'lucide-react';

type RecipeHeaderProps = {
  title: string;
  onTitleChange: (title: string) => void;
  portions: number;
  onPortionsChange: (portions: number) => void;
  basePortions: number;
};

export default function RecipeHeader({ title, onTitleChange, portions, onPortionsChange, basePortions }: RecipeHeaderProps) {
  const setPortions = (value: number) => onPortionsChange(Math.max(1, Math.min(10000, Math.round(value) || 1)));
  return (
    <section className="hero-card">
      <div className="hero-topline">
        <div className="hero-tag"><span className="status-dot" /> RECIPE WORKSPACE</div>
        <div className="hero-utility"><Scale size={15} /> Base recipe · {basePortions} portions</div>
      </div>
      <label className="recipe-title-label" htmlFor="recipe-title">Your recipe</label>
      <input id="recipe-title" className="recipe-title-input" value={title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Name this recipe…" />
      <div className="portion-bar">
        <div className="portion-copy"><span className="portion-kicker">SCALE YOUR RECIPE</span><strong>How many portions?</strong></div>
        <div className="portion-controls">
          <button type="button" className="step-button" aria-label="Decrease portions" onClick={() => setPortions(portions - 1)}><Minus size={16} /></button>
          <input aria-label="Target portions" type="number" min="1" max="10000" step="1" value={portions} onChange={(event) => setPortions(Number(event.target.value))} />
          <button type="button" className="step-button" aria-label="Increase portions" onClick={() => setPortions(portions + 1)}><Plus size={16} /></button>
        </div>
        <div className="scale-factor"><span>Scale factor</span><strong>{(portions / basePortions).toLocaleString('en-MY', { maximumFractionDigits: 2 })}<small>×</small></strong></div>
      </div>
    </section>
  );
}
