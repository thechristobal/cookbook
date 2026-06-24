import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Platform, ActivityIndicator, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useRecipes } from '../contexts/RecipeContext';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import TagPicker from '../components/TagPicker';

const BC = 'BarlowCondensed_700Bold';
const BC_SB = 'BarlowCondensed_600SemiBold';
const BC_REG = 'BarlowCondensed_400Regular';

const emptyIngredient = () => ({ name: '', amount: '', unit: '' });
const emptyStep = () => ({ text: '' });

export default function RecipeFormScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { createRecipe, updateRecipe } = useRecipes();
  const existing = route.params?.recipe;
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [servings, setServings] = useState(String(existing?.servings ?? ''));
  const [prepTime, setPrepTime] = useState(String(existing?.prep_time_minutes ?? ''));
  const [cookTime, setCookTime] = useState(String(existing?.cook_time_minutes ?? ''));
  const [tags, setTags] = useState(existing?.tags ?? []);
  const [ingredients, setIngredients] = useState(
    existing?.ingredients?.length ? existing.ingredients : [emptyIngredient()]
  );
  const [steps, setSteps] = useState(
    existing?.steps?.length ? existing.steps : [emptyStep()]
  );
  const [imageUri, setImageUri] = useState(existing?.image_url ?? null);
  const [imageChanged, setImageChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageChanged(true);
    }
  }

  async function uploadImage(recipeId, uri) {
    const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const path = `${recipeId}.${ext}`;
    const response = await fetch(uri);
    const blob = await response.blob();
    const { error } = await supabase.storage
      .from('recipe-images')
      .upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
    if (error) return null;
    const { data } = supabase.storage.from('recipe-images').getPublicUrl(path);
    return data.publicUrl;
  }

  function updateIngredient(i, field, val) {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));
  }

  function addIngredient() { setIngredients(prev => [...prev, emptyIngredient()]); }
  function removeIngredient(i) { setIngredients(prev => prev.filter((_, idx) => idx !== i)); }

  function updateStep(i, val) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { text: val } : s));
  }
  function addStep() { setSteps(prev => [...prev, emptyStep()]); }
  function removeStep(i) { setSteps(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    if (!title.trim()) { setError('Recipe title is required.'); return; }
    setError('');
    setSaving(true);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      servings: parseInt(servings) || null,
      prep_time_minutes: parseInt(prepTime) || null,
      cook_time_minutes: parseInt(cookTime) || null,
      tags,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.text.trim()),
    };

    let result;
    if (isEdit) {
      result = await updateRecipe(existing.id, payload);
      if (!result.error && imageChanged && imageUri) {
        const url = await uploadImage(existing.id, imageUri);
        if (url) result = await updateRecipe(existing.id, { image_url: url });
      }
    } else {
      result = await createRecipe(payload);
      if (!result.error && imageChanged && imageUri) {
        const url = await uploadImage(result.data.id, imageUri);
        if (url) result = await updateRecipe(result.data.id, { image_url: url });
      }
    }

    setSaving(false);
    if (result.error) { setError(result.error.message ?? 'Save failed.'); return; }

    if (isEdit) {
      navigation.replace('RecipeDetail', { recipe: result.data, updated: result.data });
    } else {
      navigation.replace('RecipeDetail', { recipe: result.data });
    }
  }

  const inputStyle = [styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }];
  const labelStyle = [styles.label, { color: theme.textSecondary }];

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: theme.navBg, borderBottomColor: theme.borderColor },
        Platform.OS === 'web' ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } : {},
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.accentBg, fontFamily: BC_SB }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary, fontFamily: BC }]}>
          {isEdit ? 'Edit Recipe' : 'New Recipe'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
          {saving
            ? <ActivityIndicator color={theme.accentBg} size="small" />
            : <Text style={[styles.saveText, { color: theme.accentBg, fontFamily: BC }]}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

        {/* Photo */}
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.85}
          style={[styles.imagePicker, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
              <View style={styles.imageOverlay}>
                <Text style={[styles.imageOverlayText, { fontFamily: BC_SB }]}>Change Photo</Text>
              </View>
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>📷</Text>
              <Text style={[styles.imagePickerText, { color: theme.textSecondary, fontFamily: BC_REG }]}>Add a photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Basics */}
        <GlassCard style={styles.section}>
          <Text style={labelStyle}>Title *</Text>
          <TextInput style={inputStyle} value={title} onChangeText={setTitle} placeholder="Recipe name" placeholderTextColor={theme.textSecondary} />

          <Text style={labelStyle}>Description</Text>
          <TextInput style={[inputStyle, styles.multiline]} value={description} onChangeText={setDescription} placeholder="A short description..." placeholderTextColor={theme.textSecondary} multiline numberOfLines={3} textAlignVertical="top" />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={labelStyle}>Servings</Text>
              <TextInput style={inputStyle} value={servings} onChangeText={setServings} placeholder="4" placeholderTextColor={theme.textSecondary} keyboardType="numeric" />
            </View>
            <View style={styles.half}>
              <Text style={labelStyle}>Prep (min)</Text>
              <TextInput style={inputStyle} value={prepTime} onChangeText={setPrepTime} placeholder="15" placeholderTextColor={theme.textSecondary} keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.half}>
            <Text style={labelStyle}>Cook (min)</Text>
            <TextInput style={inputStyle} value={cookTime} onChangeText={setCookTime} placeholder="30" placeholderTextColor={theme.textSecondary} keyboardType="numeric" />
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontFamily: BC }]}>Tags</Text>
          <TagPicker tags={tags} onChange={setTags} recipeTitle={title} />
        </GlassCard>

        {/* Ingredients */}
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Ingredients</Text>
          {ingredients.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <TextInput
                style={[inputStyle, styles.amountInput]}
                value={ing.amount}
                onChangeText={v => updateIngredient(i, 'amount', v)}
                placeholder="Amt"
                placeholderTextColor={theme.textSecondary}
              />
              <TextInput
                style={[inputStyle, styles.unitInput]}
                value={ing.unit}
                onChangeText={v => updateIngredient(i, 'unit', v)}
                placeholder="Unit"
                placeholderTextColor={theme.textSecondary}
              />
              <TextInput
                style={[inputStyle, styles.nameInput]}
                value={ing.name}
                onChangeText={v => updateIngredient(i, 'name', v)}
                placeholder="Ingredient"
                placeholderTextColor={theme.textSecondary}
              />
              {ingredients.length > 1 && (
                <TouchableOpacity onPress={() => removeIngredient(i)} style={styles.removeBtn}>
                  <Text style={{ color: theme.danger, fontSize: 18 }}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addIngredient} style={[styles.addRowBtn, { borderColor: theme.accentBg }]}>
            <Text style={[styles.addRowText, { color: theme.accentBg }]}>+ Add ingredient</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Steps */}
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Instructions</Text>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: theme.accentBg }]}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <TextInput
                style={[inputStyle, styles.stepInput]}
                value={step.text}
                onChangeText={v => updateStep(i, v)}
                placeholder={`Step ${i + 1}...`}
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
              />
              {steps.length > 1 && (
                <TouchableOpacity onPress={() => removeStep(i)} style={styles.removeBtn}>
                  <Text style={{ color: theme.danger, fontSize: 18 }}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addStep} style={[styles.addRowBtn, { borderColor: theme.accentBg }]}>
            <Text style={[styles.addRowText, { color: theme.accentBg }]}>+ Add step</Text>
          </TouchableOpacity>
        </GlassCard>
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
  backBtn: { padding: 4, minWidth: 60 },
  backText: { fontSize: 15 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  saveBtn: { padding: 4, minWidth: 60, alignItems: 'flex-end' },
  saveText: { fontSize: 15, fontWeight: '600' },
  scroll: { padding: 16, paddingBottom: 60 },
  error: { fontSize: 13, marginBottom: 12, paddingHorizontal: 4 },
  imagePicker: {
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 12,
    overflow: 'hidden',
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imageIcon: { fontSize: 36 },
  imagePickerText: { fontSize: 15, letterSpacing: 0.3 },
  imageOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    alignItems: 'center',
  },
  imageOverlayText: { color: '#fff', fontSize: 14, letterSpacing: 0.5 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, letterSpacing: 0.5, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '500', marginBottom: 4, letterSpacing: 0.3 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  multiline: { minHeight: 80, paddingTop: 10 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  ingredientRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 2 },
  amountInput: { width: 64, marginBottom: 0 },
  unitInput: { width: 72, marginBottom: 0 },
  nameInput: { flex: 1, marginBottom: 0 },
  removeBtn: { padding: 4 },
  addRowBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  addRowText: { fontSize: 14, fontWeight: '500' },
  stepRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexShrink: 0,
  },
  stepNumText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  stepInput: { flex: 1, minHeight: 60, paddingTop: 10 },
});
