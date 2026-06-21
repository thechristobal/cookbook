import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function RecipeCard({ recipe, onPress }) {
  const { theme } = useTheme();

  const webGlass = Platform.OS === 'web' ? {
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  } : {};

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBgGlass,
          borderColor: theme.borderColor,
        },
        webGlass,
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={2}>
          {recipe.title}
        </Text>
        {totalTime > 0 && (
          <View style={[styles.timeBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.timeText, { color: theme.accentBg }]}>{totalTime}m</Text>
          </View>
        )}
      </View>

      {recipe.description ? (
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {recipe.description}
        </Text>
      ) : null}

      {recipe.tags?.length > 0 && (
        <View style={styles.tags}>
          {recipe.tags.slice(0, 4).map(tag => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
              <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {recipe.servings ? `${recipe.servings} servings` : ''}
          {recipe.servings && recipe.ingredients?.length ? '  ·  ' : ''}
          {recipe.ingredients?.length ? `${recipe.ingredients.length} ingredients` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  timeBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
  },
});
