# University Service Request System (USRS)

A student-facing web application where university students can see the services the
university offers and submit a service request online, instead of queuing at the
front desk or sending requests through informal channels.

Built for **BSE 4103 – Advanced Internet Programming**, progressive individual
practical coursework. The current version includes the student-facing frontend,
PHP API and MySQL persistence.

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
4. Show service announcements stored in MySQL.
5. Save student requests and provide a reference number for follow-up.
6. Keep the frontend, API, database connection and repositories in separate layers.

## 3. Technologies used

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 — custom properties, Flexbox, CSS Grid, media queries |
| Behaviour | Vanilla JavaScript, ES6+ modules |
| Build tool / dev server | Vite |
| Backend | PHP 7.4+ with MySQLi |
| Database | MySQL or MariaDB |
| Package manager | npm |
| Version control | Git and GitHub |

The PHP API uses MySQLi prepared statements.

The connection settings are in `api/config/database.php`: `localhost`, the
`university_service_request_system` database, user `root` and password `root`.
These credentials are for local development; use a restricted database account
and keep its password out of source control in a deployed application.

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

I also created `vite.config.js` and set a relative base path for flexible asset
paths. It also proxies `/api` requests to the local PHP server during development.
I added `.gitignore` so generated files such
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
finance inquiries and general student services. Each service displays its name, description and responsible office, loaded from
the database.

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

If the fields are complete, the form submits them to the PHP API. The server
validates the values, looks up the selected category and responsible office in
MySQL, saves the request, and returns a reference number and summary. The page
displays the saved details and resets the form.

### Step 11: I connected services and announcements to the database

The service desk bulletin reads announcement records from the PHP API, which
retrieves them from MySQL. The service catalogue, homepage featured services and
request form options are loaded from the same database, keeping names and offices
consistent.

I handled the complete request lifecycle: a loading message appears while the
request is running, successful data creates notice cards, an empty array displays
an empty-state message, and a network or HTTP error displays an error message. The
Reload notices button starts the request again.

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

I tested the navigation, skip link and focus states at multiple widths. I ran PHP
syntax checks and verified that the API returned seeded services and announcements.
I also submitted a test request through the Vite proxy, confirmed its database row,
and removed the temporary test row. Finally, I built the frontend with Vite.

### Step 14: I prepared the project for version control and deployment

I used Git to keep a history of the work and to show the project developing in
stages. Deployment requires a PHP-capable web server and MySQL/MariaDB; the
frontend build alone is not a complete deployment.

The current result is a responsive student-facing application with a PHP API and
MySQL persistence. Staff authentication, a management dashboard and a real
university deployment are not included.

### Short explanation I can give the lecturer

> I built the University Service Request System progressively from the problem
> definition. I first planned the student journey and created the Vite project.
> I built the semantic HTML pages for the homepage, services, request form, about
> and contact information. I then added mobile-first CSS with Grid, Flexbox and
> responsive breakpoints. After that I separated the JavaScript into ES6 modules
> for navigation, services, the form and API notices. The frontend calls PHP
> endpoints that use MySQLi and MySQL for service categories, announcements and
> submitted requests. The server validates each submission and returns a saved
> reference number. I tested the layout, form validation, PHP syntax and Vite
> production build. Staff login and request administration are outside the current
> scope.

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
- Git repository with meaningful commits

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

## 7. JavaScript and backend features

- JavaScript split into ES6 modules: `main.js`, `navigation.js`, `requestForm.js`, `announcements.js`, `services.js`
- **Latest service information** and service catalogues loaded from MySQL through PHP JSON endpoints
- Four interface states for that section: loading, success, empty response and failure
- "Reload notices" control that fetches the latest database-backed announcements
- Service card buttons that pre-select the category and move the student to the form
- PHP validates and stores submitted requests; the response includes a persistent reference number
- Procedural MySQLi functions keep SQL queries separate from HTTP endpoints and validation
- Responsive navigation behaviour with `aria-expanded` kept in step

### JavaScript and backend implementation evidence

The Week 3 JavaScript requirement is implemented in the application, not only shown in the developer console. The code and its role are mapped below:

