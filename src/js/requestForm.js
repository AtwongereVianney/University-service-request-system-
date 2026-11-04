import { apiRequest } from './api.js';
import { fetchServices } from './services.js';
import { escapeHtml } from './dom.js';

function collectFormValues(form) {
  return Object.fromEntries(new FormData(form));
}

function summaryTemplate(request) {
  return `
    <h3>Your request has been saved</h3>
    <p>Reference: <strong>${escapeHtml(request.reference)}</strong></p>
    <dl>
      <dt>Student</dt><dd>${escapeHtml(request.fullName)} (${escapeHtml(request.regNumber)})</dd>
      <dt>Email</dt><dd>${escapeHtml(request.email)}</dd>
      <dt>Service</dt><dd>${escapeHtml(request.serviceName)}</dd>
      <dt>Handled by</dt><dd>${escapeHtml(request.office)}</dd>
      <dt>Subject</dt><dd>${escapeHtml(request.subject)}</dd>
      <dt>Submitted</dt><dd>${escapeHtml(new Date(request.submittedAt).toLocaleString())}</dd>
    </dl>
    <p>Keep this reference for follow-up with the service desk.</p>
  `;
}

function populateServiceOptions(select, services, selectedSlug) {
  select.replaceChildren(new Option('Choose a service', ''));

  services.forEach(function (service) {
    select.add(new Option(service.name, service.slug));
  });

  if (services.some(function (service) { return service.slug === selectedSlug; })) {
    select.value = selectedSlug;
  }
}

export function initRequestForm() {
  const form = document.querySelector('#requestForm');
  const feedback = document.querySelector('#formFeedback');
  const categorySelect = document.querySelector('#serviceCategory');
  const categoryHint = document.querySelector('#serviceCategoryHint');
  const description = document.querySelector('#description');
  const descriptionCount = document.querySelector('#descriptionCount');

  if (!form || !feedback || !categorySelect || !categoryHint) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const requiredTextFields = form.querySelectorAll('input[type="text"][required], textarea[required]');

  function updateDescriptionCount() {
    if (description && descriptionCount) {
      descriptionCount.textContent = `${description.value.length} / ${description.maxLength} characters`;
    }
  }

  description.addEventListener('input', updateDescriptionCount);
  requiredTextFields.forEach(function (field) {
    field.addEventListener('input', function () {
      field.setCustomValidity('');
    });
  });
  updateDescriptionCount();

  categorySelect.disabled = true;
  submitButton.disabled = true;

  fetchServices()
    .then(function (services) {
      const requestedService = new URLSearchParams(window.location.search).get('service');
      populateServiceOptions(categorySelect, services, requestedService);
      categorySelect.disabled = services.length === 0;
      submitButton.disabled = services.length === 0;
      categoryHint.textContent = services.length
        ? 'Not sure? Choose “General student service”.'
        : 'No services are available right now.';
    })
    .catch(function (error) {
      console.error('Unable to load request categories:', error);
      categoryHint.textContent = error.message;
      feedback.textContent = 'The request form is unavailable until services can be loaded.';
    });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    for (const field of requiredTextFields) {
      if (!field.value.trim()) {
        field.setCustomValidity('Please enter a value that is not only spaces.');
        field.reportValidity();
        return;
      }
    }

    const values = collectFormValues(form);
    submitButton.disabled = true;
    submitButton.textContent = 'Saving request...';
    feedback.textContent = 'Saving your request...';

    try {
      const request = await apiRequest('/api/requests.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      form.reset();
      feedback.innerHTML = summaryTemplate(request);
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      console.error('Unable to save request:', error);
      feedback.textContent = error.message;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit request';
    }
  });

  form.addEventListener('reset', function () {
    feedback.replaceChildren();
    window.setTimeout(updateDescriptionCount, 0);
  });
}
