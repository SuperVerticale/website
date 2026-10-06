import { initNavigation } from './navigation.js';
import { initRouteChart } from './route-chart.js';

initNavigation();
initRouteChart();

const raceModeTriggers = [...document.querySelectorAll('.race-mode-trigger')];

raceModeTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const shouldExpand = trigger.getAttribute('aria-expanded') !== 'true';

    raceModeTriggers.forEach((modeTrigger) => {
      const expanded = modeTrigger === trigger && shouldExpand;
      const mode = modeTrigger.closest('.race-mode');
      const panel = document.getElementById(modeTrigger.getAttribute('aria-controls'));
      const indicator = modeTrigger.querySelector('.race-mode-icon');

      modeTrigger.setAttribute('aria-expanded', String(expanded));
      indicator.textContent = expanded ? '−' : '+';
      panel.setAttribute('aria-hidden', String(!expanded));
      panel.inert = !expanded;
      mode.classList.toggle('is-open', expanded);
    });
  });
});

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
    dataToggle.setAttribute('aria-label', expanded ? 'Show less event info' : 'Show more event info');
    dataToggleLabel.textContent = expanded ? 'Less info' : 'More info';
    dataToggleIndicator.textContent = expanded ? '−' : '+';
    dataDetails.setAttribute('aria-hidden', String(!expanded));
    dataDetails.inert = !expanded;
    eventData.classList.toggle('is-expanded', expanded);
  });
}

const conceptContentMap = {
  vertical: {
    icon: 'assets/logos/icons/Icon_Vertical.svg',
    title: 'VERTICAL',
    description: 'WE START AT THE BOTTOM. WE FINISH AT THE TOP. One direction: straight up. no shortcuts.'
  },
  experience: {
    icon: 'assets/logos/icons/Icon_RaceModes.svg',
    title: 'RACE MODES',
    description: 'We crown NOT ONLY THE FASTEST. Race to the top. Take on extra challenges. Find your own way to win.'
  },
  curated: {
    icon: 'assets/logos/icons/Icon_Summit.svg',
    title: 'SUMMIT',
    description: 'WE STAY FOR MORE, the race is only part of our day. Stay above the clouds, Refuel. Have drinks and Celebrate.'
  },
  community: {
    icon: 'assets/logos/icons/Icon_Platform.svg',
    title: 'PLATFORM',
    description: 'We bring people, progressive brands and ideas together. Handpicked partners, good food and unexpected connections.'
  }
};

const conceptSelector = document.querySelector('.concept-selector');

const conceptHorizontal = document.querySelector('.concept-horizontal');

if (conceptHorizontal) {
  const conceptHorizontalButtons = [...conceptHorizontal.querySelectorAll('.concept-horizontal-nav-item')];
  const conceptHorizontalIcon = conceptHorizontal.querySelector('.concept-horizontal-display-icon img');
  const conceptHorizontalTitle = conceptHorizontal.querySelector('.concept-horizontal-display-title');
  const conceptHorizontalDescription = conceptHorizontal.querySelector('.concept-horizontal-display-description');
  const conceptHorizontalContent = {
    vertical: {
      src: 'assets/logos/icons/Icon_Vertical.svg',
      title: 'VERTICAL',
      description: 'WE START AT THE BOTTOM. WE FINISH AT THE TOP. One direction: straight up. no shortcuts.'
    },
    experience: {
      src: 'assets/logos/icons/Icon_RaceModes.svg',
      title: 'RACE MODES',
      description: 'We crown NOT ONLY THE FASTEST. Race to the top. Take on extra challenges. Find your own way to win.'
    },
    curated: {
      src: 'assets/logos/icons/Icon_Summit.svg',
      title: 'SUMMIT',
      description: 'WE STAY FOR MORE, the race is only part of our day. Stay above the clouds, Refuel. Have drinks and Celebrate.'
    },
    community: {
      src: 'assets/logos/icons/Icon_Platform.svg',
      title: 'PLATFORM',
      description: 'We bring people, progressive brands and ideas together. Handpicked partners, good food and unexpected connections.'
    }
  };

  const setHorizontalConcept = (key) => {
    const content = conceptHorizontalContent[key];

    if (!content) return;

    conceptHorizontalIcon.src = content.src;
    conceptHorizontalTitle.textContent = content.title;
    conceptHorizontalDescription.textContent = content.description;

    conceptHorizontalButtons.forEach((button) => {
      const isActive = button.dataset.concept === key;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  };

  conceptHorizontalButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      setHorizontalConcept(button.dataset.concept);
    });

    button.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;

      if (!direction) {
        return;
      }

      event.preventDefault();
      const nextIndex = (index + direction + conceptHorizontalButtons.length) % conceptHorizontalButtons.length;
      conceptHorizontalButtons[nextIndex].focus();
      setHorizontalConcept(conceptHorizontalButtons[nextIndex].dataset.concept);
    });
  });

  setHorizontalConcept('vertical');
}

