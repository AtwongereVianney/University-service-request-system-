/**
 * University Service Request System — application entry point.
 *
 * main.js only starts features. Each feature lives in its own module so a new
 * one (dashboard, saved requests) can be added later without editing this file
 * beyond one import and one call.
 */

import { initNavigation, setCurrentYear } from './navigation.js';
import { initRequestForm } from './requestForm.js';
import { initServiceUpdates } from './announcements.js';

const startApp = () => {
  initNavigation();
  setCurrentYear();
  initRequestForm();
  initServiceUpdates(); // Week 3: Fetch API section
};

document.addEventListener('DOMContentLoaded', startApp);
