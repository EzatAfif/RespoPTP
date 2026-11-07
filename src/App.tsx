import { ArrowDownUp, ChefHat, ChevronDown, CircleHelp, Leaf, Plus, RotateCcw, ShoppingBasket, Sparkles, Utensils } from 'lucide-react';
import { useMemo, useState } from 'react';
import IngredientTable, { type Ingredient } from './IngredientTable';
import PurchasingSummaryModal from './PurchasingSummaryModal';
import RecipeHeader from './RecipeHeader';

type Recipe = { id: string; title: string; ingredients: Ingredient[] };
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const sampleRecipes: Recipe[] = [
  { id: 'rendang', title: 'Chicken Rendang', ingredients: [
    { id: 'r1', name: 'Chicken, cut into pieces', quantity: 800, unit: 'g', category: 'Meat / Poultry', wastage: 5 },
    { id: 'r2', name: 'Coconut milk', quantity: 400, unit: 'ml', category: 'Chilled / Dairy', wastage: 0 },
    { id: 'r3', name: 'Lemongrass', quantity: 2, unit: 'unit', category: 'Produce / Vegetables', wastage: 10 },
    { id: 'r4', name: 'Shallots', quantity: 120, unit: 'g', category: 'Produce / Vegetables', wastage: 10 },
    { id: 'r5', name: 'Rendang spice paste', quantity: 80, unit: 'g', category: 'Dry Goods', wastage: 0 },
    { id: 'r6', name: 'Kaffir lime leaves', quantity: 4, unit: 'unit', category: 'Produce / Vegetables', wastage: 5 },
  ] },
  { id: 'soup', title: 'Mushroom Soup', ingredients: [
    { id: 's1', name: 'Button mushrooms', quantity: 250, unit: 'g', category: 'Produce / Vegetables', wastage: 10 },
    { id: 's2', name: 'Vegetable stock', quantity: 500, unit: 'ml', category: 'Dry Goods', wastage: 0 },
    { id: 's3', name: 'Cooking cream', quantity: 100, unit: 'ml', category: 'Chilled / Dairy', wastage: 0 },
    { id: 's4', name: 'Butter', quantity: 25, unit: 'g', category: 'Chilled / Dairy', wastage: 0 },
    { id: 's5', name: 'Onion', quantity: 60, unit: 'g', category: 'Produce / Vegetables', wastage: 10 },
    { id: 's6', name: 'Plain flour', quantity: 15, unit: 'g', category: 'Dry Goods', wastage: 0 },
  ] },
];
const newIngredient = (): Ingredient => ({ id: makeId(), name: '', quantity: 0, unit: 'g', category: 'Dry Goods', wastage: 0 });

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [activeId, setActiveId] = useState('rendang');
  const [portions, setPortions] = useState(2);
  const [lockUnits, setLockUnits] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const activeRecipe = recipes.find((recipe) => recipe.id === activeId) ?? recipes[0];
  const ingredients = activeRecipe?.ingredients ?? [];
  const totals = useMemo(() => ({ ingredients: ingredients.length, categories: new Set(ingredients.map((item) => item.category)).size }), [ingredients]);

  const updateRecipe = (updater: (recipe: Recipe) => Recipe) => setRecipes((current) => current.map((recipe) => recipe.id === activeId ? updater(recipe) : recipe));
  const updateIngredient = (id: string, patch: Partial<Ingredient>) => updateRecipe((recipe) => ({ ...recipe, ingredients: recipe.ingredients.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  const addIngredient = () => updateRecipe((recipe) => ({ ...recipe, ingredients: [...recipe.ingredients, newIngredient()] }));
  const removeIngredient = (id: string) => updateRecipe((recipe) => ({ ...recipe, ingredients: recipe.ingredients.filter((item) => item.id !== id) }));
  const addRecipe = () => { const recipe = { id: makeId(), title: 'Untitled recipe', ingredients: [] }; setRecipes((current) => [...current, recipe]); setActiveId(recipe.id); setPortions(2); };
  const switchRecipe = (id: string) => { setActiveId(id); setPortions(2); };
  const activeTitle = activeRecipe?.title ?? 'Untitled recipe';

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#home" aria-label="mise home"><span className="brand-mark"><Utensils size={18} /></span><span>mise<span className="brand-period">.</span></span></a><div className="topbar-center"><span className="breadcrumb-muted">Kitchen tools</span><span className="breadcrumb-slash">/</span><span>Recipe scaler</span></div><div className="topbar-right"><span className="saved-status"><span /> All changes saved</span><div className="avatar">K</div></div></header>
    <main className="main-content">
      <div className="page-intro"><div><div className="eyebrow intro-eyebrow"><span className="eyebrow-line" /> CULINARY PLANNING, SIMPLIFIED</div><h1>From your recipe<br className="mobile-break" /> to the <span>right amount.</span></h1><p>Scale confidently. Shop smarter. Bring every kitchen order together.</p></div><div className="intro-art"><div className="art-circle art-circle-one"/><div className="art-circle art-circle-two"/><div className="art-card"><ChefHat size={27}/><span>PREP<br/>MADE EASY</span></div><Sparkles className="art-sparkle" size={17}/></div></div>
      <div className="recipe-toolbar"><div className="recipe-tabs" role="tablist" aria-label="Recipes">{recipes.map((recipe) => <button key={recipe.id} type="button" role="tab" aria-selected={recipe.id === activeId} className={`recipe-tab ${recipe.id === activeId ? 'active' : ''}`} onClick={() => switchRecipe(recipe.id)}><span className="tab-indicator"/>{recipe.title}</button>)}</div><button type="button" className="new-recipe-button" onClick={addRecipe}><Plus size={15}/> New recipe</button><button type="button" className="recipe-menu" aria-label="Recipe options"><ChevronDown size={16}/></button></div>
      <RecipeHeader title={activeTitle} onTitleChange={(title) => updateRecipe((recipe) => ({ ...recipe, title }))} portions={portions} onPortionsChange={setPortions} basePortions={2}/>
      <div className="workspace-label"><div><span className="workspace-icon"><ShoppingBasket size={15}/></span><strong>Ingredient planner</strong><span className="workspace-divider">/</span><span>Plan your purchasing list</span></div><button type="button" className={`unit-mode ${lockUnits ? 'locked' : ''}`} onClick={() => setLockUnits((value) => !value)}><ArrowDownUp size={14}/><span>{lockUnits ? 'Precision units' : 'Smart units'}</span><span className="toggle-track"><span/></span></button></div>
      <IngredientTable ingredients={ingredients} portions={portions} basePortions={2} lockUnits={lockUnits} onChange={updateIngredient} onRemove={removeIngredient} onAdd={addIngredient} onOpenSummary={() => setSummaryOpen(true)}/>
      <div className="bottom-note"><div className="note-icon"><Leaf size={17}/></div><div><strong>A little extra goes a long way.</strong><span>Set wastage per ingredient to account for trimming and prep yield.</span></div><CircleHelp size={16} className="help-icon"/></div>
      <div className="workspace-footer"><span><span className="footer-check">✓</span> Recipe ready to scale</span><span>{totals.ingredients} ingredients <span className="footer-dot">·</span> {totals.categories} categories <span className="footer-dot">·</span> 2 portion base</span></div>
      <div className="reset-row"><button type="button" onClick={() => { const recipe = sampleRecipes.find((item) => item.id === activeId); if (recipe) updateRecipe((current) => ({ ...current, title: recipe.title, ingredients: recipe.ingredients.map((item) => ({ ...item })) })); else updateRecipe((current) => ({ ...current, title: 'Untitled recipe', ingredients: [] })); setPortions(2); }}><RotateCcw size={13}/> Reset recipe</button><span>Built for the way kitchens work <span className="tiny-heart">♥</span></span></div>
    </main>
    <footer className="site-footer"><span>mise<span className="brand-period">.</span> <span>Kitchen planning, made thoughtful.</span></span><span>Good food starts with good prep <Utensils size={13}/></span></footer>
    <PurchasingSummaryModal open={summaryOpen} onClose={() => setSummaryOpen(false)} ingredients={ingredients} portions={portions} basePortions={2} recipeTitle={activeTitle} lockUnits={lockUnits}/>
  </div>;
}
