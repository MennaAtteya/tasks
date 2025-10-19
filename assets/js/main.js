// Basic demo: prevent submit on search in example
(function(){
  const forms = document.querySelectorAll('form[role="search"]');
  forms.forEach(f=>{
    f.addEventListener('submit', (e)=>{
      e.preventDefault();
    });
  })
})();
