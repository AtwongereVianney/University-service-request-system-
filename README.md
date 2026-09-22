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

## 4. Step-by-step explanation of how I built the system

The following is the development process I followed. It explains both what I did
and the reason for each decision. I built the system in stages so that every new
stage improved the previous one instead of creating a separate application.

### Step 1: I identified the problem and planned the users' journey

I started by identifying a real university problem: students use different
channels to contact different offices, so requests can be delayed, lost or sent
to the wrong place. I then defined the main user journey:

1. A student opens the portal.
2. The student reads what the system does and browses the available services.
3. The student chooses a service and is taken to the request form.
4. The student enters the required details and describes the issue.
5. The system identifies the responsible office and displays a request reference.

This planning gave the application a clear purpose instead of making it only a
collection of unrelated pages.

### Step 2: I created the project and development environment

I created the project as an npm project and used Vite as the development server
and build tool. In `package.json`, I added the `dev`, `build` and `preview` scripts
and declared the project as an ES module project using `"type": "module"`.

I also created `vite.config.js` and set a relative base path so the built files can
work when deployed as a static site. I added `.gitignore` so generated files such
as `node_modules` and `dist` are not committed. I installed the dependencies with
`npm install` and checked the project continuously with `npm run dev`.

### Step 3: I created the basic HTML structure

I began with the main page in `index.html`. I first created the shared parts of
the interface: the header, university system name, navigation menu and footer.
Then I added the homepage content:

- a hero section explaining the purpose of USRS;
- buttons for submitting a request and browsing services;
- a four-step explanation of how a request moves;
- featured services;
- a service desk bulletin area.

I then created the supporting pages in the `pages/` folder: `about.html`,
`services.html`, `request.html`, `contact.html` and `updates.html`. The pages use
the same navigation and footer so the user can move through the system easily.

### Step 4: I used semantic HTML and accessibility features

After the first page structure worked, I improved the markup using semantic
elements such as `header`, `nav`, `main`, `section`, `article`, `aside`, `address`
and `footer`. This makes the page structure easier for browsers, search engines
and assistive technologies to understand.

I added a viewport meta tag for mobile devices, page descriptions, labels for all
form fields, a skip-to-content link and accessible navigation attributes. The
mobile menu uses `aria-expanded` and `aria-controls` so its state can be reported
correctly to screen readers.

### Step 5: I designed the service catalogue and request form

I listed nine realistic university services, including transcript requests,
clearance, letters, hostel support, IT support, examination issues, registration,
finance inquiries and general student services. Each service displays its name,
description and responsible office.

The request form collects the information that an office needs to understand a
request: full name, registration number, email, phone number, category, subject
and description. I used labels, placeholders and required fields to make the form
clear to complete. The form is in `pages/request.html`, while its behaviour is in
`src/js/requestForm.js`.

### Step 6: I created the mobile-first styling

I placed the styling in `src/css/style.css` and started with the smallest screen
layout. The base CSS is therefore the phone layout. I used CSS custom properties
for repeated colours and spacing, Flexbox for rows such as the header and button
groups, and CSS Grid for service cards, contact information, the form layout and
the footer.

I then added responsive breakpoints. At about 768px, cards change from one column
to two columns and the navigation becomes horizontal. At about 1024px, the cards
use three columns and the request page can place the explanation beside the form.
At wider desktop sizes, the content width is capped so text remains readable.
I also added flexible images, visible keyboard focus, 44px touch targets and a
reduced-motion rule for users who request less animation.

### Step 7: I added responsive navigation behaviour

I separated the navigation behaviour into `src/js/navigation.js`. On a phone, the
links are hidden until the Menu button is clicked. The module toggles the menu,
updates `aria-expanded`, closes the menu when a link is selected and closes it when
the Escape key is pressed.

The same module compares the current URL with each navigation link and adds
`aria-current="page"` to the active page. It also updates the footer year
automatically, so the year does not need to be edited manually.

### Step 8: I separated the JavaScript into ES6 modules

Instead of putting all JavaScript in one large file, I used one entry point and
separate modules:

- `src/js/main.js` starts each feature after the DOM has loaded;
- `src/js/navigation.js` controls the responsive menu and footer year;
- `src/js/services.js` stores the shared service categories and offices;
- `src/js/requestForm.js` handles form pre-selection, submission and summaries;
- `src/js/announcements.js` fetches and displays service information.

The `main.js` file imports the feature functions and starts them. This separation
makes the code easier to understand and means a future feature can be added as a
new module without putting all logic in one file.

### Step 9: I connected service cards to the form

Each service link includes a query value such as `?service=transcript`. When the
request page opens, `requestForm.js` reads that value with `URLSearchParams` and
pre-selects the matching category.

The service catalogue uses the same category IDs as `services.js`. I kept these
values in one shared module so the catalogue, form and notices use consistent
names and responsible offices. I also added a fallback to the general service if
an unknown category is received.

### Step 10: I implemented the request form workflow

When the student submits the form, I prevent the browser's default page reload and
collect the values using `FormData` and `Object.fromEntries`. I check that the
required fields contain values. If a required field is empty, the page displays a
message telling the student to complete the form.

