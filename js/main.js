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

const eventData = document.querySelector('.data');

if (eventData) {
  const primaryGrid = eventData.querySelector('.data-primary');
  const detailRows = [...eventData.querySelectorAll('.data-row[data-primary]')];
  const dataToggle = eventData.querySelector('.data-toggle');
  const dataDetails = eventData.querySelector('.data-details');
  const dataToggleLabel = dataToggle.querySelector('span');
  const dataToggleIndicator = dataToggle.querySelector('.data-toggle-indicator');

  detailRows.forEach((row) => {
    const fact = document.createElement('div');
    const value = document.createElement('dd');
    const label = document.createElement('dt');
    const prefix = row.dataset.primaryPrefix;

    fact.className = 'data-fact';
    value.className = 'data-fact-value';
    value.textContent = row.dataset.primaryValue || row.querySelector('dd').textContent.trim();
    if (prefix) value.prepend(`${prefix} `);
    label.className = 'data-fact-label';
    label.textContent = row.dataset.primaryLabel;
    fact.append(value, label);
    primaryGrid.append(fact);
  });

  dataToggle.addEventListener('click', () => {
    const expanded = dataToggle.getAttribute('aria-expanded') !== 'true';

    dataToggle.setAttribute('aria-expanded', String(expanded));
    dataToggle.setAttribute('aria-label', expanded ? 'Show less event data' : 'Show more event data');
    dataToggleLabel.textContent = expanded ? 'Less data' : 'More data';
    dataToggleIndicator.textContent = expanded ? '−' : '+';
    dataDetails.setAttribute('aria-hidden', String(!expanded));
    dataDetails.inert = !expanded;
    eventData.classList.toggle('is-expanded', expanded);
  });
}

document.querySelector('.newsletter-form').addEventListener('submit', function (event) {
  event.preventDefault();
});
