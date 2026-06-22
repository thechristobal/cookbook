import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const BC = 'BarlowCondensed_700Bold';
const BC_SB = 'BarlowCondensed_600SemiBold';
const BC_REG = 'BarlowCondensed_400Regular';

const ACCENT_COLORS = ['#D4622A', '#6B9E77', '#7B68C8', '#C8685A', '#4A90A4', '#C4923A'];

function accentForId(id) {
  if (!id) return ACCENT_COLORS[0];
  const n = id.charCodeAt(0) + (id.charCodeAt(1) || 0);
  return ACCENT_COLORS[n % ACCENT_COLORS.length];
}

function tagEmoji(tag) {
  const t = tag.toLowerCase();
  if (t.includes('chicken')) return '🍗';
  if (t.includes('beef') || t.includes('steak')) return '🥩';
  if (t.includes('pasta') || t.includes('noodle')) return '🍝';
  if (t.includes('salad')) return '🥗';
  if (t.includes('soup')) return '🍲';
  if (t.includes('dessert') || t.includes('cake') || t.includes('sweet')) return '🍰';
  if (t.includes('breakfast')) return '🍳';
  if (t.includes('fish') || t.includes('seafood')) return '🐟';
  if (t.includes('vegan') || t.includes('veggie') || t.includes('vegetarian')) return '🥦';
  if (t.includes('pizza')) return '🍕';
  if (t.includes('taco') || t.includes('mexican')) return '🌮';
  if (t.includes('sandwich') || t.includes('burger')) return '🥪';
  return '🍽️';
}

export default function RecipeCard({ recipe, onPress }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const accent = accentForId(recipe.id);
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  const emoji = recipe.tags?.[0] ? tagEmoji(recipe.tags[0]) : '🍽️';

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, damping: 12, stiffness: 300, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 300, useNativeDriver: true }).start();
  };

  const cardShadow = Platform.OS === 'web' ? {
    boxShadow: `0 2px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)`,
    transition: 'box-shadow 0.2s ease, transform 0.15s ease',
  } : {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  };

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[styles.card, { backgroundColor: theme.cardBgGlass, borderColor: theme.borderColor }, cardShadow,
          Platform.OS === 'web' ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } : {},
        ]}
      >
        {/* Top accent border */}
        <View style={[styles.topAccent, { backgroundColor: accent }]} />

        {/* Image or color block */}
        {recipe.image_url ? (
          <View style={styles.imageWrap}>
            <Image source={{ uri: recipe.image_url }} style={styles.image} resizeMode="cover" />
            {totalTime > 0 && (
              <View style={styles.timePill}>
                <Text style={[styles.timePillText, { fontFamily: BC_SB }]}>{totalTime}m</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.colorBlock, { backgroundColor: accent }]}>
            <Text style={styles.emoji}>{emoji}</Text>
            {totalTime > 0 && (
              <View style={styles.timePill}>
                <Text style={[styles.timePillText, { fontFamily: BC_SB }]}>{totalTime}m</Text>
              </View>
            )}
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.textPrimary, fontFamily: BC }]} numberOfLines={2}>
            {recipe.title}
          </Text>

          {recipe.description ? (
            <Text style={[styles.description, { color: theme.textSecondary, fontFamily: BC_REG }]} numberOfLines={2}>
              {recipe.description}
            </Text>
          ) : null}

          {recipe.tags?.length > 0 && (
            <View style={styles.tags}>
              {recipe.tags.slice(0, 3).map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
                  <Text style={[styles.tagText, { color: theme.tagText, fontFamily: BC_SB }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: { flex: 1 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flex: 1,
  },
  topAccent: { height: 3 },
  imageWrap: { height: 120, position: 'relative' },
  image: { width: '100%', height: '100%' },
  colorBlock: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 38 },
  timePill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timePillText: { color: '#fff', fontSize: 11 },
  info: { padding: 12, gap: 4 },
  title: { fontSize: 15, letterSpacing: 0.2, lineHeight: 19 },
  description: { fontSize: 12, lineHeight: 17, letterSpacing: 0.1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  tag: { borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2 },
  tagText: { fontSize: 10, letterSpacing: 0.3 },
});