If the fields are complete, I look up the selected category and responsible office,
create a reference such as `USRS-2026-4821`, and render a summary containing the
student, email, service, office, subject and time prepared. The form is then reset.
At this stage the request is only held in the browser and is not saved to a
database; database storage is part of the planned backend stage.

### Step 11: I added live demonstration data with the Fetch API

For the Week 3 requirement, I added the service desk bulletin. In
`src/js/announcements.js`, I use `fetch()` with `async/await` to request data from
the JSONPlaceholder endpoint:

`https://jsonplaceholder.typicode.com/posts`

Because this is practice data rather than a university system, I transform each
record into a demonstration service notice. I take the first six records, create a
notice reference, assign a university service category and office, shorten the
text where necessary, and render the results as notice cards.

I handled the complete request lifecycle: a loading message appears while the
request is running, successful data creates notice cards, an empty array displays
an empty-state message, and a network or HTTP error displays an error message with
a Try again button. The Reload notices button starts the request again.

### Step 12: I created the application entry point

In `src/js/main.js`, I wait for `DOMContentLoaded` and then start navigation, the
footer year, the request form and the service updates. Each initializer first
checks whether its required elements exist, which allows the same JavaScript entry
point to run safely on all pages.

### Step 13: I tested the system while building it

I tested the pages in the browser at phone, tablet and desktop widths. I checked
the layout at 360px, 768px, 1024px and normal laptop width, and dragged the
responsive viewport between those sizes to find layout problems between the main
breakpoints.

I tested the navigation with the mouse and keyboard, checked the skip link and
focus states, submitted the form with missing and complete fields, and confirmed
that service links selected the correct category. For the API section, I checked
the normal success response, Slow 3G loading behaviour and Offline error behaviour.
I also used the browser Network tab to confirm the API request and response.

Finally, I ran `npm run build` to check that Vite could create the production
version, and `npm run preview` to check the built version locally.

### Step 14: I prepared the project for version control and deployment

I used Git to keep a history of the work and to show the project developing in
stages. The commits describe the setup, page structure, service catalogue, form,
responsive design, modular JavaScript and API integration. I pushed the repository
to GitHub and configured Netlify to run `npm run build` and publish the `dist`
folder.

The result is a responsive frontend prototype. It demonstrates the complete
student-facing workflow, but it is intentionally clear about what is not yet
implemented: there is no backend, authentication, database persistence or real
university API in Weeks 1–3.

### Short explanation I can give the lecturer

> I built the University Service Request System progressively from the problem
> definition. I first planned the student journey and created the Vite project.
> I built the semantic HTML pages for the homepage, services, request form, about
> and contact information. I then added mobile-first CSS with Grid, Flexbox and
> responsive breakpoints. After that I separated the JavaScript into ES6 modules
> for navigation, shared services, the form and API notices. Service buttons pass a
> category to the form, and the form creates a request summary with a reference
> number. I also used `fetch()` and `async/await` to load demonstration notices from
> JSONPlaceholder and handled loading, success, empty and error states. I tested the
> layout at different screen sizes, tested the form and API failure states, built the
> production version with Vite and deployed the static site. The current version is
> a frontend prototype, so saving requests to a database is planned for the backend
> stage.

## 5. Features implemented in Week 1

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

## 6. Features added in Week 2

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

## 7. Features added in Week 3

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

## 8. Project structure

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

## 9. Installation

Requires Node.js 18 or newer and npm.

```bash
git clone https://github.com/<your-username>/university-service-request-system.git
cd university-service-request-system
npm install
```

## 10. Running locally

```bash
npm run dev
```

Vite serves the application at `http://localhost:5173/`. The application is served by
a local development web server; opening `index.html` directly from the file system is
not supported, because the ES modules and the API request need an HTTP origin.

## 11. Building and previewing the production build

```bash
npm run build      # writes the optimised site to dist/
npm run preview    # serves dist/ locally so you can check the build
```

## 12. Public deployment

- Platform: **Netlify** (build command `npm run build`, publish directory `dist`)
- Public URL: `https://<your-site-name>.netlify.app`

> Replace the URL above with your own deployment link before submission.

## 13. REST API used in Week 3

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

## 14. Testing performed

- Layout checked in Chrome DevTools device toolbar at 360px, 768px, 1024px and at a
  normal laptop resolution, plus a sweep of the responsive handle between them
- Checked for horizontal overflow at every width
- Keyboard-only pass: skip link, menu button, all links, every form control
- API section tested in three conditions: normal, offline (DevTools Network →
  Offline) to see the error state, and throttled (Slow 3G) to see the loading state
- Network tab used to confirm the request, the 200 response and the JSON payload
- `npm run build` and `npm run preview` run to confirm the production build works

See `docs/WEEKLY-PROGRESS.md` for the full checklist.

## 15. Future development (Weeks 4–11)

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

## 16. Author

Individual coursework submission for BSE 4103 — Advanced Internet Programming.

## 17. Status

Weeks 1–3 complete. Weeks 4–11 pending.
