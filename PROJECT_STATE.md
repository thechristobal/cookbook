# Cookbook — Project State

**Current name:** Cookbook (placeholder — final name TBD)
**GitHub:** https://github.com/thechristobal/cookbook
**Stack:** React Native + Expo (same stack as Strongman+) • Supabase (shared project with Strongman+) • Vercel (deploy target)
**Design direction:** Light-first, food-friendly aesthetic with glassmorphism and polished UI suitable for a portfolio

---

## Session Log

### 2026-06-20 — Session 1
- Explored Strongman+ codebase for design/stack context
- Configured Claude Code permissions (bypassPermissions already set globally; added additionalDirectories for cookbook and strongman_plus)
- Scaffolded blank Expo project via `npx create-expo-app@latest` (Expo 56, RN 0.85, React 19)
- Created GitHub repo: https://github.com/thechristobal/cookbook
- Built full CRUD MVP: Auth, RecipeList, RecipeDetail, RecipeForm screens
- Built ThemeContext (light/dark), AuthContext, RecipeContext
- Built GlassCard and RecipeCard components with glassmorphism (web backdrop-filter)
- Created Supabase SQL migration (001_cookbook_tables.sql) — needs to be run manually in Supabase SQL editor
- Web build verified clean (681 modules, no errors)
- Pushed to GitHub

---

## Where We Left Off

Full CRUD MVP is built and pushed. **One manual step needed:** run `supabase/migrations/001_cookbook_tables.sql` in the Supabase SQL editor to create the `recipes`, `recipe_collaborators`, and `user_saved_recipes` tables.

**Next steps:**
1. Run the SQL migration in Supabase
2. Deploy to Vercel (connect GitHub repo → auto-deploy)
3. Test auth + CRUD end-to-end in browser
4. Add sign-out button to RecipeList header
5. Polish: loading states, error toasts, swipe-to-delete on list
6. Consider adding profile screen / account management

---

## Architecture Decisions

- **Supabase:** Share the existing Strongman+ Supabase project; add new tables (`recipes`, `recipe_collaborators`, `user_saved_recipes`) rather than spinning up a second project (avoids bandwidth split)
- **Deployment:** Vercel, same as Strongman+
- **State:** Context API (same pattern as Strongman+)
- **Storage:** AsyncStorage for offline/instant load + Supabase for cloud sync

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-20 | Project created; Expo scaffold; GitHub repo created |
| 2026-06-20 | Full CRUD MVP built — all screens, navigation, Supabase client, glassmorphism theme, SQL migration |
