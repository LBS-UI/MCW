# Multimedia Club intro system

The four original intros stay in `public/Website-intro's`.
The integrated copies are in `public/website-intros/scenes`.

- `01-cinematic-reveal.html` — first visit
- `02-chaotic-verity.html` — occasional returning visit
- `03-creative-studio.html` — when the page opens on `#projects`
- `04-interactive-loading.html` — occasional playful surprise

`intro-manager.js` chooses one scene, shows it in a full-screen iframe, and removes it when the scene finishes or the visitor clicks Skip intro.

Preferences:

- `mmc_intro_skip=1` means Always Skip
- `mmc_intro_seen` marks the first visit
- `mmc_intro_last` is the last time an intro played

Reduced motion skips the intro. The real homepage remains underneath and is usable after Skip.
