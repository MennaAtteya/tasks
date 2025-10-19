// Simple UI interactions
(function () {
  const mainNav = document.getElementById('mainNav');
  const addShadowOnScroll = () => {
    if (!mainNav) return;
    const scrolled = window.scrollY > 8;
    mainNav.classList.toggle('shadow-sm', !scrolled);
    mainNav.classList.toggle('shadow', scrolled);
  };
  addShadowOnScroll();
  window.addEventListener('scroll', addShadowOnScroll);
})();
