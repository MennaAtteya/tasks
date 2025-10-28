const DATA_URL = './data/e_tutor_home.json';

async function loadData() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    // Soft fallback: minimal structure
    document.body.innerHTML = `<div class="container py-5"><h1>Unable to load data</h1><p class="text-secondary">${String(err)}</p></div>`;
    throw err;
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setLink(id, label, href) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = label;
  if (href) el.href = href;
}

function renderNav(site) {
  document.getElementById('brandName').textContent = site.name;
  const navUl = document.getElementById('navLinks');
  navUl.innerHTML = site.nav.map(n => `<li class="nav-item"><a class="nav-link" href="${n.href}">${n.label}</a></li>`).join('');
  const authWrap = document.getElementById('authButtons');
  authWrap.innerHTML = site.auth.map((a, i) => i === 0 
    ? `<a class="btn btn-primary" href="${a.href}">${a.label}</a>`
    : `<a class="btn btn-outline-secondary" href="${a.href}">${a.label}</a>`
  ).join('');
  const search = document.getElementById('searchInput');
  if (search) search.placeholder = site.searchPlaceholder || 'Search courses...';
}

function renderHero(hero) {
  setText('heroHeadline', hero.headline);
  setText('heroSubtext', hero.subtext);
  setLink('heroCta', hero.primaryCta.label, hero.primaryCta.href);
}

function renderCategories(categories) {
  setText('categoriesTitle', categories.sectionTitle);
  setText('categoriesNote', categories.note);
  setLink('browseAllCategories', categories.browseAll.label, categories.browseAll.href);
  const row = document.getElementById('categoriesContainer');
  row.innerHTML = categories.items.map(item => `
    <div class="col-6 col-md-3">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-baseline justify-content-between">
            <span class="category">${item.name}</span>
            <span class="badge text-bg-light">${item.courses.toLocaleString()} courses</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function courseCard(c) {
  const stars = '<i class="fa-solid fa-star"></i>'.repeat(Math.round(c.rating));
  return `
  <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
    <div class="card h-100 course-card shadow-sm">
      <img class="card-img-top" src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=800&auto=format&fit=crop" alt="course"/>
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="category">${c.category}</span>
          <span class="price">$${c.price}</span>
        </div>
        <h6 class="card-title">${c.title}</h6>
        <div class="rating small text-warning d-flex align-items-center gap-1">
          ${stars} <span class="text-secondary ms-1">${c.rating.toFixed(1)} · ${c.students.toLocaleString()} students</span>
        </div>
      </div>
    </div>
  </div>`;
}

function renderCourses(sectionKey, sectionElId, browseAllId, data) {
  const section = data[sectionKey];
  if (!section) return;
  setLink(browseAllId, section.browseAll.label, section.browseAll.href);
  const row = document.getElementById(sectionElId);
  row.innerHTML = section.courses.map(courseCard).join('');
}

function renderInstructorCta(block) {
  setText('instructorTitle', block.title);
  setText('instructorBlurb', block.blurb);
  setLink('instructorCtaBtn', block.cta.label, block.cta.href);
  setText('stepsTitle', block.stepsTitle);
  const list = document.getElementById('stepsList');
  list.innerHTML = block.steps.map(step => `<li class="list-group-item">${step}</li>`).join('');
}

function renderTopInstructors(data) {
  setText('instructorsNote', data.note);
  setLink('instructorsCta', data.cta.label, data.cta.href);
  const row = document.getElementById('instructorsContainer');
  row.innerHTML = data.items.map((i, idx) => `
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img class="card-img-top" src="https://i.pravatar.cc/600?img=${idx+10}" alt="${i.name}"/>
        <div class="card-body">
          <h6 class="mb-0">${i.name}</h6>
          <div class="text-secondary small mb-1">${i.title}</div>
          <div class="rating small"><i class="fa-solid fa-star"></i> ${i.rating} · ${i.students.toLocaleString()} students</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderTrusted(trusted) {
  setText('trustedHeadline', trusted.headline);
  setText('trustedDesc', trusted.description);
}

function renderFooter(footer) {
  setText('footerBrand', footer.brand.name);
  setText('footerTagline', footer.brand.tagline);
  const cols = document.getElementById('footerColumns');
  cols.innerHTML = footer.columns.map(col => `
    <div class="col-6 col-md-3 footer-col">
      <h6>${col.title}</h6>
      <ul class="list-unstyled mb-0">
        ${col.links.map(l => `<li class="mb-1"><a href="${l.href}">${l.label}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');
  document.getElementById('copyright').textContent = footer.copyright;
}

(async function init(){
  const data = await loadData();
  renderNav(data.site);
  renderHero(data.hero);
  renderCategories(data.categories);
  renderCourses('bestSelling', 'bestSellingContainer', 'bestSellingBrowseAll', data);
  renderCourses('recent', 'recentContainer', 'recentBrowseAll', data);
  renderInstructorCta(data.instructorCta);
  renderTopInstructors(data.topInstructors);
  renderTrusted(data.trusted);
  renderFooter(data.footer);
})();
