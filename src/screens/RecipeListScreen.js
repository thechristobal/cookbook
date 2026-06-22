import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Platform, TextInput, ActivityIndicator, RefreshControl, useWindowDimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useRecipes } from '../contexts/RecipeContext';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard';

const BC = 'BarlowCondensed_700Bold';
const BC_REG = 'BarlowCondensed_400Regular';

export default function RecipeListScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { recipes, loading, fetchRecipes } = useRecipes();
  const { signOut } = useAuth();
  const [search, setSearch] = useState('');
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 4 : width >= 640 ? 3 : 2;

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const accent = theme.accentBg;

  const pageBg = Platform.OS === 'web' ? {
    background: `
      radial-gradient(ellipse at 85% 5%, ${accent}10 0%, transparent 45%),
      radial-gradient(ellipse at 10% 90%, ${accent}07 0%, transparent 45%),
      ${theme.pageBg}
    `,
    minHeight: '100vh',
  } : { backgroundColor: theme.pageBg };

  const headerWeb = Platform.OS === 'web' ? {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    backgroundColor: theme.navBg + 'E8',
  } : { backgroundColor: theme.navBg };

  const shimmerTitle = Platform.OS === 'web' ? {
    background: `linear-gradient(90deg, ${theme.textPrimary}80 0%, ${theme.textPrimary}cc 30%, ${theme.textPrimary} 50%, ${theme.textPrimary}cc 70%, ${theme.textPrimary}80 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'cb-shimmer 12s linear infinite',
  } : { color: theme.textPrimary };

  const fabShadow = Platform.OS === 'web' ? {
    boxShadow: `0 4px 24px ${accent}70`,
    cursor: 'pointer',
  } : {
    shadowColor: accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  };

  return (
    <View style={[styles.root, pageBg]}>
      {/* Header */}
      <View style={[styles.header, headerWeb, { borderBottomColor: theme.borderColor }]}>
        <Text style={[styles.headerTitle, shimmerTitle]}>Cookbook</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleTheme} style={styles.headerBtn}>
            <Text style={{ fontSize: 17 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.headerBtn}>
            <Text style={[styles.signOutText, { color: theme.textSecondary, fontFamily: BC_REG }]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Accent line under header */}
      <View style={[styles.accentLine, Platform.OS === 'web' ? {
        background: `linear-gradient(90deg, transparent 0%, ${accent}40 25%, ${accent}80 50%, ${accent}40 75%, transparent 100%)`,
      } : { backgroundColor: accent + '40' }]} />

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText, fontFamily: BC_REG }]}
          placeholder="Search recipes or tags..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {loading && recipes.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={r => r.id}
          numColumns={numColumns}
          key={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchRecipes} tintColor={accent} />}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍳</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary, fontFamily: BC }]}>
                {search ? 'No recipes found' : 'No recipes yet'}
              </Text>
              <Text style={[styles.emptyBody, { color: theme.textSecondary, fontFamily: BC_REG }]}>
                {search ? 'Try a different search term' : 'Tap + to add your first recipe'}
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: accent }, fabShadow]}
        onPress={() => navigation.navigate('RecipeForm', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'BarlowCondensed_700Bold',
    letterSpacing: 1,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerBtn: { padding: 6 },
  signOutText: { fontSize: 14, letterSpacing: 0.3 },
  accentLine: { height: 1 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 10 },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  list: { padding: 12, paddingBottom: 100 },
  row: { gap: 12, marginBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { fontSize: 52, marginBottom: 6 },
  emptyTitle: { fontSize: 22, letterSpacing: 0.5 },
  emptyBody: { fontSize: 15, letterSpacing: 0.3 },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { color: '#fff', fontSize: 30, fontWeight: '300', lineHeight: 34 },
});
