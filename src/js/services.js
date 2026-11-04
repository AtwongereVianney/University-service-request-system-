import { apiRequest } from './api.js';
import { escapeHtml } from './dom.js';

const SERVICE_ICONS = {
  transcript: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 9h7M9 13h7M9 17h4"/></svg>',
  clearance: '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/><path d="M20 12v7H4V5h10"/></svg>',
  letter: '<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>',
  hostel: '<svg viewBox="0 0 24 24"><path d="M4 20V9l8-5 8 5v11z"/><path d="M10 20v-6h4v6"/></svg>',
  'it-support': '<svg viewBox="0 0 24 24"><path d="M3 5h18v11H3z"/><path d="M8 20h8M12 16v4"/></svg>',
  examination: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 100 18 9 9 0 000-18z"/><path d="M12 8v5M12 16h.01"/></svg>',
  registration: '<svg viewBox="0 0 24 24"><path d="M6 4h12v16H6z"/><path d="M9 9h6M9 13h6"/><path d="M9 4v16"/></svg>',
  finance: '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M16 7.5A3.5 3.5 0 0012.5 5h-1a3 3 0 000 6h1a3 3 0 010 6h-1A3.5 3.5 0 018 16.5"/></svg>',
  general: '<svg viewBox="0 0 24 24"><path d="M9 11a3 3 0 100-6 3 3 0 000 6z"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 6h5M16 10h5"/></svg>',
};

export async function fetchServices() {
  return apiRequest('/api/services.php');
}

function serviceCard(service, requestUrl) {
  return `
    <li class="service-card">
      <span class="service-icon" aria-hidden="true">${SERVICE_ICONS[service.slug] || SERVICE_ICONS.general}</span>
      <h3>${escapeHtml(service.name)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <p class="service-office">${escapeHtml(service.office)}</p>
      <a class="btn btn-small" href="${requestUrl}?service=${encodeURIComponent(service.slug)}">Request service</a>
    </li>
  `;
}

export async function initServiceCatalog() {
  const grid = document.querySelector('#serviceGrid');
  const status = document.querySelector('#serviceStatus');
  if (!grid || !status) return;

  status.dataset.state = 'loading';
  status.textContent = 'Loading services...';

  try {
    const services = await fetchServices();
    grid.innerHTML = services.map(function (service) {
      return serviceCard(service, './request.html');
    }).join('');
    status.dataset.state = services.length ? 'ready' : 'empty';
    status.textContent = services.length
      ? 'Choose a service to open its request form.'
      : 'No services are available right now.';
  } catch (error) {
    console.error('Unable to load services:', error);
    status.dataset.state = 'error';
    status.textContent = error.message;
  }
}

export async function initFeaturedServices() {
  const grid = document.querySelector('#featuredServices');
  const status = document.querySelector('#featuredStatus');
  if (!grid || !status) return;

  status.dataset.state = 'loading';
  status.textContent = 'Loading services...';

  try {
    const services = await fetchServices();
    const featuredServices = services.filter(function (service) {
      return service.featured;
    });

    grid.innerHTML = featuredServices.map(function (service) {
      return `
        <li>
          <h3>${escapeHtml(service.name)}</h3>
          <p>${escapeHtml(service.description)}</p>
          <a class="btn btn-small" href="./pages/request.html?service=${encodeURIComponent(service.slug)}">Request this</a>
        </li>
      `;
    }).join('');
    status.dataset.state = featuredServices.length ? 'ready' : 'empty';
    status.textContent = featuredServices.length
      ? ''
      : 'No featured services are available right now.';
  } catch (error) {
    console.error('Unable to load featured services:', error);
    status.dataset.state = 'error';
    status.textContent = error.message;
  }
}

function contactCard(title, body) {
  return `<article class="contact-card"><h3>${escapeHtml(title)}</h3>${body}</article>`;
}

export async function initContactInfo() {
  const grid = document.querySelector('#contactGrid');
  const status = document.querySelector('#contactStatus');
  if (!grid || !status) return;

  status.dataset.state = 'loading';
  status.textContent = 'Loading office details...';

  try {
    const contact = await apiRequest('/api/contact.php');
    const emailCard = contactCard(
      'Email',
      `<p><a href="mailto:${escapeHtml(contact.studentServicesEmail)}">${escapeHtml(contact.studentServicesEmail)}</a></p>
       <p><a href="mailto:${escapeHtml(contact.ictSupportEmail)}">${escapeHtml(contact.ictSupportEmail)}</a></p>`
    );
    const phoneCard = contactCard(
      'Telephone',
      `<p><a href="tel:${escapeHtml(contact.frontDeskPhone.replace(/[^\d+]/g, ''))}">${escapeHtml(contact.frontDeskPhone)}</a> - front desk</p>
       <p><a href="tel:${escapeHtml(contact.ictHelpdeskPhone.replace(/[^\d+]/g, ''))}">${escapeHtml(contact.ictHelpdeskPhone)}</a> - ICT helpdesk</p>`
    );
    const cards = [
      contactCard(
        contact.officeName,
        `<address>${escapeHtml(contact.addressLine1)}<br>${escapeHtml(contact.addressLine2)}<br>${escapeHtml(contact.cityCountry)}</address>`
      ),
      emailCard,
      phoneCard,
      contactCard(
        'Opening hours',
        `<p>${escapeHtml(contact.weekdayHours)}</p><p>${escapeHtml(contact.saturdayHours)}</p><p>${escapeHtml(contact.holidayHours)}</p>`
      ),
    ];

    grid.innerHTML = cards.join('');
    status.dataset.state = 'ready';
    status.textContent = '';
  } catch (error) {
    console.error('Unable to load office details:', error);
    status.dataset.state = 'error';
    status.textContent = error.message;
  }
}
