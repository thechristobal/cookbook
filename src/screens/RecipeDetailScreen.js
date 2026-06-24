import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, Alert, Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useRecipes } from '../contexts/RecipeContext';
import GlassCard from '../components/GlassCard';

const BC = 'BarlowCondensed_700Bold';
const BC_SB = 'BarlowCondensed_600SemiBold';
const BC_REG = 'BarlowCondensed_400Regular';

export default function RecipeDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { deleteRecipe } = useRecipes();
  const [recipe, setRecipe] = useState(route.params.recipe);
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.updated) setRecipe(route.params.updated);
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  const accent = theme.accentBg;

  async function handleDelete() {
    if (Platform.OS === 'web') {
      if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
      doDelete();
    } else {
      Alert.alert('Delete recipe?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  }

  async function doDelete() {
    setDeleting(true);
    const { error } = await deleteRecipe(recipe.id);
    if (error) { setDeleting(false); alert('Failed to delete: ' + error.message); return; }
    navigation.goBack();
  }

  const pageBg = Platform.OS === 'web' ? {
    background: `
      radial-gradient(ellipse at 90% 5%, ${accent}08 0%, transparent 40%),
      ${theme.pageBg}
    `,
    minHeight: '100vh',
  } : { backgroundColor: theme.pageBg };

  const headerWeb = Platform.OS === 'web' ? {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    backgroundColor: theme.navBg + 'E8',
  } : { backgroundColor: theme.navBg };

  return (
    <View style={[styles.root, pageBg]}>
      {/* Header */}
      <View style={[styles.header, headerWeb, { borderBottomColor: theme.borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Text style={[styles.navBtnText, { color: accent, fontFamily: BC_SB }]}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RecipeForm', { recipe })} style={styles.navBtn}>
          <Text style={[styles.navBtnText, { color: accent, fontFamily: BC_SB }]}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.accentLine, Platform.OS === 'web' ? {
        background: `linear-gradient(90deg, transparent 0%, ${accent}40 25%, ${accent}80 50%, ${accent}40 75%, transparent 100%)`,
      } : { backgroundColor: accent + '40' }]} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero image */}
        {recipe.image_url && (
          <View style={styles.heroImage}>
            <Image source={{ uri: recipe.image_url }} style={styles.heroImg} resizeMode="cover" />
            <View style={[styles.heroGradient, Platform.OS === 'web' ? {
              background: `linear-gradient(to bottom, transparent 40%, ${theme.pageBg} 100%)`,
            } : { backgroundColor: 'transparent' }]} />
          </View>
        )}

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.textPrimary, fontFamily: BC }]}>{recipe.title}</Text>

          {recipe.description ? (
            <Text style={[styles.description, { color: theme.textSecondary, fontFamily: BC_REG }]}>
              {recipe.description}
            </Text>
          ) : null}

          {/* Meta badges */}
          {(recipe.prep_time_minutes > 0 || recipe.cook_time_minutes > 0 || recipe.servings > 0) && (
            <View style={styles.metaRow}>
              {recipe.prep_time_minutes > 0 && (
                <View style={[styles.metaBadge, { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.metaLabel, { color: theme.textSecondary, fontFamily: BC_REG }]}>PREP</Text>
                  <Text style={[styles.metaVal, { color: accent, fontFamily: BC }]}>{recipe.prep_time_minutes}m</Text>
                </View>
              )}
              {recipe.cook_time_minutes > 0 && (
                <View style={[styles.metaBadge, { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.metaLabel, { color: theme.textSecondary, fontFamily: BC_REG }]}>COOK</Text>
                  <Text style={[styles.metaVal, { color: accent, fontFamily: BC }]}>{recipe.cook_time_minutes}m</Text>
                </View>
              )}
              {totalTime > 0 && (
                <View style={[styles.metaBadge, { backgroundColor: theme.sessionBg }]}>
                  <Text style={[styles.metaLabel, { color: theme.textSecondary, fontFamily: BC_REG }]}>TOTAL</Text>
                  <Text style={[styles.metaVal, { color: theme.textPrimary, fontFamily: BC }]}>{totalTime}m</Text>
                </View>
              )}
              {recipe.servings > 0 && (
                <View style={[styles.metaBadge, { backgroundColor: theme.sessionBg }]}>
                  <Text style={[styles.metaLabel, { color: theme.textSecondary, fontFamily: BC_REG }]}>SERVES</Text>
                  <Text style={[styles.metaVal, { color: theme.textPrimary, fontFamily: BC }]}>{recipe.servings}</Text>
                </View>
              )}
            </View>
          )}

          {recipe.tags?.length > 0 && (
            <View style={styles.tags}>
              {recipe.tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
                  <Text style={[styles.tagText, { color: theme.tagText, fontFamily: BC_SB }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Ingredients */}
        {recipe.ingredients?.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontFamily: BC }]}>Ingredients</Text>
            <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={[styles.ingredientRow, { borderBottomColor: theme.borderColor }]}>
                <Text style={[styles.ingredientAmount, { color: accent, fontFamily: BC_SB }]}>
                  {[ing.amount, ing.unit].filter(Boolean).join(' ')}
                </Text>
                <Text style={[styles.ingredientName, { color: theme.textPrimary, fontFamily: BC_REG }]}>{ing.name}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Steps */}
        {recipe.steps?.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontFamily: BC }]}>Instructions</Text>
            <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
            {recipe.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNum, { backgroundColor: accent }]}>
                  <Text style={[styles.stepNumText, { fontFamily: BC }]}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: theme.textPrimary, fontFamily: BC_REG }]}>{step.text}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Delete */}
        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: theme.danger + '60' }]}
          onPress={handleDelete}
          disabled={deleting}
        >
          <Text style={[styles.deleteBtnText, { color: theme.danger, fontFamily: BC_SB }]}>
            {deleting ? 'Deleting...' : 'Delete Recipe'}
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
  navBtn: { padding: 4 },
  navBtnText: { fontSize: 16, letterSpacing: 0.5 },
  accentLine: { height: 1 },
  scroll: { paddingBottom: 60 },
  heroImage: { height: 260, position: 'relative', marginBottom: -20 },
  heroImg: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  titleBlock: { marginBottom: 20, gap: 12, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 36, letterSpacing: -0.5, lineHeight: 40 },
  description: { fontSize: 15, lineHeight: 23, letterSpacing: 0.2 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 64,
  },
  metaLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  metaVal: { fontSize: 20, letterSpacing: 0 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  tagText: { fontSize: 13, letterSpacing: 0.5 },
  section: { marginBottom: 16, padding: 20, marginHorizontal: 20 },
  sectionTitle: { fontSize: 20, letterSpacing: 1, marginBottom: 6 },
  sectionAccent: { height: 2, width: 32, borderRadius: 1, marginBottom: 14 },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  ingredientAmount: { fontSize: 14, minWidth: 80, letterSpacing: 0.3 },
  ingredientName: { fontSize: 15, flex: 1, letterSpacing: 0.2 },
  stepRow: { flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'flex-start' },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { color: '#fff', fontSize: 14 },
  stepText: { flex: 1, fontSize: 15, lineHeight: 23, letterSpacing: 0.2 },
  deleteBtn: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 20,
  },
  deleteBtnText: { fontSize: 15, letterSpacing: 1 },
});
