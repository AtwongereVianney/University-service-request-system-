/**
 * Responsive navigation.
 *
 * Below 768px the menu is hidden and opened with the Menu button; at 768px and
 * above CSS shows the links permanently and hides the button. aria-expanded is
 * kept in step with the visible state so screen readers report the menu correctly.
 */

export function initNavigation() {
  const toggle = document.querySelector('#navToggle');
  const nav = document.querySelector('#primaryNav');

  if (!toggle || !nav) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach((link) => {
    const linkPage = link.pathname.split('/').pop() || 'index.html';
    if (linkPage === currentPage) link.setAttribute('aria-current', 'page');
  });

  const setMenu = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  // Tapping a link on a phone should close the menu before scrolling.
  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') setMenu(false);
  });

  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape') setMenu(false);
  });
}

/** Keeps the footer copyright year correct without editing the HTML each year. */
export function setCurrentYear() {
  const yearElement = document.querySelector('#currentYear');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}
