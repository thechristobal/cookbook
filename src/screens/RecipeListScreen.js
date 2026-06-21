import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Platform, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';

export default function RecipeListScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { recipes, loading, fetchRecipes } = useRecipes();
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const webBg = Platform.OS === 'web' ? {
    background: `radial-gradient(ellipse at 80% 0%, rgba(212,98,42,0.08) 0%, transparent 50%)`,
    minHeight: '100vh',
  } : {};

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }, webBg]}>
      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: theme.navBg, borderBottomColor: theme.borderColor },
        Platform.OS === 'web' ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } : {},
      ]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cookbook</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.headerBtn}>
          <Text style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: theme.pageBg }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
          placeholder="Search recipes or tags..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {loading && recipes.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.accentBg} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={r => r.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchRecipes} tintColor={theme.accentBg} />}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyIcon]}>🍳</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                {search ? 'No recipes match your search' : 'No recipes yet'}
              </Text>
              <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
                {search ? 'Try a different term' : 'Tap + to add your first recipe'}
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accentBg }]}
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
  headerTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  headerBtn: { padding: 6 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 10 },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  list: { padding: 16, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', paddingTop: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptyBody: { fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 16px rgba(0,0,0,0.2)', cursor: 'pointer' } : {}),
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});
