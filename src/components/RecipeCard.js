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
  // Proteins
  if (t.includes('chicken')) return '🍗';
  if (t.includes('beef') || t.includes('steak') || t.includes('brisket')) return '🥩';
  if (t.includes('pork') || t.includes('bacon') || t.includes('ham') || t.includes('ribs')) return '🥓';
  if (t.includes('lamb')) return '🍖';
  if (t.includes('fish') || t.includes('salmon') || t.includes('tuna') || t.includes('cod')) return '🐟';
  if (t.includes('seafood') || t.includes('shrimp') || t.includes('prawn') || t.includes('lobster') || t.includes('crab')) return '🦐';
  if (t.includes('turkey')) return '🦃';
  if (t.includes('egg')) return '🥚';
  // Dishes
  if (t.includes('pasta') || t.includes('noodle') || t.includes('spaghetti') || t.includes('ramen')) return '🍝';
  if (t.includes('pizza')) return '🍕';
  if (t.includes('burger')) return '🍔';
  if (t.includes('sandwich') || t.includes('sub') || t.includes('wrap')) return '🥪';
  if (t.includes('taco') || t.includes('burrito') || t.includes('mexican')) return '🌮';
  if (t.includes('sushi') || t.includes('japanese')) return '🍱';
  if (t.includes('curry') || t.includes('indian')) return '🍛';
  if (t.includes('stir fry') || t.includes('stir-fry') || t.includes('chinese')) return '🥘';
  if (t.includes('soup') || t.includes('stew') || t.includes('chili') || t.includes('chowder')) return '🍲';
  if (t.includes('salad')) return '🥗';
  if (t.includes('rice') || t.includes('risotto') || t.includes('fried rice')) return '🍚';
  if (t.includes('bread') || t.includes('bake') || t.includes('loaf') || t.includes('roll')) return '🍞';
  if (t.includes('pizza')) return '🍕';
  if (t.includes('hot dog') || t.includes('hotdog')) return '🌭';
  if (t.includes('dumpling') || t.includes('gyoza') || t.includes('potsticker')) return '🥟';
  if (t.includes('kebab') || t.includes('skewer') || t.includes('bbq') || t.includes('grill')) return '🍢';
  if (t.includes('roast')) return '🍖';
  // Produce
  if (t.includes('vegan') || t.includes('veggie') || t.includes('vegetarian') || t.includes('plant')) return '🥦';
  if (t.includes('mushroom')) return '🍄';
  if (t.includes('tomato')) return '🍅';
  if (t.includes('corn')) return '🌽';
  if (t.includes('avocado')) return '🥑';
  if (t.includes('potato') || t.includes('fries')) return '🥔';
  if (t.includes('carrot')) return '🥕';
  // Meals
  if (t.includes('breakfast') || t.includes('brunch')) return '🍳';
  if (t.includes('lunch')) return '🥙';
  if (t.includes('dinner') || t.includes('supper')) return '🍽️';
  if (t.includes('snack') || t.includes('appetizer') || t.includes('starter')) return '🧆';
  if (t.includes('side')) return '🥣';
  // Drinks & sweet
  if (t.includes('smoothie') || t.includes('juice') || t.includes('drink') || t.includes('cocktail')) return '🥤';
  if (t.includes('coffee') || t.includes('espresso') || t.includes('latte')) return '☕';
  if (t.includes('tea')) return '🍵';
  if (t.includes('dessert') || t.includes('sweet') || t.includes('pudding') || t.includes('mousse')) return '🍮';
  if (t.includes('cake') || t.includes('cupcake')) return '🎂';
  if (t.includes('cookie') || t.includes('biscuit') || t.includes('brownie')) return '🍪';
  if (t.includes('ice cream') || t.includes('gelato') || t.includes('sorbet')) return '🍦';
  if (t.includes('pie') || t.includes('tart')) return '🥧';
  if (t.includes('chocolate')) return '🍫';
  if (t.includes('candy') || t.includes('sweet')) return '🍬';
  if (t.includes('pancake') || t.includes('waffle')) return '🧇';
  // Misc
  if (t.includes('cheese')) return '🧀';
  if (t.includes('sauce') || t.includes('dip') || t.includes('dressing')) return '🫙';
  if (t.includes('slow cooker') || t.includes('crockpot') || t.includes('instant pot')) return '🫕';
  if (t.includes('air fryer')) return '🍟';
  if (t.includes('quick') || t.includes('easy') || t.includes('simple') || t.includes('30 min')) return '⚡';
  if (t.includes('healthy') || t.includes('low carb') || t.includes('keto') || t.includes('paleo')) return '💪';
  if (t.includes('gluten free') || t.includes('gluten-free')) return '🌾';
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
