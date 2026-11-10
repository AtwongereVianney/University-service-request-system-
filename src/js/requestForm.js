import { fetchServices } from './services.js';

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

  form.addEventListener('submit', function (event) {
    for (const field of requiredTextFields) {
      if (!field.value.trim()) {
        field.setCustomValidity('Please enter a value that is not only spaces.');
        event.preventDefault();
        field.reportValidity();
        return;
      }
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Saving request...';
    feedback.textContent = 'Saving your request...';
  });

  form.addEventListener('reset', function () {
    feedback.replaceChildren();
    window.setTimeout(updateDescriptionCount, 0);
  });
}
