import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const BC = 'BarlowCondensed_700Bold';
const BC_SB = 'BarlowCondensed_600SemiBold';
const BC_REG = 'BarlowCondensed_400Regular';

export const PRESET_TAGS = [
  // Meal type
  'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack', 'Appetizer', 'Side', 'Dessert',
  // Proteins
  'Chicken', 'Beef', 'Pork', 'Lamb', 'Fish', 'Salmon', 'Shrimp', 'Seafood', 'Turkey', 'Egg',
  // Diet
  'Vegetarian', 'Vegan', 'Gluten Free', 'Keto', 'Paleo', 'Low Carb', 'Healthy',
  // Cuisine
  'Italian', 'Mexican', 'Japanese', 'Chinese', 'Indian', 'Thai', 'Mediterranean', 'American', 'French',
  // Dish type
  'Pasta', 'Pizza', 'Soup', 'Salad', 'Sandwich', 'Burger', 'Taco', 'Curry', 'Stir Fry',
  'Rice', 'Bread', 'Roast', 'BBQ', 'Grill',
  // Method / time
  'Quick', 'Easy', 'Slow Cooker', 'Air Fryer', 'One Pan', 'Meal Prep',
  // Sweet
  'Cake', 'Cookie', 'Pie', 'Ice Cream', 'Chocolate', 'Pancake',
];

function autoSuggest(title) {
  if (!title) return [];
  const t = title.toLowerCase();
  return PRESET_TAGS.filter(tag => t.includes(tag.toLowerCase()));
}

export default function TagPicker({ tags, onChange, recipeTitle = '' }) {
  const { theme } = useTheme();
  const [custom, setCustom] = useState('');
  const suggestions = autoSuggest(recipeTitle).filter(s => !tags.includes(s));

  function toggle(tag) {
    if (tags.includes(tag)) {
      onChange(tags.filter(t => t !== tag));
    } else {
      onChange([...tags, tag]);
    }
  }

  function addCustom() {
    const trimmed = custom.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setCustom('');
  }

  return (
    <View style={styles.root}>
      {/* Auto-suggestions from title */}
      {suggestions.length > 0 && (
        <View style={styles.suggestRow}>
          <Text style={[styles.suggestLabel, { color: theme.textSecondary, fontFamily: BC_REG }]}>
            Suggested
          </Text>
          <View style={styles.chips}>
            {suggestions.map(tag => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggle(tag)}
                style={[styles.chip, styles.chipSuggested, { borderColor: theme.accentBg, backgroundColor: theme.accentLight }]}
              >
                <Text style={[styles.chipText, { color: theme.accentBg, fontFamily: BC_SB }]}>+ {tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Selected tags */}
      {tags.length > 0 && (
        <View style={styles.chips}>
          {tags.map(tag => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggle(tag)}
              style={[styles.chip, styles.chipActive, { backgroundColor: theme.accentBg }]}
            >
              <Text style={[styles.chipText, { color: '#fff', fontFamily: BC_SB }]}>{tag} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Custom input */}
      <View style={styles.customRow}>
        <TextInput
          style={[styles.customInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText, fontFamily: BC_REG }]}
          placeholder="Add custom tag..."
          placeholderTextColor={theme.textSecondary}
          value={custom}
          onChangeText={setCustom}
          onSubmitEditing={addCustom}
          returnKeyType="done"
        />
        {custom.trim().length > 0 && (
          <TouchableOpacity onPress={addCustom} style={[styles.addBtn, { backgroundColor: theme.accentBg }]}>
            <Text style={[styles.addBtnText, { fontFamily: BC }]}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Preset grid */}
      <ScrollView style={styles.presetScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <View style={styles.chips}>
          {PRESET_TAGS.filter(t => !tags.includes(t) && !suggestions.includes(t)).map(tag => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggle(tag)}
              style={[styles.chip, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
            >
              <Text style={[styles.chipText, { color: theme.textSecondary, fontFamily: BC_REG }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 10 },
  suggestRow: { gap: 6 },
  suggestLabel: { fontSize: 11, letterSpacing: 0.8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipActive: { borderColor: 'transparent' },
  chipSuggested: { borderStyle: 'dashed' },
  chipText: { fontSize: 13, letterSpacing: 0.3 },
  customRow: { flexDirection: 'row', gap: 8 },
  customInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
  },
  addBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 14, letterSpacing: 0.5 },
  presetScroll: { maxHeight: 160 },
});
