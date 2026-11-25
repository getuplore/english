# Uplore English

English for the whole family, part of [Uplore](https://getuplore.github.io/). Pip is the mascot.

**Live site:** https://getuplore.github.io/english/ (GitHub Pages from `main`).

## How it fits with Uplore

- **Sign-in and learners** come from the Uplore home page (same web address, shared storage `pipmaths.v1` and `pipmaths.session`). English opens straight into the learner chosen on Uplore; with no sign-in or no chosen learner it goes back to Uplore.
- **English progress** is kept per learner in `uplore.english.v1` on the device and backed up to the Supabase table `English_schema.progress` (one row per learner).
- **Grown-ups** (learners, country, sound, family account, Admin) are on the Uplore home page. English settings (behind the grown-ups sum) has Progress, Reset English progress and a link to Grown-ups.

## Supabase (once)

1. SQL Editor → paste `supabase/setup.sql` → Run.
2. Project Settings → Data API → Exposed schemas: add `English_schema` (next to `Math_schema`).

Until then English still works, and progress stays on the device.

## Building

The page loads one packed file, `js/app.js` (older iPads too). After changing anything in `js/` or `css/app.css`:

```
./build.sh
```

## How it's organised

- `content/skills.json`: the lessons (track, level, question maker, settings, "Learn first" intro).
- `js/content/words.js`: word bank with pictures, sound groups, tricky words, rhymes, picture words, stories (all original).
- `js/content/generators.js`: question makers (fresh questions every time, each with a hint and the answer).
- `js/content/explainers.js`: "Learn first" introductions.
- `js/engine/`: lesson player (hints, worked answers, mastery, stickers) and activity templates (choose, blend, spell, story).
- `js/core/`: storage, account and sync, country spelling (British for India, UK and Canada; American for the USA), sounds and voice, drawings (Pip, mouth pictures for letter sounds).

## Lessons so far (Little Learners, JK to Grade 1)

Letter sounds in six groups (s a t p · i n m d · g o c k · e u r h ck · b f l j · v w x y z qu) with mouth pictures, first sounds, blending, spelling, tricky words, rhymes, picture words (animals, food, colours, body, clothes, home, travel) and six short stories with questions. 33 lessons.

The device voice says whole words only; letter sounds are taught with the letter, a mouth picture and example words.

## Tests

`python3 tests/flows_english.py` (needs Python Playwright, Chrome, and clones of `getuplore.github.io` and `maths` next to this repo). It uses a stand-in for Supabase.