| Requirement | Where it is used | What it does |
|---|---|---|
| `let` and `const` | `src/js/announcements.js`, `src/js/requestForm.js`, and the other modules | `const` holds values that are not reassigned; `toHeadline()` uses `let headline` because it replaces an overlong headline with a shortened version. |
| Arrow functions | `src/js/announcements.js`, `src/js/requestForm.js`, `src/js/services.js` | Define data transformation functions and event handlers. |
| Template literals | Notice and request summary renderers | Build escaped cards and the saved request summary. |
| `async` / `await` and Fetch API | `src/js/api.js`, `src/js/requestForm.js`, `src/js/announcements.js` | Send requests to the local PHP API and handle JSON responses. |
| PHP and MySQLi | `api/` | Validate input, run prepared queries and return JSON responses. |
| MySQL | `database/schema.sql` | Store services, announcements and student requests. |
| Visible page output | Homepage, `pages/services.html`, `pages/updates.html`, `pages/request.html` | Render database-backed services/notices and saved request references. |
| Loading and error handling | API-driven JavaScript modules | Show loading, empty, success and failure states. |

The initial announcements and service rows are coursework seed data. Update the
database to change the notices and service catalogue displayed by the application.

## 8. Project structure

```
university-service-request-system/
├── index.html                  # single page: header, all sections, footer
├── package.json                # scripts and the Vite dependency
├── vite.config.js              # relative build path and development API proxy
├── api/                        # PHP JSON endpoints, configuration and repositories
├── database/                   # MySQL schema and initialization script
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
    │   ├── api.js              # shared PHP API client
    │   ├── dom.js              # HTML escaping for database values
    │   ├── requestForm.js      # submit request and show saved reference
    │   ├── announcements.js    # MySQL-backed service notices
    │   └── services.js         # MySQL-backed service catalogues
    └── assets/
        └── images/
```

## 9. Installation

Requires Node.js 18 or newer, npm, PHP 7.4+ with MySQLi enabled, and MySQL or
MariaDB.

```bash
git clone https://github.com/<your-username>/university-service-request-system.git
cd university-service-request-system
npm install
```

## 10. Configure MySQL and run locally

1. Confirm that MySQL is running and that `api/config/database.php` contains the
   correct local connection settings.
2. The database is already created. To create or seed its tables again, run:

   ```powershell
   php database\initialize.php
   ```

3. Start the PHP API server in one terminal:

   ```powershell
   php -S 127.0.0.1:8000
   ```

4. Start Vite in another terminal:

   ```powershell
   npm run dev
   ```

Vite serves the application at `http://localhost:5173/` and proxies `/api/*` to
PHP. Keep both servers and MySQL running while using the app. The PHP endpoints
can also be accessed directly under `http://127.0.0.1:8000/api/`.

## 11. Building and previewing the production build

```bash
npm run build      # writes the optimised site to dist/
npm run preview    # serves dist/ locally so you can check the build
```

## 12. API endpoints and deployment

| Endpoint | Methods | Purpose |
|---|---|---|
| `/api/services.php` | `GET` | Read active services and offices from MySQL |
| `/api/announcements.php` | `GET` | Read published service notices from MySQL |
| `/api/contact.php` | `GET` | Read office contacts and hours from MySQL |
| `/api/requests.php` | `POST` | Validate and save a service request |

The application requires a PHP/MySQL host. Static-only hosting such as GitHub
Pages cannot run the PHP endpoints; deploy the built frontend and `api/` files
together on a PHP-capable server configured with the application database settings.

## 14. Testing performed

- Layout checked in Chrome DevTools device toolbar at 360px, 768px, 1024px and at a
  normal laptop resolution, plus a sweep of the responsive handle between them
- Checked for horizontal overflow at every width
- Keyboard-only pass: skip link, menu button, all links, every form control
- PHP lint passed for every API and database setup script
- GET services and announcements returned seeded MySQL records through PHP
- POST request validation rejected incomplete data and accepted a valid test
  request; its row was verified in MySQL and removed after testing
- Vite development proxy and frontend rendering checked with API responses
- `npm run build` and `npm run preview` run to confirm the production build works

See `docs/WEEKLY-PROGRESS.md` for the full checklist.

## 15. Future development

Planned, **not yet implemented**:

- User registration, login and password hashing
- Token-based sessions and role-based access control
- Administrative dashboard for service offices
- Request status tracking and notifications
- Security hardening and testing

The current code keeps presentation, behaviour, API handling, persistence and
database queries in separate files.

## 16. Author

Individual coursework submission for BSE 4103 — Advanced Internet Programming.

## 17. Status

Frontend, PHP API and MySQL persistence implemented. Authentication and staff tools pending.
