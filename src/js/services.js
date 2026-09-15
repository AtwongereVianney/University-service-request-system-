/**
 * Service catalogue data.
 *
 * The same nine categories are used by the request form (to pre-select a service)
 * and by the "Latest service information" section (to label each notice with the
 * office that would publish it). Keeping them in one module means a new service is
 * added in one place only.
 */

export const SERVICE_CATEGORIES = [
  { id: 'transcript', name: 'Academic transcript request', office: 'Academic Registrar' },
  { id: 'clearance', name: 'Clearance request', office: 'Dean of Students' },
  { id: 'letter', name: 'Letter request', office: 'Faculty Administrator' },
  { id: 'hostel', name: 'Hostel service request', office: 'Hostel Warden' },
  { id: 'it-support', name: 'IT support request', office: 'ICT Directorate' },
  { id: 'examination', name: 'Examination issue', office: 'Examinations Office' },
  { id: 'registration', name: 'Registration support', office: 'Academic Registrar' },
  { id: 'finance', name: 'Finance inquiry', office: "Bursar's Office" },
  { id: 'general', name: 'General student service', office: 'Office of Student Services' },
];

/** Look up one category by its id, with a safe fallback for unknown ids. */
export const findCategory = (categoryId) => {
  const fallback = { id: 'general', name: 'General student service', office: 'Office of Student Services' };
  // Arrow function + destructuring in the callback parameter
  return SERVICE_CATEGORIES.find(({ id }) => id === categoryId) ?? fallback;
};