if (conceptSelector) {
  const display = conceptSelector.querySelector('.concept-display');
  const displayIcon = conceptSelector.querySelector('.concept-display-icon img');
  const displayTitle = conceptSelector.querySelector('.concept-display-title');
  const displayDescription = conceptSelector.querySelector('.concept-display-description');
  const selectorItems = [...conceptSelector.querySelectorAll('.concept-selector-item')];
  const conceptKeys = selectorItems.map((item) => item.dataset.concept);
  const previousButton = conceptSelector.querySelector('[aria-label="Previous concept"]');
  const nextButton = conceptSelector.querySelector('[aria-label="Next concept"]');
  const activeIcon = conceptSelector.querySelector('.concept-display-icon');
  let activeConceptKey = 'vertical';

  const moveConcept = (direction) => {
    const currentIndex = conceptKeys.indexOf(activeConceptKey);
    const nextIndex = Math.max(0, Math.min(conceptKeys.length - 1, currentIndex + direction));
    setActiveConcept(conceptKeys[nextIndex]);
  };

  const setActiveConcept = (key) => {
    const content = conceptContentMap[key];

    if (!content) return;

    activeConceptKey = key;
    display.classList.add('is-changing');
    window.setTimeout(() => {
      displayIcon.src = content.icon;
      displayIcon.alt = content.title;
      displayTitle.textContent = content.title;
      displayDescription.textContent = content.description;
      window.requestAnimationFrame(() => {
        display.classList.remove('is-changing');
      });
    }, 120);

    selectorItems.forEach((item) => {
      const isActive = item.dataset.concept === key;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
  };

  selectorItems.forEach((item) => {
    item.addEventListener('click', () => {
      setActiveConcept(item.dataset.concept);
    });

    item.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;

      if (direction === 0) {
        return;
      }

      event.preventDefault();
      const currentIndex = conceptKeys.indexOf(activeConceptKey);
      const nextIndex = Math.max(0, Math.min(conceptKeys.length - 1, currentIndex + direction));
      selectorItems[nextIndex].focus();
      setActiveConcept(selectorItems[nextIndex].dataset.concept);
    });
  });

  previousButton.addEventListener('click', () => moveConcept(-1));
  nextButton.addEventListener('click', () => moveConcept(1));

  let touchStart = null;

  activeIcon.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    touchStart = { x: event.clientX, y: event.clientY };
  });

  activeIcon.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch' || !touchStart) return;

    const horizontalDistance = event.clientX - touchStart.x;
    const verticalDistance = event.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(horizontalDistance) < 50 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return;

    moveConcept(horizontalDistance < 0 ? 1 : -1);
  });

  activeIcon.addEventListener('pointercancel', () => {
    touchStart = null;
  });

  setActiveConcept('vertical');
}

document.querySelector('.newsletter-form').addEventListener('submit', function (event) {
  event.preventDefault();
});
