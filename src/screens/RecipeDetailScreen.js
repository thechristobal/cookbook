import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useRecipes } from '../contexts/RecipeContext';
import GlassCard from '../components/GlassCard';

export default function RecipeDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { deleteRecipe } = useRecipes();
  const [recipe, setRecipe] = useState(route.params.recipe);
  const [deleting, setDeleting] = useState(false);

  // Keep recipe in sync if navigating back from edit
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.updated) setRecipe(route.params.updated);
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  async function handleDelete() {
    if (Platform.OS === 'web') {
      if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    } else {
      Alert.alert('Delete recipe?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
      return;
    }
    doDelete();
  }

  async function doDelete() {
    setDeleting(true);
    const { error } = await deleteRecipe(recipe.id);
    if (error) { setDeleting(false); alert('Failed to delete: ' + error.message); return; }
    navigation.goBack();
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: theme.navBg, borderBottomColor: theme.borderColor },
        Platform.OS === 'web' ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } : {},
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.accentBg }]}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('RecipeForm', { recipe })}
          style={styles.editBtn}
        >
          <Text style={[styles.editText, { color: theme.accentBg }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{recipe.title}</Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            {recipe.prep_time_minutes > 0 && (
              <View style={[styles.metaBadge, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.metaBadgeLabel, { color: theme.textSecondary }]}>Prep</Text>
                <Text style={[styles.metaBadgeVal, { color: theme.accentBg }]}>{recipe.prep_time_minutes}m</Text>
              </View>
            )}
            {recipe.cook_time_minutes > 0 && (
              <View style={[styles.metaBadge, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.metaBadgeLabel, { color: theme.textSecondary }]}>Cook</Text>
                <Text style={[styles.metaBadgeVal, { color: theme.accentBg }]}>{recipe.cook_time_minutes}m</Text>
              </View>
            )}
            {totalTime > 0 && (
              <View style={[styles.metaBadge, { backgroundColor: theme.sessionBg }]}>
                <Text style={[styles.metaBadgeLabel, { color: theme.textSecondary }]}>Total</Text>
                <Text style={[styles.metaBadgeVal, { color: theme.textPrimary }]}>{totalTime}m</Text>
              </View>
            )}
            {recipe.servings > 0 && (
              <View style={[styles.metaBadge, { backgroundColor: theme.sessionBg }]}>
                <Text style={[styles.metaBadgeLabel, { color: theme.textSecondary }]}>Serves</Text>
                <Text style={[styles.metaBadgeVal, { color: theme.textPrimary }]}>{recipe.servings}</Text>
              </View>
            )}
          </View>

          {recipe.tags?.length > 0 && (
            <View style={styles.tags}>
              {recipe.tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
                  <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {recipe.description ? (
            <Text style={[styles.description, { color: theme.textSecondary }]}>{recipe.description}</Text>
          ) : null}
        </View>

        {/* Ingredients */}
        {recipe.ingredients?.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Ingredients</Text>
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={[styles.ingredientRow, { borderBottomColor: theme.borderColor }]}>
                <Text style={[styles.ingredientAmount, { color: theme.accentBg }]}>
                  {[ing.amount, ing.unit].filter(Boolean).join(' ')}
                </Text>
                <Text style={[styles.ingredientName, { color: theme.textPrimary }]}>{ing.name}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Steps */}
        {recipe.steps?.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Instructions</Text>
            {recipe.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNum, { backgroundColor: theme.accentBg }]}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: theme.textPrimary }]}>{step.text}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Delete */}
        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: theme.danger }]}
          onPress={handleDelete}
          disabled={deleting}
        >
          <Text style={[styles.deleteBtnText, { color: theme.danger }]}>
            {deleting ? 'Deleting...' : 'Delete recipe'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, fontWeight: '500' },
  editBtn: { padding: 4 },
  editText: { fontSize: 15, fontWeight: '600' },
  scroll: { padding: 20, paddingBottom: 60 },
  titleBlock: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginBottom: 14 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  metaBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  metaBadgeLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' },
  metaBadgeVal: { fontSize: 16, fontWeight: '700' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '500' },
  description: { fontSize: 15, lineHeight: 22 },
  section: { marginBottom: 16, padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, marginBottom: 14 },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  ingredientAmount: { fontSize: 14, fontWeight: '600', minWidth: 70 },
  ingredientName: { fontSize: 15, flex: 1 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22 },
  deleteBtn: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtnText: { fontSize: 14, fontWeight: '500' },
});
