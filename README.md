# ~/codedbysanu - dev dashboard

> A live, interactive developer portfolio. Built entirely on a phone.

**[→ Live Demo](https://codedbysanu.github.io/codedbysanu-dashboard)**

---

## what it is

A single-page web app that fetches my real GitHub repos via the public API and renders them inside a custom deep-space UI. no frameworks, no build tools, no laptop.

Every line written in **Termux + nano** on Android. Pushed from a phone.
---

## features

**Interactive Starfield** - HTML5 Canvas engine. 55 nodes drift, draw proximity connection lines, and scatter away from your finger using repulsion physics.

**Terminal Typewriter** - async/await JS sequences fake bash output character-by-character with randomized timing jitter so it reads human, not robotic.

**Live GitHub Feed** - REST API v3, fork-filtered, sorted by last updated, animated in via IntersectionObserver on scroll.

**Rate Limit Handling** - catches 403s and surfaces a readable error instead of silently breaking.

**CRT Scanline Texture** - pure CSS repeating-linear-gradient overlay. Zero JS. Pure atmosphere.

---

## stack

HTML · CSS · Vanilla JavaScript
no frameworks · no npm · no build step

---

## run locally

git clone https://github.com/codedbysanu/codedbysanu-dashboard.git
cd codedbysanu-dashboard
python -m http.server 8000
No installs. No dependencies. Open `localhost:8000`.

---

## the constraint

Most portfolio projects are cloned from tutorials on a MacBook.

This one was architected from scratch, debugged in a mobile browser, and shipped via `git push` from a terminal emulator on Android. The limitation wasn't an excuse. It became the project.

---

**Saniya** · [@codedbysanu](https://github.com/codedbysanu) 

*built at 3am. on a phone. because why not.*
```
