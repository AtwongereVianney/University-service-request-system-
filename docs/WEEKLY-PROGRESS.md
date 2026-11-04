# USRS — weekly progression, commits and evidence

One application, built up across four stages. Nothing is restarted between stages.

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

## Frontend modules and API integration

The browser uses `src/js/api.js` for JSON requests to the local PHP backend.
`services.js` loads the service catalogue for the services page, homepage and
request form. `announcements.js` renders persisted notices on the home and
updates pages. `requestForm.js` submits requests and displays the reference
returned by the backend. The contact page loads its office details from MySQL.
`dom.js` centralizes HTML escaping for database values.

The page status messages cover loading, success, empty results and server errors.
The JavaScript modules use regular functions for callbacks and data processing;
PHP backend files use named functions, class methods and standard closures, not
PHP arrow functions.

---

## Stage 4 — PHP and MySQL persistence

The PHP API separates HTTP handling (`api/lib/Http.php`), PDO setup
(`api/lib/Database.php`), SQL repositories (`api/lib/*Repository.php`) and route
handlers (`api/*.php`). `database/schema.sql` creates and seeds services,
announcements, contact information and submitted requests. The frontend reads
the database-backed content and saves request submissions through the API.

### Local setup

1. Copy `.env.example` to `.env` and `.env.admin.example` to `.env.admin`.
   Set an app password in `.env` and administrator connection in `.env.admin`.
2. Run `php database\initialize.php` to create and seed the database and grant
   the app account limited access. Keep both files out of version control; the
   admin file can be removed after initialization.
3. Run `php -S 127.0.0.1:8000` and `npm run dev` in separate terminals.
4. Open `http://localhost:5173/`.

Static-only hosting instructions from the earlier stages do not apply to the
backend version. Deployment requires a PHP-capable web server and MySQL/MariaDB.

---

## Deployment

The backend version cannot run on static-only hosting. Deploy the Vite build,
`api/` PHP endpoints and MySQL database together to a PHP-capable web server.
Configure the `USRS_DB_*` runtime settings on the host; do not deploy local
`.env` files.

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

### Backend
- [ ] `database/schema.sql` showing the services, announcements and requests tables
- [ ] Services and announcements returned by the PHP endpoints
- [ ] Successful request submission showing a generated reference
- [ ] Saved request row in MySQL
- [ ] PHP logs and browser console without errors
