/**
 * Week 3 — Fetch API integration.
 *
 * Source: JSONPlaceholder (https://jsonplaceholder.typicode.com/posts), a public
 * REST API meant for practice. Its records are generic text, so each record is
 * mapped onto a university service category and rendered as a service notice.
 * The page states clearly that these are demonstration notices, not real ones.
 *
 * States handled: loading, success, empty response, network/HTTP failure.
 */

import { SERVICE_CATEGORIES } from './services.js';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const NOTICE_COUNT = 6;

/* ---------- DOM state helpers ---------- */

const showLoading = (statusElement, grid) => {
  grid.innerHTML = '';
  statusElement.dataset.state = 'loading';
  statusElement.textContent = 'Loading service information...';
};

const showError = (statusElement, grid) => {
  grid.innerHTML = '';
  statusElement.dataset.state = 'error';
  // Nothing technical is shown to the student; the real error goes to the console.
  statusElement.innerHTML = `
    <p>Unable to load service information at the moment. Please try again later.</p>
    <button class="btn btn-ghost btn-small" type="button" data-retry-updates>Try again</button>
  `;
};

const showEmpty = (statusElement, grid) => {
  grid.innerHTML = '';
  statusElement.dataset.state = 'empty';
  statusElement.textContent = 'No service notices have been published yet. Check again later.';
};

const clearStatus = (statusElement, count) => {
  statusElement.dataset.state = 'ready';
  statusElement.textContent = `Showing ${count} service ${count === 1 ? 'notice' : 'notices'}.`;
};

/* ---------- Data fetching ---------- */

/**
 * Fetch raw records from the public API.
 * Uses async/await; throws so the caller decides what the user sees.
 */
export async function fetchServiceData(url = API_URL) {
  const response = await fetch(url);

  // fetch() only rejects on network failure, so HTTP errors are checked by hand.
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

/* ---------- Data shaping ---------- */

/** Turn "qui est esse" into "Qui est esse" and trim runaway length. */
const toHeadline = (text = '', maxLength = 64) => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const headline = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return headline.length > maxLength ? `${headline.slice(0, maxLength).trimEnd()}…` : headline;
};

/**
 * Map one API record onto the shape the interface needs.
 * Destructuring pulls out only the three fields used; `extra` (rest) keeps the
 * remaining API fields available without naming them.
 */
const toServiceNotice = ({ id, title, body, ...extra }, index) => {
  const { name, office } = SERVICE_CATEGORIES[index % SERVICE_CATEGORIES.length];

  return {
    reference: `USRS/NOTICE/${String(id).padStart(3, '0')}`,
    headline: toHeadline(title),
    summary: toHeadline(body, 150),
    category: name,
    office,
    source: extra,
  };
};

/** Take the first N records and shape them. Spread avoids mutating the fetched array. */
export const buildNotices = (records, count = NOTICE_COUNT) =>
  [...records].slice(0, count).map(toServiceNotice);

/* ---------- Rendering ---------- */

const noticeTemplate = ({ reference, headline, summary, category, office }) => `
  <li class="update-card">
    <span class="update-office">${office} — ${category}</span>
    <h3>${headline}</h3>
    <p>${summary}</p>
    <p class="update-ref">Reference ${reference}</p>
  </li>
`;

export const renderServiceData = (notices, grid) => {
  grid.innerHTML = notices.map(noticeTemplate).join('');
};

/* ---------- Controller ---------- */

/**
 * Load notices and drive the four interface states.
 * Every DOM element it touches is passed in, so this function is easy to test
 * and does not depend on globals.
 */
export async function loadServiceUpdates({ statusElement, grid }) {
  showLoading(statusElement, grid);

  try {
    const records = await fetchServiceData();

    if (!Array.isArray(records) || records.length === 0) {
      showEmpty(statusElement, grid);
      return;
    }

    const notices = buildNotices(records);
    renderServiceData(notices, grid);
    clearStatus(statusElement, notices.length);
  } catch (error) {
    console.error('Service information request failed:', error);
    showError(statusElement, grid);
  }
}

/** Wire up the section: load on page open, reload on button click or retry. */
export function initServiceUpdates() {
  const statusElement = document.querySelector('#updatesStatus');
  const grid = document.querySelector('#updatesGrid');
  const refreshButton = document.querySelector('#refreshUpdates');

  if (!statusElement || !grid) return;

  const elements = { statusElement, grid };
  const reload = () => loadServiceUpdates(elements);

  refreshButton?.addEventListener('click', reload);

  // The retry button is created after an error, so the click is caught on the container.
  statusElement.addEventListener('click', (event) => {
    if (event.target.matches('[data-retry-updates]')) reload();
  });

  reload();
}
