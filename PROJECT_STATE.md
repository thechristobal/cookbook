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
- Scaffolded blank Expo project via `npx create-expo-app@latest`
- Created GitHub repo: https://github.com/thechristobal/cookbook
- Created PROJECT_STATE.md and TODO.md
- **Status:** Repo initialized, nothing built yet — next session starts at CRUD recipe screen implementation

---

## Where We Left Off

Project is scaffolded (blank Expo app) and pushed to GitHub. No screens built yet.

**Next steps:**
1. Add Supabase client (reuse existing Strongman+ project — new tables only)
2. Build Auth screen (reuse pattern from Strongman+)
3. Build Recipe List screen (home)
4. Build Recipe Detail / View screen
5. Build Create / Edit Recipe screen
6. Wire up CRUD to Supabase

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
