-- Run this in your Supabase SQL editor (same project as Strongman+)

CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  servings INT,
  prep_time_minutes INT,
  cook_time_minutes INT,
  tags TEXT[] DEFAULT '{}',
  ingredients JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  can_edit BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, user_id)
);

-- Fork-on-save: user's personal editable copy of someone else's recipe
CREATE TABLE IF NOT EXISTS user_saved_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  master_recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  servings INT,
  prep_time_minutes INT,
  cook_time_minutes INT,
  tags TEXT[] DEFAULT '{}',
  ingredients JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  master_updated_at TIMESTAMPTZ,
  has_unread_update BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, master_recipe_id)
);

-- RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_recipes ENABLE ROW LEVEL SECURITY;

-- recipes: owner full access; collaborators read (edit enforced in app); public recipes readable by all
CREATE POLICY "Owner manages their recipes" ON recipes
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Collaborators can read recipes" ON recipes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipe_collaborators
      WHERE recipe_id = recipes.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public recipes are readable" ON recipes
  FOR SELECT USING (is_public = true);

-- recipe_collaborators: owner of the recipe manages
CREATE POLICY "Owner manages collaborators" ON recipe_collaborators
  FOR ALL USING (
    EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND owner_id = auth.uid())
  );

CREATE POLICY "Collaborator can view their own entry" ON recipe_collaborators
  FOR SELECT USING (user_id = auth.uid());

-- user_saved_recipes: each user manages only their own saved copies
CREATE POLICY "User manages their saved recipes" ON user_saved_recipes
  FOR ALL USING (auth.uid() = user_id);
