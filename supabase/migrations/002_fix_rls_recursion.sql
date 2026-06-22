-- Fixes infinite recursion between recipes and recipe_collaborators RLS policies.
-- The cycle: recipes policy queries recipe_collaborators, whose policy queries recipes.
-- Fix: use a SECURITY DEFINER function to check recipe ownership without triggering RLS.

CREATE OR REPLACE FUNCTION public.get_recipe_owner(p_recipe_id UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT owner_id FROM recipes WHERE id = p_recipe_id;
$$;

DROP POLICY IF EXISTS "Owner manages collaborators" ON recipe_collaborators;
DROP POLICY IF EXISTS "Collaborator can view their own entry" ON recipe_collaborators;

CREATE POLICY "Owner manages collaborators" ON recipe_collaborators
  FOR ALL USING (get_recipe_owner(recipe_id) = auth.uid());

CREATE POLICY "Collaborator can view their own entry" ON recipe_collaborators
  FOR SELECT USING (user_id = auth.uid());
