// Wait for page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('JS loaded!'); // Debug check

  // Find elements SAFELY
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.primary-nav');

  // Check if elements exist
  if (!menuToggle || !nav) {
    console.error('❌ Missing elements:', { menuToggle, nav });
    return;
  }

  console.log('✅ Elements found:', menuToggle, nav);

  // Toggle menu
  menuToggle.addEventListener('click', function() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    
    menuToggle.setAttribute('aria-expanded', !isOpen);
    nav.classList.toggle('menu-open');
    
    console.log('Menu toggled:', !isOpen); // Debug
  });

  // Close on nav link click
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('menu-open');
      console.log('Link clicked, menu closed');
    });
  });
});

// Smooth scroll to recipe
function scrollToRecipe() {
  const select = document.getElementById('recipe-select');
  const target = document.querySelector(select.value);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Back to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back-to-top button
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
});
