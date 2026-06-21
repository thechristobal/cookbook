# Cookbook — TODO

## MVP (Current Sprint)
- [ ] Set up Supabase client (shared project from Strongman+)
- [ ] Auth screen (login / signup)
- [ ] Recipe List screen — home view, cards for each recipe
- [ ] Recipe Detail screen — view a recipe (title, description, ingredients, steps, tags)
- [ ] Create/Edit Recipe screen — full form with ingredient rows, step rows
- [ ] Delete recipe
- [ ] Basic navigation structure (stack + bottom tabs if needed)
- [ ] Deploy to Vercel

## Stretch Goals

### Collaboration
- [ ] **Recipe collaborators** — A recipe can have approved collaborators who can edit it alongside the owner
- [ ] **Personal saved copies (fork model)** — When a user saves someone else's recipe, they get their own editable copy; editing their copy does not affect the master recipe
- [ ] **Master update notification** — When the original (master) recipe is updated by its owner, users who have a saved copy see a banner/notification at the top letting them know the original changed, with an option to import the updated version (overwriting their copy or merging)

### Social
- [ ] Share recipes with friends (link sharing or in-app friend system)
- [ ] Like button on recipes
- [ ] Comment section under recipes

### Shopping List
- [ ] Select recipes for the week and auto-collate a grocery shopping list from ingredients
- [ ] Manual additions to the shopping list
- [ ] Check-off items in the shopping list at the store

### Strongman+ Integration
- [ ] Interface with Strongman+ app (TBD scope — future planning session)
- [ ] Auto-send nutrition info (macros / TDEE / calories) to Strongman+ based on recipe serving size
