import { apiRequest } from './api.js';
import { escapeHtml } from './dom.js';

const NOTICE_COUNT = 6;

function noticeTemplate(notice) {
  const office = notice.office || 'Office of Student Services';
  const category = notice.category || 'General student service';
  return `
    <li class="update-card">
      <span class="update-office">${escapeHtml(office)} — ${escapeHtml(category)}</span>
      <h3>${escapeHtml(notice.title)}</h3>
      <p>${escapeHtml(notice.body)}</p>
      <p class="update-ref">Published ${escapeHtml(new Date(notice.publishedAt).toLocaleDateString())}</p>
    </li>
  `;
}

async function loadUpdates(statusElement, grid, count) {
  grid.innerHTML = '';
  statusElement.dataset.state = 'loading';
  statusElement.textContent = 'Loading service information...';

  try {
    const notices = await apiRequest('/api/announcements.php');
    const visibleNotices = notices.slice(0, count);

    if (visibleNotices.length === 0) {
      statusElement.dataset.state = 'empty';
      statusElement.textContent = 'No service notices have been published yet.';
      return;
    }

    grid.innerHTML = visibleNotices.map(noticeTemplate).join('');
    statusElement.dataset.state = 'ready';
    statusElement.textContent = `Showing ${visibleNotices.length} service ${visibleNotices.length === 1 ? 'notice' : 'notices'}.`;
  } catch (error) {
    console.error('Unable to load service information:', error);
    statusElement.dataset.state = 'error';
    statusElement.textContent = error.message;
  }
}

export function initServiceUpdates() {
  const statusElements = document.querySelectorAll('[data-updates-status]');
  statusElements.forEach(function (statusElement) {
    const grid = document.getElementById(statusElement.dataset.updatesGrid);
    if (!grid) return;

    const count = Number(statusElement.dataset.count) || NOTICE_COUNT;
    loadUpdates(statusElement, grid, count);

    const refreshButton = statusElement.dataset.refreshButton
      ? document.querySelector(statusElement.dataset.refreshButton)
      : null;
    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        loadUpdates(statusElement, grid, count);
      });
    }
  });
}
