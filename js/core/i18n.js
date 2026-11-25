import { spell } from './region.js';
// Interface strings. Wording is spelt for the country first, then values (like a learner's name) are filled in.
const D = {
  'app.name': 'Uplore English',
  'ui.next': 'Next', 'ui.back': 'Back', 'ui.close': 'Close', 'ui.hint': 'Hint', 'ui.check': 'Check', 'ui.ok': 'OK', 'ui.again': 'Play again', 'ui.home': 'Home',
  'ui.listen': 'Hear it again', 'ui.skip': 'Skip', 'ui.learn': 'Learn', 'ui.upNext': 'Up next', 'ui.settings': 'Settings', 'ui.cancel': 'Cancel',
  'ui.reset': 'Reset English progress', 'ui.resetConfirm': 'Tap again to reset', 'ui.delete': 'Delete',
  'track.sounds': 'Letter sounds', 'track.reading': 'Blending & spelling', 'track.tricky': 'Tricky words', 'track.words': 'Words & rhymes', 'track.stories': 'Stories',
  'track.spelling': 'Spelling', 'track.grammar': 'Grammar & punctuation', 'track.vocab': 'Vocabulary', 'track.comp': 'Reading', 'track.sentences': 'Sentences',
  'mode.little': 'Little Learners', 'mode.explore': 'Explorers', 'mode.achieve': 'Achievers', 'mode.adult': 'Adults', 'mode.auto': 'Auto (from age)',
  'status.new': 'New', 'status.learning': 'Learning', 'status.mastered': 'Mastered', 'status.review': 'Review due',
  'fb.try': 'Not quite. Try again.', 'fb.hint': "Here's a hint.", 'fb.solution': "Here's the answer", 'fb.gotit': 'Got it', 'fb.wellDone': 'Well done!',
  'res.score': '{c} of {n} right', 'res.coins': '+{n} coins', 'res.sticker': 'New sticker!', 'res.mastery': 'Mastery {p}%', 'res.best': 'Best: {n}', 'res.newBest': 'New personal best!',
  'ex.start': 'Start practice', 'lvl.yours': 'Your level',
  'g.progress': 'Progress', 'g.title': 'English settings', 'g.mode': 'Mode', 'g.note': 'English progress is backed up to your family account.',
  'g.onUplore': 'Learners, country, sound, the family account and sign-out are in Grown-ups on the Uplore home page.', 'g.openUplore': 'Open Grown-ups on Uplore',
  'pgate.title': 'For grown-ups', 'pgate.ask': 'Please answer to continue.', 'pgate.answer': 'Answer', 'pgate.wrong': 'Not quite. Try this one.',
  'prog.title': "{name}'s English", 'prog.notyet': 'not started yet', 'prog.score': 'Score', 'prog.empty': 'No lessons finished yet. Play a lesson and your progress shows up here!',
  'book.title': 'Sticker book', 'book.empty': 'Finish a lesson to win your first sticker!',
  'home.more': 'Lessons for teens and adults (advanced grammar, essays, workplace English) are being built. Until then, the Grades 2–8 lessons here are a good refresher.',
  'acc.again': 'Your sign-in has ended. Please sign in again.'
};
export function t(k, v = {}) { return spell(D[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? ''); }
export const tr = o => (o && typeof o === 'object') ? o.en : (o ?? '');
export const lang = () => 'en';
export const setLang = () => {};
export const VOICE_LANG = { en: 'en-IN' };
