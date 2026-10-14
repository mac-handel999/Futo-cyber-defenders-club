document.addEventListener('DOMContentLoaded', () => {
  const newsContainer = document.getElementById('newsContainer');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('newsSearchBtn');
  const searchForm = document.getElementById('newsSearchForm');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!newsContainer) return;

  const API_KEY = '54dd7a0f2475374bf14b9f3f7925461a';
  const BASE_URL = 'https://gnews.io/api/v4/search?';

  function setNewsMessage(message) {
    const status = document.createElement('p');
    status.className = 'news-status';
    status.setAttribute('role', 'status');
    status.textContent = message;
    newsContainer.replaceChildren(status);
  }

  function displayNews(articles) {
    newsContainer.replaceChildren();
    if (!Array.isArray(articles) || articles.length === 0) {
      setNewsMessage('No articles found for this topic.');
      return;
    }

    const fragment = document.createDocumentFragment();
    articles.forEach((article) => {
      const card = document.createElement('article');
      card.className = 'news-article';
      if (article.image) {
        const image = document.createElement('img');
        image.className = 'article-image';
        image.src = article.image;
        image.alt = article.title || 'Cybersecurity news';
        image.loading = 'lazy';
        image.addEventListener('error', () => image.remove(), { once: true });
        card.append(image);
      }

      const title = document.createElement('h2');
      title.textContent = article.title || 'Untitled article';
      const description = document.createElement('p');
      description.textContent = article.description || 'No description available.';
      const date = document.createElement('p');
      const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null;
      date.textContent = publishedDate && !Number.isNaN(publishedDate.getTime())
        ? publishedDate.toLocaleDateString()
        : 'Date unavailable';
      card.append(title, description, date);

      try {
        const articleUrl = new URL(article.url);
        if (['http:', 'https:'].includes(articleUrl.protocol)) {
          const link = document.createElement('a');
          link.className = 'read-more';
          link.href = articleUrl.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Read Full Article';
          card.append(link);
        }
      } catch {
        // Omit an article's link when its URL is missing or invalid.
      }
      fragment.append(card);
    });
    newsContainer.append(fragment);
  }

  async function fetchNews(query) {
    const url = `${BASE_URL}q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${API_KEY}`;
    setNewsMessage('Loading cybersecurity news…');
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        const detail = Array.isArray(data.errors) ? data.errors[0] : `HTTP ${response.status}`;
        throw new Error(String(detail));
      }
      displayNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsMessage('Failed to load news. Please try again later.');
    }
  }

  fetchNews('cybersecurity');

  if (searchButton && searchInput) {
    const search = (event) => {
      event?.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        fetchNews(query);
        filterButtons.forEach((button) => button.classList.remove('active'));
      }
    };
    searchForm?.addEventListener('submit', search);
    if (!searchForm) searchButton.addEventListener('click', search);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((filter) => filter.classList.remove('active'));
      button.classList.add('active');
      fetchNews(button.dataset.keyword || 'cybersecurity');
      if (searchInput) searchInput.value = '';
    });
  });
});
