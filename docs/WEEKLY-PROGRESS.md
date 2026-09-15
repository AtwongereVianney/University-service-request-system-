# USRS — weekly progression, commits and evidence

One application, built up across three weeks. Nothing is restarted between weeks.

---

## Week 1 — basic application

**Files created:** `index.html`, `src/css/style.css`, `src/js/main.js`,
`package.json`, `vite.config.js`, `.gitignore`, `README.md`

**Delivered:** home/hero, how the process works, featured services, about, service
catalogue (9 services), request form, contact, navigation, footer, local dev server,
Git repository, remote repository, public deployment.

### Commit plan (run these as you build, not all at once)

| # | Command | What it represents |
|---|---|---|
| 1 | `git commit -m "Initialize University Service Request System with Vite build setup"` | Project scaffold: package.json, vite.config.js, .gitignore, empty entry files. Proves a working development environment. |
| 2 | `git commit -m "Add site header, main navigation and homepage hero section"` | The shell of the application and the navigation requirement. |
| 3 | `git commit -m "Add university service catalogue with nine service cards"` | The services requirement, with realistic named services and handling offices. |
| 4 | `git commit -m "Add service request form and contact information sections"` | The request form and contact requirements. |
| 5 | `git commit -m "Add about section, footer and project documentation"` | The about section, the professional footer and the README. |

```bash
git init
git branch -M main
git add .
git commit -m "Initialize University Service Request System with Vite build setup"
# ...work, then repeat: git add <files> && git commit -m "<message>"
git remote add origin https://github.com/<your-username>/university-service-request-system.git
git push -u origin main
```

Useful extras:

```bash
git status            # what changed
git log --oneline     # evidence of meaningful history
git branch            # list branches
git branch week2-responsive && git checkout week2-responsive   # optional feature branch
git checkout main && git merge week2-responsive
```

---

## Week 2 — responsive web design

**Files changed:** `index.html` (semantic elements, viewport meta, nav toggle button),
`src/css/style.css` (rewritten mobile-first), `src/js/navigation.js` (new).

### Commits

| # | Message | What it represents |
|---|---|---|
| 6 | `Restructure markup with semantic HTML5 elements and viewport meta` | header/nav/main/section/article/aside/footer/address; the viewport meta tag. |
| 7 | `Implement mobile-first base styles and responsive navigation` | Base (phone) styles plus the Menu button and its JavaScript toggle. |
| 8 | `Add tablet and desktop breakpoints using CSS Grid and Flexbox` | Media queries at 768px, 1024px and 1440px; grid layouts for cards, form and footer. |

### Breakpoint map

| Width | Navigation | Service / notice cards | Contact cards | Form | Footer |
|---|---|---|---|---|---|
| 360px (base) | Menu button, links stacked | 1 column | 1 column | fields stacked | stacked |
| 768px | horizontal bar | 2 columns | 2 columns | reg. no. + phone side by side | 3 columns |
| 1024px | horizontal bar | 3 columns | 4 columns | form beside its explanation | 3 columns |
| 1440px | horizontal bar | 3 columns, wider shell | 4 columns | as above | 3 columns |

### Responsive testing in Chrome DevTools

1. Open the running site, press **F12** (or Ctrl+Shift+I).
2. Press **Ctrl+Shift+M** to turn on the device toolbar.
3. Set the dropdown to **Responsive** and type the width into the box: `360`, then
   `768`, then `1024`. For desktop, switch the device toolbar off.
4. At each width check the list below, then screenshot with Ctrl+Shift+P →
   *Capture screenshot* (or *Capture full size screenshot*).
5. Drag the width handle slowly from 360 to 1440 and watch for any layout that breaks
   between the tested widths.

### Week 2 checklist

- [ ] No horizontal scrollbar at 360px (scroll sideways — nothing should move)
- [ ] Navigation opens and closes with the Menu button on mobile
- [ ] Navigation is a horizontal bar from 768px and the Menu button is gone
- [ ] Service cards: 1 → 2 → 3 columns and nothing is clipped
- [ ] Form fields are full width on mobile and easy to tap (44px targets)
- [ ] Select and textarea do not overflow their container
- [ ] Footer stacks on mobile, three columns on tablet and above
- [ ] Headings scale between breakpoints rather than just shrinking
- [ ] Icons/images scale with their card
- [ ] Keyboard focus is visible on every link, button and field

---

## Week 3 — modern JavaScript and the Fetch API

