import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, getUserId } from '../lib/supabase';
import { useAuth } from './AuthContext';

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = useCallback(async () => {
    if (!user) { setRecipes([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });
    if (!error) setRecipes(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  async function createRecipe(fields) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('recipes')
      .insert({ ...fields, owner_id: userId })
      .select()
      .single();
    if (!error) setRecipes(prev => [data, ...prev]);
    return { data, error };
  }

  async function updateRecipe(id, fields) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (!error) setRecipes(prev => prev.map(r => r.id === id ? data : r));
    return { data, error };
  }

  async function deleteRecipe(id) {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) setRecipes(prev => prev.filter(r => r.id !== id));
    return { error };
  }

  return (
    <RecipeContext.Provider value={{ recipes, loading, fetchRecipes, createRecipe, updateRecipe, deleteRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
}

export const useRecipes = () => useContext(RecipeContext);
