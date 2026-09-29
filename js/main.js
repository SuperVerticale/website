import { initNavigation } from './navigation.js';
import { initRouteChart } from './route-chart.js';

initNavigation();
initRouteChart();

document.querySelector('.newsletter-form').addEventListener('submit', function (event) {
  event.preventDefault();
});
