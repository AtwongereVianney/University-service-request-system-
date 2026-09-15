# University Service Request System (USRS)

A student-facing web application where university students can see the services the
university offers and submit a service request online, instead of queuing at the
front desk or sending requests through informal channels.

Built for **BSE 4103 – Advanced Internet Programming**, progressive individual
practical coursework. This repository currently contains the **Weeks 1–3** build.

---

## 1. Problem being addressed

Service requests at the university reach the offices through many uncoordinated
channels: paper slips at a counter, personal phone calls, and messages to staff.
The result is that:

- a request can be lost between a desk, an inbox and a phone;
- students repeat the same information to several offices;
- offices cannot say how many requests are pending, or how long they take;
- students who are off campus, or who are free only outside office hours, are stuck.

USRS collects every request as one structured record, with the details the handling
office actually needs, in a form students can reach from a phone at any hour.

## 2. Main objectives

1. Present the university's services in one catalogue students can browse.
2. Provide a single structured request form that routes to the correct office.
3. Work properly on a phone, a tablet and a desktop.
4. Show live service information fetched from a public REST API.
5. Stay structured so later weeks can add validation, a backend, a database,
   authentication and an administrative dashboard without a rebuild.

## 3. Technologies used

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 — custom properties, Flexbox, CSS Grid, media queries |
| Behaviour | Vanilla JavaScript, ES6+ modules |
| Build tool / dev server | Vite |
| Package manager | npm |
| Version control | Git and GitHub |
| External data | JSONPlaceholder public REST API |

No framework, no backend and no database are used at this stage — those belong to
later weeks of the coursework.

## 4. Features implemented in Week 1

- Home page with title, explanation, call to action and a "Submit a request" button
- "How a request moves" — a four-step explanation of the process
- Featured services on the home page
- About section: what the system is, why it was built, and what students and the
  university gain from it
- Service catalogue with nine realistic university services, each with a name,
  description, icon, handling office and a "Request service" button
- Request form: full name, registration number, email, phone, service category,
  subject and description
- Contact section: office address, email addresses, telephone numbers, opening hours
- Site navigation linking Home, About, Services, Request a service and Contact
- Professional footer
- Runs on the Vite local development server
- Git repository with meaningful commits, pushed to GitHub, deployed publicly

## 5. Features added in Week 2

- Semantic HTML5 structure: `header`, `nav`, `main`, `section`, `article`, `aside`,
  `footer`, `address`
- All styling in one external stylesheet, `src/css/style.css`
- Mobile-first CSS: the base rules are the phone layout; media queries at
  **768px** and **1024px** add the wider layouts, plus **1440px** to cap line length
- CSS Grid for the service cards, notice cards, contact cards, about columns,
  footer and the hero split
- Flexbox for the header bar, button rows, form field stacks and footer bottom bar
- Responsive navigation: a Menu button below 768px, a horizontal bar above it
- Responsive cards: 1 column → 2 columns at 768px → 3 columns at 1024px
- Responsive form: fields stack on a phone, registration number and phone number sit
  side by side from 768px, and the form moves beside its explanation at 1024px
- Responsive footer: stacked on a phone, three columns from 768px
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Flexible images and SVG (`max-width: 100%; height: auto`)
- `overflow-x: hidden` on the body plus fluid widths — no horizontal scrolling
- 44px minimum touch targets on buttons and form controls
- Visible keyboard focus, a skip link, and `prefers-reduced-motion` respected

## 6. Features added in Week 3

- JavaScript split into ES6 modules: `main.js`, `navigation.js`, `requestForm.js`,
  `announcements.js`, `services.js`
- **Latest service information** section on the home page, filled at runtime from a
  public REST API using `fetch()` and `async/await`
- Four interface states for that section: loading, success, empty response and failure
- "Reload notices" and "Try again" controls that re-run the request
- Service card buttons that pre-select the category and move the student to the form
- Form submission that builds a request object and renders a summary with a
  generated reference number (no storage yet — that is a later week)
- Responsive navigation behaviour with `aria-expanded` kept in step

## 7. Project structure

```
university-service-request-system/
├── index.html                  # single page: header, all sections, footer
├── package.json                # scripts and the Vite dependency
├── vite.config.js              # relative base path for static hosting
├── .gitignore
├── README.md
├── docs/
│   └── WEEKLY-PROGRESS.md      # what each week added, commit plan, test checklist
└── src/
    ├── css/
    │   └── style.css           # the only stylesheet (mobile-first)
    ├── js/
    │   ├── main.js             # entry point; starts each feature
    │   ├── navigation.js       # responsive menu + footer year
    │   ├── requestForm.js      # pre-fill, submit, summary
    │   ├── announcements.js    # Fetch API section (Week 3)
    │   └── services.js         # shared service catalogue data
    └── assets/
        └── images/
```

## 8. Installation

Requires Node.js 18 or newer and npm.

```bash
git clone https://github.com/<your-username>/university-service-request-system.git
cd university-service-request-system
npm install
```

## 9. Running locally

```bash
npm run dev
```

Vite serves the application at `http://localhost:5173/`. The application is served by
a local development web server; opening `index.html` directly from the file system is
not supported, because the ES modules and the API request need an HTTP origin.

## 10. Building and previewing the production build

```bash
npm run build      # writes the optimised site to dist/
npm run preview    # serves dist/ locally so you can check the build
```

## 11. Public deployment

- Platform: **Netlify** (build command `npm run build`, publish directory `dist`)
- Public URL: `https://<your-site-name>.netlify.app`

> Replace the URL above with your own deployment link before submission.

## 12. REST API used in Week 3

| Item | Value |
|---|---|
| API | JSONPlaceholder |
| Endpoint | `https://jsonplaceholder.typicode.com/posts` |
| Method | `GET` |
| Auth | None |
| Response | JSON array of records with `userId`, `id`, `title`, `body` |

The records are generic practice data. Each one is mapped onto a university service
category and rendered as a service notice card with a reference number. The page
states on screen that these are demonstration notices generated from a public
practice API, not real university announcements.

## 13. Testing performed

- Layout checked in Chrome DevTools device toolbar at 360px, 768px, 1024px and at a
  normal laptop resolution, plus a sweep of the responsive handle between them
- Checked for horizontal overflow at every width
- Keyboard-only pass: skip link, menu button, all links, every form control
- API section tested in three conditions: normal, offline (DevTools Network →
  Offline) to see the error state, and throttled (Slow 3G) to see the loading state
- Network tab used to confirm the request, the 200 response and the JSON payload
- `npm run build` and `npm run preview` run to confirm the production build works

See `docs/WEEKLY-PROGRESS.md` for the full checklist.

## 14. Future development (Weeks 4–11)

Planned, **not yet implemented**:

- Week 4: detailed client-side validation and user feedback
- Backend service and REST API for requests
- Database storage for requests and services
- User registration, login and password hashing
- Token-based sessions and role-based access control
- Administrative dashboard for service offices
- Request status tracking and notifications
- Security hardening and testing

The current code is structured for this: presentation, behaviour and data are
separated, each feature is its own module, and the form already collects its values
into a single request object that a backend endpoint can receive unchanged.

## 15. Author

Individual coursework submission for BSE 4103 — Advanced Internet Programming.

## 16. Status

Weeks 1–3 complete. Weeks 4–11 pending.
