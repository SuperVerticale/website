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
    dataToggle.setAttribute('aria-label', expanded ? 'Show less event data' : 'Show more event data');
    dataToggleLabel.textContent = expanded ? 'Less data' : 'More data';
    dataToggleIndicator.textContent = expanded ? '−' : '+';
    dataDetails.setAttribute('aria-hidden', String(!expanded));
    dataDetails.inert = !expanded;
    eventData.classList.toggle('is-expanded', expanded);
  });
}

const conceptContentMap = {
  vertical: {
    title: 'Vertical',
    description: 'Start from the bottom. Finish at the top. No shortcuts.'
  },
  experience: {
    title: 'Experience',
    description: 'Where intense alpine sport meets music, food, culture and good people'
  },
  curated: {
    title: 'Curated',
    description: 'Handpicked food & beverages, live music acts, panel talks, and exclusive brand activations throughout the day.'
  },
  community: {
    title: 'Community',
    description: 'Come for the race. Stay for the people. The ultimate excuse to get together, sweat, and celebrate as one herd.'
  }
};

const conceptWheelStage = document.querySelector('.concept-wheel-stage');

if (conceptWheelStage) {
  const conceptWheelTrack = conceptWheelStage.querySelector('.concept-wheel-track');
  const conceptButtons = [...conceptWheelStage.querySelectorAll('.concept-wheel-item')];
  const conceptTitle = document.querySelector('.concept-title');
  const conceptDescription = document.querySelector('.concept-description');
  const conceptOrder = ['vertical', 'experience', 'curated', 'community'];
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentRotation = 0;
  let pointerDrag = null;
  let suppressNextClick = false;

  const normalizeDegrees = (degrees) => ((degrees % 360) + 360) % 360;

  const getActiveConceptKey = (rotation = currentRotation) => {
    const rotationStep = Math.round(normalizeDegrees(rotation) / 90) % 4;
    return conceptOrder[(4 - rotationStep) % 4];
  };

  const renderActiveState = (rotation = currentRotation) => {
    const activeKey = getActiveConceptKey(rotation);

    conceptButtons.forEach((button) => {
      const isActive = button.dataset.concept === activeKey;

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  };

  const updateConceptText = (key) => {
    const content = conceptContentMap[key];

    if (!content || !conceptTitle || !conceptDescription) return;

    conceptTitle.parentElement.classList.add('is-transitioning');
    window.setTimeout(() => {
      conceptTitle.textContent = content.title;
      conceptDescription.textContent = content.description;
      window.requestAnimationFrame(() => {
        conceptTitle.parentElement.classList.remove('is-transitioning');
      });
    }, 120);
  };

  const applyWheelRotation = (rotation, options = {}) => {
    const nextRotation = normalizeDegrees(rotation);
    const animate = options.animate !== false && !reducedMotionQuery.matches;

    conceptWheelTrack.style.transition = animate ? 'transform 320ms cubic-bezier(.22, 1, .36, 1)' : 'none';
    conceptWheelTrack.style.transform = `rotate(${nextRotation}deg)`;
    renderActiveState(nextRotation);

    if (options.updateText) {
      updateConceptText(getActiveConceptKey(nextRotation));
    }
  };

  const snapRotation = (rotation) => {
    const normalized = normalizeDegrees(rotation);
    const snapped = Math.round(normalized / 90) * 90;
    return normalizeDegrees(snapped);
  };

  const getShortestRotationToConcept = (targetKey) => {
    const currentKey = getActiveConceptKey(currentRotation);
    const currentIndex = conceptOrder.indexOf(currentKey);
    const targetIndex = conceptOrder.indexOf(targetKey);
    let stepDifference = (targetIndex - currentIndex + 4) % 4;

    if (stepDifference > 2) {
      stepDifference -= 4;
    }

    return currentRotation + (stepDifference * 90);
  };

  const handleConceptSelection = (targetKey) => {
    const activeKey = getActiveConceptKey(currentRotation);

    if (targetKey === activeKey) {
      return;
    }

    const targetRotation = snapRotation(getShortestRotationToConcept(targetKey));
    currentRotation = targetRotation;
    applyWheelRotation(currentRotation, { animate: true, updateText: true });
  };

  const getPointerAngle = (event) => {
    const rect = conceptWheelStage.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);

    return Math.atan2(event.clientY - centerY, event.clientX - centerX);
  };

  conceptButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }

      handleConceptSelection(button.dataset.concept);
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        handleConceptSelection(button.dataset.concept);
        return;
      }

      const currentIndex = conceptOrder.indexOf(getActiveConceptKey(currentRotation));
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;

      if (direction === 0) {
        return;
      }

      event.preventDefault();
      const nextIndex = (currentIndex + direction + conceptOrder.length) % conceptOrder.length;
      handleConceptSelection(conceptOrder[nextIndex]);
    });
  });

  conceptWheelStage.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0 && event.pointerType !== 'touch') {
      return;
    }

    pointerDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: currentRotation,
      lastAngle: getPointerAngle(event),
      accumulatedDelta: 0,
      active: false,
      moved: false
    };

    conceptWheelStage.classList.add('is-dragging');
    conceptWheelStage.setPointerCapture(event.pointerId);
  });

  conceptWheelStage.addEventListener('pointermove', (event) => {
    if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) {
      return;
    }

    const dx = event.clientX - pointerDrag.startX;
    const dy = event.clientY - pointerDrag.startY;
    const dragDistance = Math.hypot(dx, dy);

    if (!pointerDrag.active) {
      if (dragDistance < 10) {
        return;
      }

      pointerDrag.active = true;
      pointerDrag.moved = true;
      suppressNextClick = true;
    }

    const nextAngle = getPointerAngle(event);
    const angleDelta = Math.atan2(Math.sin(nextAngle - pointerDrag.lastAngle), Math.cos(nextAngle - pointerDrag.lastAngle));
    pointerDrag.accumulatedDelta += (angleDelta * 180) / Math.PI;
    pointerDrag.lastAngle = nextAngle;

    event.preventDefault();
    applyWheelRotation(pointerDrag.startRotation + pointerDrag.accumulatedDelta, { animate: false, updateText: false });
  });

  const endPointerInteraction = (event) => {
    if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) {
      return;
    }

    const finalRotation = snapRotation(pointerDrag.startRotation + pointerDrag.accumulatedDelta);
    currentRotation = finalRotation;
    conceptWheelStage.classList.remove('is-dragging');
    applyWheelRotation(currentRotation, { animate: true, updateText: true });
    pointerDrag = null;
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  };

  conceptWheelStage.addEventListener('pointerup', endPointerInteraction);
  conceptWheelStage.addEventListener('pointercancel', endPointerInteraction);
  conceptWheelStage.addEventListener('pointerleave', (event) => {
    if (pointerDrag && pointerDrag.active) {
      endPointerInteraction(event);
    }
  });

  conceptWheelStage.addEventListener('lostpointercapture', () => {
    if (pointerDrag) {
      const finalRotation = snapRotation(pointerDrag.startRotation + pointerDrag.accumulatedDelta);
      currentRotation = finalRotation;
      conceptWheelStage.classList.remove('is-dragging');
      applyWheelRotation(currentRotation, { animate: true, updateText: true });
      pointerDrag = null;
      window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }
  });

  renderActiveState(currentRotation);
}

document.querySelector('.newsletter-form').addEventListener('submit', function (event) {
  event.preventDefault();
});
