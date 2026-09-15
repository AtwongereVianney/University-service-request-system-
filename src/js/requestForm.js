/**
 * Request form behaviour.
 *
 * Week 1 delivered the form markup. Week 3 adds the client-side behaviour:
 *  - "Request service" on a card selects that category and moves the student to the form
 *  - submitting builds a request object and shows a summary with a reference number
 *
 * Nothing is stored yet — persistence belongs to the backend weeks. Detailed
 * validation belongs to Week 4, so this only checks that required fields are filled.
 */

import { findCategory } from './services.js';

/** Reference like USRS-2026-4821, built from the year and a random block. */
const createReference = (prefix = 'USRS') => {
  const year = new Date().getFullYear();
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${serial}`;
};

/**
 * Collect the form values into one object.
 * Object.fromEntries + FormData keeps this working when new fields are added later.
 */
const collectFormValues = (form) => {
  const entries = Object.fromEntries(new FormData(form));
  // Spread adds submission metadata without touching the collected values.
  return { ...entries, submittedAt: new Date() };
};

/** Return the names of required fields the student left empty (rest parameter demo). */
const findEmptyFields = (values, ...requiredFields) =>
  requiredFields.filter((fieldName) => !String(values[fieldName] ?? '').trim());

const summaryTemplate = ({ fullName, regNumber, email, categoryName, office, subject, reference, submittedAt }) => `
  <h3>Request prepared: ${reference}</h3>
  <dl>
    <dt>Student</dt><dd>${fullName} (${regNumber})</dd>
    <dt>Email</dt><dd>${email}</dd>
    <dt>Service</dt><dd>${categoryName}</dd>
    <dt>Handled by</dt><dd>${office}</dd>
    <dt>Subject</dt><dd>${subject}</dd>
    <dt>Prepared</dt><dd>${submittedAt.toLocaleString()}</dd>
  </dl>
  <p>Quote this reference at the service desk. Saving requests to a database comes with the backend stage of this project.</p>
`;

export function initRequestForm() {
  const form = document.querySelector('#requestForm');
  const feedback = document.querySelector('#formFeedback');
  const categorySelect = document.querySelector('#serviceCategory');

  if (!form || !feedback || !categorySelect) return;

  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (requestedService && [...categorySelect.options].some(({ value }) => value === requestedService)) {
    categorySelect.value = requestedService;
  }

  // Every "Request service" button carries its category in a data attribute.
  const serviceButtons = [...document.querySelectorAll('[data-request-service]')];

  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { requestService } = button.dataset; // destructuring a dataset value
      categorySelect.value = requestService;
      document.querySelector('#request').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#subject').focus({ preventScroll: true });
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = collectFormValues(form);
    const missing = findEmptyFields(values, 'fullName', 'regNumber', 'email', 'serviceCategory', 'subject', 'description');

    if (missing.length > 0) {
      feedback.innerHTML = `<p>Fill in every field before sending. Still empty: ${missing.length} of 6.</p>`;
      return;
    }

    const { serviceCategory, ...rest } = values;
    const { name: categoryName, office } = findCategory(serviceCategory);

    feedback.innerHTML = summaryTemplate({
      ...rest,
      categoryName,
      office,
      reference: createReference(),
    });

    form.reset();
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  form.addEventListener('reset', () => {
    feedback.innerHTML = '';
  });
}