**Files changed:** `src/js/main.js` (entry point), new `src/js/services.js`,
`src/js/requestForm.js`, `src/js/announcements.js`; `index.html` gains the
"Latest service information" section; `style.css` gains the notice card and status styles.

### Commits

| # | Message | What it represents |
|---|---|---|
| 9 | `Split client-side logic into ES6 modules with a single entry point` | Module structure, no global variables. |
| 10 | `Add service request form behaviour with ES6+ syntax` | Pre-fill from cards, submission summary, destructuring/spread/rest in real use. |
| 11 | `Fetch and render service information from public REST API with loading and error states` | The Week 3 Fetch API requirement, rendered in the page. |

### ES6+ feature map

| Feature | Where | Why it is there |
|---|---|---|
| `const` / `let` | every module | `const` by default; `let` only where a value is reassigned |
| Arrow functions | `findCategory`, `toHeadline`, event callbacks | short callbacks that keep the surrounding `this` |
| Template literals | `noticeTemplate`, `summaryTemplate`, `createReference` | build HTML and reference strings without concatenation |
| Destructuring | `toServiceNotice({ id, title, body, ... })`, `const { name, office } = ...`, `const { requestService } = button.dataset`, `({ key }) => ...` | name only the fields actually used |
| Spread | `[...records]`, `{ ...entries, submittedAt }`, `{ ...rest, categoryName }` | copy instead of mutate; merge objects |
| Rest | `...extra` in `toServiceNotice`, `...requiredFields` in `findEmptyFields` | keep unused API fields; accept any number of field names |
| `async` / `await` | `fetchServiceData`, `loadServiceUpdates` | read the network code top to bottom |
| Fetch API | `fetchServiceData` | the HTTP request itself |
| ES modules | `import` / `export` across five files | one responsibility per file |
| Optional chaining / nullish | `refreshButton?.addEventListener`, `?? fallback` | tolerate a missing element or unknown category |

### Testing the API states

| State | How to trigger | Expected screen |
|---|---|---|
| Loading | DevTools → Network → throttle to **Slow 3G**, reload | "Loading service information..." |
| Success | Normal connection | Six notice cards with office, headline, summary, reference |
| Failure | DevTools → Network → **Offline**, click "Reload notices" | "Unable to load service information at the moment. Please try again later." plus a Try again button |
| Empty | Temporarily set `NOTICE_COUNT` handling by returning `[]` from `fetchServiceData` | "No service notices have been published yet." |

---

## Deployment (Netlify, no credit card, works from a laptop)

1. Push the repository to GitHub.
2. Sign in to netlify.com with the GitHub account.
3. **Add new site → Import an existing project → GitHub →** pick the repository.
4. Build command: `npm run build`. Publish directory: `dist`. Deploy.
5. Copy the generated URL into the README (section 11). Every later push redeploys.

GitHub Pages alternative:

```bash
npm run build
npx gh-pages -d dist        # after: npm install --save-dev gh-pages
```

Then in the repository: **Settings → Pages → Branch: `gh-pages` → /(root)**.
`vite.config.js` already sets `base: './'`, which is what makes a project-page URL work.

---

## Evidence to capture

### Week 1
- [ ] Terminal showing `node -v`, `npm -v` and `npm run dev` running
- [ ] Browser at `http://localhost:5173` showing the homepage
- [ ] Screenshot of each section: home, about, services, request form, contact
- [ ] Navigation in use (before/after clicking a link)
- [ ] `git log --oneline` showing five or more meaningful commits
- [ ] GitHub repository page
- [ ] Live deployment URL open in a browser with the address bar visible

### Week 2
- [ ] 360px screenshot (full page)
- [ ] 768px screenshot
- [ ] 1024px screenshot
- [ ] Desktop screenshot
- [ ] Mobile navigation open
- [ ] Cards at two different breakpoints side by side
- [ ] Form at 360px showing full-width fields
- [ ] Footer at mobile and desktop
- [ ] Proof of no horizontal overflow at 360px
- [ ] The media query block in `style.css`

### Week 3
- [ ] `announcements.js` open in the editor showing `async/await` and `fetch`
- [ ] Loading state captured under Slow 3G
- [ ] Rendered notice cards on the page
- [ ] Error state captured while Offline
- [ ] DevTools **Network** tab showing the request to `jsonplaceholder.typicode.com/posts`
      with status 200 and the JSON preview
- [ ] Console with no errors
- [ ] Final deployed application showing the API section live
