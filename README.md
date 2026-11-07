# KitchenLab · Smart Recipe Scaler

A responsive culinary workspace for scaling recipes, converting metric measurements and preparing consolidated ingredient requisitions.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Features

- Scale recipe quantities from their original base portions, with quick portion presets.
- Convert grams/kilograms and millilitres/litres without mixing weight and volume.
- Create, edit, search, favorite and delete recipes.
- Build requisition lists across recipes, consolidate matching ingredients, print and export CSV.
- Browse the ingredient database and saved requisition history.
- Local-first persistence using browser localStorage; no Supabase setup is required.
- Seven sample recipes, each based on two portions.

## Data

Recipe and requisition data stay in the current browser profile. Use Settings to restore the initial sample recipe collection.
