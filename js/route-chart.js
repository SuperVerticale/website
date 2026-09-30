/* Interactive route + elevation profile chart, rendered from GPX-derived JSON data. */
export function initRouteChart() {
  const routeColors = {
    flach: '#937c66',
    moderat: '#a99886',
    steil: '#ccff00',
    'sehr steil': '#e85d3f',
    bergab: '#5ba8a0'
  };

  const routeDataUrl = 'assets/route/PetzensuperVerticale-detailed.json';

  const routeChart = document.querySelector('#route-chart');
  const routeLayer = document.querySelector('#route-layer');
  const profileLayer = document.querySelector('#profile-layer');
  const interactionLayer = document.querySelector('#interaction-layer');
  const routeTooltip = document.querySelector('#route-tooltip');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const viewBoxHeight = isMobile ? 970 : 750;

  if (isMobile) {
    routeChart.setAttribute('viewBox', `0 0 1200 ${viewBoxHeight}`);
  }

  const routeBox = {
    left: 90,
    top: 60,
    width: 1020,
    height: 437.5
  };

  const profileBox = isMobile
    ? { left: 63.5, top: 680, right: 1136.5, bottom: 930 }
    : { left: 75, top: 450, right: 1125, bottom: 700 };

  const routeSvgPoint = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;

  const routeFormatDecimal = (value, digits) =>
    value.toFixed(digits).replace('.', ',');

  const routeFormatInteger = (value) =>
    Math.round(value).toLocaleString('de-DE');

  const routeEl = (name, attrs = {}) => {
    const node = document.createElementNS(
      'http://www.w3.org/2000/svg',
      name
    );

    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });

    return node;
  };

  const routeCoords = (points) => {
    const lats = points.map((p) => p.lat);
    const lons = points.map((p) => p.lon);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const rawScale = Math.min(
      routeBox.width / (maxLon - minLon),
      routeBox.height / (maxLat - minLat)
    );

    const rawWidth = (maxLon - minLon) * rawScale;
    const rawHeight = (maxLat - minLat) * rawScale;

    const angle = 513 * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rawPoints = points.map((p) => ({
      x: (p.lon - minLon) * rawScale,
      y: (maxLat - p.lat) * rawScale
    }));

    const rawCenterX = rawWidth / 2;
    const rawCenterY = rawHeight / 2;

    const rotated = rawPoints.map((p) => ({
      x: cos * (p.x - rawCenterX) - sin * (p.y - rawCenterY),
      y: sin * (p.x - rawCenterX) + cos * (p.y - rawCenterY)
    }));

    const minX = Math.min(...rotated.map((p) => p.x));
    const maxX = Math.max(...rotated.map((p) => p.x));
    const minY = Math.min(...rotated.map((p) => p.y));
    const maxY = Math.max(...rotated.map((p) => p.y));

    const fitScale = Math.min(
      (routeBox.width - 80) / (maxX - minX),
      (routeBox.height - 80) / (maxY - minY)
    );

    const centerX = routeBox.left + routeBox.width / 2;
    const centerY = routeBox.top + routeBox.height / 2;
    const mobileStretch = isMobile ? 1.35 : 1;
    const maxOffset = Math.max(...rotated.map((p) => Math.abs(p.x * fitScale)));
    const maxAllowedOffset = routeBox.width / 2 - 12;
    const stretchFactor = Math.min(mobileStretch, maxAllowedOffset / maxOffset);

    const routePoints = rotated.map((p) => ({
      x: Math.max(
        routeBox.left + 12,
        Math.min(
          centerX + p.x * fitScale * stretchFactor,
          routeBox.left + routeBox.width - 12
        )
      ),
      y: centerY + p.y * fitScale
    }));

    if (!isMobile) {
      return routePoints;
    }

    const routeScale = 1.18 * 1.2 * 1.15;
    const enlargedPoints = routePoints.map((point) => ({
      x: centerX + (point.x - centerX) * routeScale,
      y: centerY + (point.y - centerY) * routeScale
    }));
    const enlargedMinX = Math.min(...enlargedPoints.map((point) => point.x));
    const enlargedMaxX = Math.max(...enlargedPoints.map((point) => point.x));
    const enlargedMinY = Math.min(...enlargedPoints.map((point) => point.y));
    const enlargedMaxY = Math.max(...enlargedPoints.map((point) => point.y));
    const offsetX = enlargedMinX < 12 ? 12 - enlargedMinX : enlargedMaxX > 1188 ? 1188 - enlargedMaxX : 0;
    const offsetY = enlargedMinY < 12 ? 12 - enlargedMinY : enlargedMaxY > viewBoxHeight - 12 ? viewBoxHeight - 12 - enlargedMaxY : 0;

    return enlargedPoints.map((point) => ({
      x: point.x + offsetX,
      y: point.y + offsetY
    }));
  };

  const profileX = (km, total) =>
    profileBox.left +
    km / total *
    (profileBox.right - profileBox.left);

  const profileY = (elevation) =>
    profileBox.bottom -
    (elevation - 600) / 1200 *
    (profileBox.bottom - profileBox.top);

  const routePathFor = (points) =>
    points.map((p) => routeSvgPoint(p.x, p.y)).join(' ');

  function addRouteText(parent, text, x, y, attrs = {}) {
    const node = routeEl('text', {
      x,
      y,
      ...attrs
    });

    node.textContent = text;
    parent.appendChild(node);

    return node;
  }

  function showRouteHover(
    index,
    event,
    data,
    points,
    routePoints,
    profilePoints
  ) {
    const segment =
      data.segments[
        Math.min(index, data.segments.length - 1)
      ];

    const point =
      points[
        Math.min(index, points.length - 1)
      ];

    const slope = segment.slopePct;

    const routePoint =
      routePoints[
        Math.min(index, routePoints.length - 1)
      ];

    const profilePoint =
      profilePoints[
        Math.min(index, profilePoints.length - 1)
      ];

    const elevationGain =
      data.segments
        .slice(0, index)
        .reduce(
          (total, current) =>
            total + Math.max(0, current.elevationChangeM),
          0
        );

    document
      .querySelectorAll('.route-interactive .hover-line, .route-interactive .hover-icon')
      .forEach((node) => {
        node.style.opacity = '1';
      });

    document
      .querySelector('#profile-hover-line')
      .setAttribute('x1', profilePoint.x);

    document
      .querySelector('#profile-hover-line')
      .setAttribute('y1', profileBox.top);

    document
      .querySelector('#profile-hover-line')
      .setAttribute('x2', profilePoint.x);

    document
      .querySelector('#profile-hover-line')
      .setAttribute('y2', profileBox.bottom);

    document
      .querySelector('#route-hover-icon')
      .setAttribute('x', routePoint.x - 15);

    document
      .querySelector('#route-hover-icon')
      .setAttribute('y', routePoint.y - 15);

    document
      .querySelector('#profile-hover-icon')
      .setAttribute('x', profilePoint.x - 12);

    document
      .querySelector('#profile-hover-icon')
      .setAttribute('y', profilePoint.y - 12);

    routeTooltip.innerHTML =
      `<strong>${routeFormatDecimal(point.distanceKm, 2)} km</strong>` +
      `${routeFormatInteger(elevationGain)} m elevation gain<br />` +
      `${routeFormatDecimal(slope, 1)}% slope`;

    routeTooltip.style.opacity = '1';

    if (event.pointerType === 'touch') {
      routeTooltip.style.transform = 'none';
      const tooltipRect = routeTooltip.getBoundingClientRect();
      const edgePadding = 8;
      const touchGap = 25;
      const maxLeft = window.innerWidth - tooltipRect.width - edgePadding;
      const left = Math.max(
        edgePadding,
        Math.min(event.clientX - tooltipRect.width / 2, maxLeft)
      );
      let top = event.clientY - tooltipRect.height - touchGap;

      if (top < edgePadding) {
        top = event.clientY + touchGap;
      }

      top = Math.max(
        edgePadding,
        Math.min(top, window.innerHeight - tooltipRect.height - edgePadding)
      );

      routeTooltip.style.left = `${left}px`;
      routeTooltip.style.top = `${top}px`;
      return;
    }

    routeTooltip.style.transform = '';

    const left = Math.min(
      event.clientX + 12,
      window.innerWidth - routeTooltip.offsetWidth - 20
    );

    const top = Math.min(
      event.clientY + 12,
      window.innerHeight - routeTooltip.offsetHeight - 20
    );

    routeTooltip.style.left =
      `${Math.max(8, left)}px`;

    routeTooltip.style.top =
      `${Math.max(8, top)}px`;
  }

  fetch(routeDataUrl)
    .then((response) => response.json())
    .then((data) => {
      const points = data.points;

      const routePoints = routeCoords(points);

      const profilePoints = points.map((p) => ({
        x: profileX(
          p.distanceKm,
          data.stats.distanceKm
        ),
        y: profileY(p.elevationM)
      }));

      routeLayer.appendChild(
        routeEl('polyline', {
          points: routePathFor(routePoints),
          class: 'route-base'
        })
      );

      data.segments.forEach((segment, index) => {
        routeLayer.appendChild(
          routeEl('line', {
            x1: routePoints[index].x,
            y1: routePoints[index].y,
            x2: routePoints[index + 1].x,
            y2: routePoints[index + 1].y,
            stroke: routeColors[segment.category],
            class: 'route-segment'
          })
        );
      });

      const labelAway = (point, neighbor) => {
        const dx = point.x - neighbor.x;
        const dy = point.y - neighbor.y;
        const length = Math.max(
          1,
          Math.hypot(dx, dy)
        );

        return {
          x: point.x + dx / length * 35,
          y: point.y + dy / length * 35
        };
      };

      const startLabel =
        labelAway(routePoints[0], routePoints[1]);

      const finishPoint =
        routePoints.at(-1);

      const finishLabel = {
        x: Math.min(
          finishPoint.x + 42,
          1115
        ),
        y: finishPoint.y + 6
      };

      addRouteText(
        routeLayer,
        'ROUTE',
        75,
        15,
        {
          class: 'section-label'
        }
      );

      addRouteText(
        routeLayer,
        'START / 653 M',
        startLabel.x,
        startLabel.y,
        {
          class: 'route-endpoint-label',
          fill: '#ccff00',
          'font-weight': '700',
          'text-anchor': 'middle'
        }
      );

      addRouteText(
        routeLayer,
        'FINISH / 1707 M',
        finishLabel.x,
        finishLabel.y,
        {
          class: 'route-endpoint-label',
          fill: '#e85d3f',
          'font-weight': '700',
          'text-anchor': 'start'
        }
      );

      routeLayer.appendChild(
        routeEl('circle', {
          cx: routePoints[0].x,
          cy: routePoints[0].y,
          r: 7,
          fill: '#342828',
          stroke: '#ccff00',
          'stroke-width': 3
        })
      );

      routeLayer.appendChild(
        routeEl('circle', {
          cx: routePoints.at(-1).x,
          cy: routePoints.at(-1).y,
          r: 7,
          fill: '#342828',
          stroke: '#e85d3f',
          'stroke-width': 3
        })
      );

      const compass = routeEl('g', {
        id: 'compass'
      });

      compass.appendChild(
        routeEl('circle', {
          cx: 1060,
          cy: 125,
          r: 28,
          fill: '#342828',
          'fill-opacity': '.9',
          stroke: '#ccff00',
          'stroke-width': 2
        })
      );

      compass.appendChild(
        routeEl('path', {
          d: 'M1060 143V107M1060 107L1052 121H1068Z',
          fill: '#ccff00'
        })
      );

      addRouteText(
        compass,
        'N',
        1060,
        92,
        {
          fill: '#a99886',
          'text-anchor': 'middle',
          'font-weight': '700'
        }
      );

      routeLayer.appendChild(compass);

      addRouteText(
        profileLayer,
        'ELEVATION PROFILE & GRADIENT',
        75,
        isMobile ? 660 : 430,
        {
          class: 'section-label'
        }
      );

      const elevationLabelX = isMobile ? 80 : 63;
      const distanceLabelInset = isMobile ? 20 : 0;
      const distanceLabelY = isMobile ? 950 : 730;

      [800, 1100, 1400, 1700].forEach((elevation) => {
        const y = profileY(elevation);

        profileLayer.appendChild(
          routeEl('line', {
            x1: profileBox.left,
            y1: y,
            x2: profileBox.right,
            y2: y,
            class: 'grid-line'
          })
        );

        addRouteText(
          profileLayer,
          `${elevation} m`,
          elevationLabelX,
          y + 4,
          {
            class: 'axis-label',
            'text-anchor': 'end'
          }
        );
      });

      data.segments.forEach((segment, index) => {
        profileLayer.appendChild(
          routeEl('polygon', {
            points:
              `${profilePoints[index].x},${profilePoints[index].y} ` +
              `${profilePoints[index + 1].x},${profilePoints[index + 1].y} ` +
              `${profilePoints[index + 1].x},${profileBox.bottom} ` +
              `${profilePoints[index].x},${profileBox.bottom}`,
            fill: routeColors[segment.category],
            class: 'profile-fill'
          })
        );
      });

      data.segments.forEach((segment, index) => {
        profileLayer.appendChild(
          routeEl('line', {
            x1: profilePoints[index].x,
            y1: profilePoints[index].y,
            x2: profilePoints[index + 1].x,
            y2: profilePoints[index + 1].y,
            stroke: '#f4efe7',
            class: 'profile-segment'
          })
        );
      });

      addRouteText(
        profileLayer,
        '0 km',
        profileBox.left + distanceLabelInset,
        distanceLabelY,
        { class: 'axis-label' }
      );

      addRouteText(
        profileLayer,
        '5 km',
        600,
        distanceLabelY,
        {
          class: 'axis-label',
          'text-anchor': 'middle'
        }
      );

      addRouteText(
        profileLayer,
        `${routeFormatDecimal(data.stats.distanceKm, 1)} km`,
        profileBox.right - distanceLabelInset,
        distanceLabelY,
        {
          class: 'axis-label',
          'text-anchor': 'end'
        }
      );

      const routeInteraction = routeEl(
        'polyline',
        {
          points: routePathFor(routePoints),
          fill: 'none',
          stroke: 'transparent',
          'stroke-width': 32,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        }
      );

      const profileInteraction = routeEl(
        'rect',
        {
          x: profileBox.left,
          y: profileBox.top,
          width: profileBox.right - profileBox.left,
          height: profileBox.bottom - profileBox.top,
          fill: 'transparent'
        }
      );

      interactionLayer.append(
        routeInteraction,
        profileInteraction
      );

      const profileHoverLine = routeEl(
        'line',
        {
          id: 'profile-hover-line',
          class: 'hover-line'
        }
      );

      const routeHoverIcon = routeEl(
        'image',
        {
          id: 'route-hover-icon',
          href: 'assets/logos/sv_mini_ohne_text-neon.svg',
          x: routePoints[0].x - 15,
          y: routePoints[0].y - 15,
          width: 30,
          height: 30,
          class: 'hover-icon'
        }
      );

      const profileHoverIcon = routeEl(
        'image',
        {
          id: 'profile-hover-icon',
          href: 'assets/logos/sv_mini_ohne_text-neon.svg',
          x: profilePoints[0].x - 12,
          y: profilePoints[0].y - 12,
          width: 24,
          height: 24,
          class: 'hover-icon'
        }
      );

      interactionLayer.append(
        profileHoverLine,
        routeHoverIcon,
        profileHoverIcon
      );

      const nearestPoint = (event, source) => {
        const rect =
          routeChart.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) *
          1200 /
          rect.width;

        if (source === 'profile') {
          let index = Math.round(
            (x - profileBox.left) /
            (profileBox.right - profileBox.left) *
            (points.length - 1)
          );

          return Math.max(
            0,
            Math.min(
              points.length - 1,
              index
            )
          );
        }

        const y =
          (event.clientY - rect.top) *
          (isMobile ? viewBoxHeight : 900) /
          rect.height;

        let best = 0;
        let distance = Infinity;

        routePoints.forEach((point, index) => {
          const current = Math.hypot(
            point.x - x,
            point.y - y
          );

          if (current < distance) {
            distance = current;
            best = index;
          }
        });

        return best;
      };

      const hover = (event, source) => {
        if (event.pointerType !== 'touch') {
          touchTooltipPinned = false;
        }

        showRouteHover(
          nearestPoint(event, source),
          event,
          data,
          points,
          routePoints,
          profilePoints
        );
      };

      let activeTouchPointerId = null;
      let touchTooltipPinned = false;

      const hideTooltip = () => {
        routeTooltip.style.opacity = '0';

        document
          .querySelectorAll(
            '.route-interactive .hover-line, .route-interactive .hover-icon'
          )
          .forEach((node) => {
            node.style.opacity = '0';
          });
      };

      const leave = (event) => {
        if (event.pointerType === 'touch' || touchTooltipPinned) {
          return;
        }

        hideTooltip();
      };

      window.addEventListener('scroll', () => {
        if (!touchTooltipPinned) {
          return;
        }

        touchTooltipPinned = false;
        hideTooltip();
      }, { passive: true });

      routeInteraction.addEventListener(
        'pointerdown',
        (event) => {
          if (event.pointerType === 'touch') {
            activeTouchPointerId = event.pointerId;
            touchTooltipPinned = false;
          }

          event.preventDefault();
          routeInteraction.setPointerCapture?.(
            event.pointerId
          );
          hover(event, 'route');
        }
      );

      routeInteraction.addEventListener(
        'pointermove',
        (event) => {
          if (event.pointerType !== 'touch' || event.pointerId === activeTouchPointerId) {
            hover(event, 'route');
          }
        }
      );

      routeInteraction.addEventListener(
        'pointerup',
        (event) => {
          if (event.pointerType === 'touch' && event.pointerId === activeTouchPointerId) {
            hover(event, 'route');
            touchTooltipPinned = true;
            activeTouchPointerId = null;
          }

          routeInteraction.releasePointerCapture?.(
            event.pointerId
          );
        }
      );

      routeInteraction.addEventListener(
        'pointerleave',
        leave
      );

      profileInteraction.addEventListener(
        'pointerdown',
        (event) => {
          if (event.pointerType === 'touch') {
            activeTouchPointerId = event.pointerId;
            touchTooltipPinned = false;
          }

          event.preventDefault();
          profileInteraction.setPointerCapture?.(
            event.pointerId
          );
          hover(event, 'profile');
        }
      );

      profileInteraction.addEventListener(
        'pointermove',
        (event) => {
          if (event.pointerType !== 'touch' || event.pointerId === activeTouchPointerId) {
            hover(event, 'profile');
          }
        }
      );

      profileInteraction.addEventListener(
        'pointerup',
        (event) => {
          if (event.pointerType === 'touch' && event.pointerId === activeTouchPointerId) {
            hover(event, 'profile');
            touchTooltipPinned = true;
            activeTouchPointerId = null;
          }

          profileInteraction.releasePointerCapture?.(
            event.pointerId
          );
        }
      );

      profileInteraction.addEventListener(
        'pointerleave',
        leave
      );
    })
    .catch(() => {
      addRouteText(
        interactionLayer,
        'Route data unavailable',
        75,
        100,
        {
          fill: '#e85d3f'
        }
      );
    });
}
