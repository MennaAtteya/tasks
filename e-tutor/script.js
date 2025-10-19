const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');

function setMobileMenu(open){
  if(!mobileMenu) return;
  if(open){
    mobileMenu.hidden = false;
    document.body.style.overflow = 'hidden';
  } else {
    mobileMenu.hidden = true;
    document.body.style.overflow = '';
  }
}

if(navToggle){
  let open = false;
  navToggle.addEventListener('click', () => {
    open = !open;
    setMobileMenu(open);
  });
}

// Close mobile menu when clicking outside
mobileMenu?.addEventListener('click', (e) => {
  if(e.target === mobileMenu){
    setMobileMenu(false);
  }
});
