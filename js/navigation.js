export function initNavigation() {
  const menuButton = document.querySelector('.header-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

  menuButton.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('is-open');

    menuButton.setAttribute('aria-expanded', isOpen);
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuButton.textContent = isOpen ? '×' : '+';
  });

  mobileMenuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setTimeout(function () {
        mobileMenu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuButton.textContent = '+';
      }, 0);
    });
  });
}
