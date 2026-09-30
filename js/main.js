import { initNavigation } from './navigation.js';
import { initRouteChart } from './route-chart.js';

initNavigation();
initRouteChart();

const eventNoteToggle = document.querySelector('.event-note-toggle');

if (eventNoteToggle) {
  const eventNoteContent = document.querySelector('#event-note-content');
  const eventVisual = eventNoteToggle.closest('.event-visual');
  const eventNoteIndicator = eventNoteToggle.querySelector('.event-note-indicator');

  eventNoteToggle.addEventListener('click', () => {
    const expanded = eventNoteToggle.getAttribute('aria-expanded') !== 'true';

    eventNoteToggle.setAttribute('aria-expanded', String(expanded));
    eventNoteToggle.setAttribute('aria-label', expanded ? 'Collapse Event note' : 'Show full Event note');
    eventNoteContent.setAttribute('aria-hidden', String(!expanded));
    eventNoteIndicator.textContent = expanded ? '−' : '+';
    eventVisual.classList.toggle('event-note-is-expanded', expanded);
  });
}

document.querySelector('.newsletter-form').addEventListener('submit', function (event) {
  event.preventDefault();
});
