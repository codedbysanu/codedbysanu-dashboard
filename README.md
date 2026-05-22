~/codedbysanu — dev dashboard
A live, interactive developer portfolio dashboard. Built entirely on a phone.
→ Live Demo
what it is
A single-page web app that pulls my real GitHub repositories via the public API and renders them inside a custom-built deep-space UI — no frameworks, no build tools, no laptop.
It's not a template. Every line was written in Termux + nano on Android, pushed from a phone running 5G in Beed, Maharashtra.
what's actually happening on screen
feature
how it works
interactive starfield
HTML5 Canvas — 55 nodes drift, connect via proximity lines, and scatter away from your finger using repulsion physics
terminal typewriter
async/await JS engine that sequences fake bash output character-by-character with human timing jitter
live clock
IST via toLocaleTimeString with Android WebView fallback
repo cards
GitHub REST API v3, fork-filtered, sorted by last updated, animated in via IntersectionObserver
rate limit handling
graceful 403 detection with user-facing error message
CRT scanlines
pure CSS repeating-linear-gradient texture overlay — zero JS cost
tech
Code
why it's built this way
Most portfolio projects are cloned from tutorials on a MacBook.
This one was designed from scratch, debugged in a mobile browser, and version-controlled via git push from a terminal emulator on Android. The constraint wasn't a choice — it was the environment. The output is the proof.
run it locally
Bash
No installs. No dependencies.
about
Saniya · @codedbysanu
Diploma student · AIML → targeting IT/CE lateral entry
Cybersecurity · web dev · Beed, Maharashtra
built at 3am on a phone. because why not.