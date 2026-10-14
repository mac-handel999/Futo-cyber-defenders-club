document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-btn');
  const menu = document.getElementById('menu-selection');
  const menuIcon = document.getElementById('menu-icon');

  function applyTheme(theme) {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    if (!themeToggle) return;

    const isLight = resolvedTheme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';

    const icon = themeToggle.querySelector('.theme-icon');
    const label = themeToggle.querySelector('.theme-label');
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    if (label) label.textContent = isLight ? 'Light' : 'Dark';
  }

  try {
    const storedTheme = localStorage.getItem('fcdc-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');
    applyTheme(initialTheme);
  } catch {
    applyTheme('dark');
  }

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    try { localStorage.setItem('fcdc-theme', nextTheme); } catch {}
  });

  function setMenuOpen(isOpen) {
    if (!menu || !menuButton) return;
    menu.classList.toggle('show', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    if (menuIcon) {
      menuIcon.src = isOpen ? 'icons/cancel-icon.png' : 'icons/Hamburger_icon.svg.png';
      menuIcon.alt = isOpen ? 'Close menu' : 'Open menu';
    }
  }

  menuButton?.addEventListener('click', () => {
    setMenuOpen(!menu?.classList.contains('show'));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (menu?.classList.contains('show') && !menu.contains(event.target) && !menuButton?.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  const searchInput = document.getElementById('search');
  const searchButton = document.getElementById('searchBtn');
  const resourceContainer = document.getElementById('resource-container');
  const roadmapImages = document.getElementById('roadmapImg');
  const roadmapButton = document.querySelector('.roadmapBtn');

  if (searchInput && searchButton && resourceContainer) {
    let allResources = [];

    function displayResources(resources) {
      resourceContainer.replaceChildren();
      if (resources.length === 0) {
        const message = document.createElement('p');
        message.className = 'resource-empty';
        message.textContent = 'No results found. Try another search.';
        resourceContainer.append(message);
        return;
      }

      const fragment = document.createDocumentFragment();
      resources.forEach((resource) => {
        const card = document.createElement('article');
        card.className = 'resource-card';

        if (typeof resource.image === 'string' && resource.image.trim()) {
          const image = document.createElement('img');
          image.src = resource.image.trim();
          image.alt = resource.title || 'Cybersecurity resource';
          image.loading = 'lazy';
          image.addEventListener('error', () => image.remove(), { once: true });
          card.append(image);
        }

        const title = document.createElement('h2');
        title.className = 'title-header';
        title.textContent = resource.title || 'Untitled resource';
        card.append(title);

        [
          ['Type', resource.type],
          ['Platform', resource.platform || resource.platform_or_author],
          ['Category', resource.category],
        ].forEach(([label, value]) => {
          if (!value) return;
          const detail = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = `${label}: `;
          detail.append(strong, document.createTextNode(String(value)));
          card.append(detail);
        });

        try {
          const resourceUrl = new URL(resource.link);
          if (['http:', 'https:'].includes(resourceUrl.protocol)) {
            const link = document.createElement('a');
            link.className = 'view-live';
            link.href = resourceUrl.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'VIEW RESOURCE LIVE';
            card.append(link);
          }
        } catch {
          // Invalid or missing URLs are omitted rather than rendered as unsafe links.
        }
        fragment.append(card);
      });
      resourceContainer.append(fragment);
    }

    async function loadResources() {
      resourceContainer.setAttribute('aria-live', 'polite');
      try {
        const response = await fetch('Resources.json');
        if (!response.ok) throw new Error(`Resource catalog request failed (${response.status}).`);
        const resources = await response.json();
        if (!Array.isArray(resources)) throw new Error('The resource catalog has an invalid format.');
        allResources = resources;
      } catch (error) {
        console.error('Failed to load resources:', error);
        const message = document.createElement('p');
        message.className = 'resource-empty';
        message.textContent = 'Unable to load the resource catalog. Please try again later.';
        resourceContainer.replaceChildren(message);
      }
    }

    function searchResources() {
      const keyword = searchInput.value.trim().toLocaleLowerCase();
      if (!keyword) {
        const message = document.createElement('p');
        message.className = 'resource-empty';
        message.textContent = 'Enter a search term to explore the resource catalog.';
        resourceContainer.replaceChildren(message);
        searchInput.focus();
        return;
      }
      const matches = allResources.filter((resource) => {
        const searchable = [resource.title, resource.category, resource.platform, resource.platform_or_author, resource.type]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase();
        return searchable.includes(keyword);
      });
      displayResources(matches);
    }

    searchButton.addEventListener('click', searchResources);
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') searchResources();
    });
    loadResources();
  }

  if (roadmapImages && roadmapButton) {
    roadmapButton.setAttribute('aria-expanded', 'false');
    roadmapButton.addEventListener('click', () => {
      const isExpanded = roadmapImages.style.display !== 'none';
      roadmapImages.style.display = isExpanded ? 'none' : 'block';
      roadmapButton.textContent = isExpanded ? 'Show Roadmap Images' : 'Hide Roadmap Images';
      roadmapButton.setAttribute('aria-expanded', String(!isExpanded));
    });
  }
});
