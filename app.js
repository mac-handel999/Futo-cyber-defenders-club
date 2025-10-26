document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('newsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // **Replace with your News API Key**
    const API_KEY = '54dd7a0f2475374bf14b9f3f7925461a';
    const BASE_URL = 'https://gnews.io/api/v4/search?';

    async function fetchNews(query) {
        // Construct the URL with a dynamic query parameter
        const url = `${BASE_URL}q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${API_KEY}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Check for API-specific errors, like an invalid API key
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorData.errors ? errorData.errors[0] : 'Unknown error'}`);
            }
            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = `<p>Failed to load news. ${error.message}. Please try again later.</p>`;
        }
    }

    function displayNews(articles) {
        newsContainer.innerHTML = '';
        if (articles.length === 0) {
            newsContainer.innerHTML = '<p>No articles found for this topic.</p>';
            return;
        }

        articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.className = 'news-article';
            
            // Handle missing image and use the correct variable name `imageURL`
            const imageURL = article.image || 'https://via.placeholder.com/400x200?text=No+Image';

            articleDiv.innerHTML = `
                <img src="${imageURL}" alt="${article.title}" class="article-image">
                <h1>${article.title}</h1>
               
                <br/>
                <p>${article.description || 'No description available.'}</p>
               
                
                <br/>
                <p>${article.content|| 'No content available.'}</p>
                
                
                <br/>
                <p>${new Date(article.publishedAt).toLocaleDateString() || 'No date available.'}</p>
                <br/>
                
                
                <a href="${article.url}" target="_blank" class="read-more">Read Full Article</a>
            `;
            newsContainer.appendChild(articleDiv);
        });
    }

    // Initial load: Fetch news for the default keyword "cybersecurity"
    fetchNews('cybersecurity');

    // Event listener for the search button
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchNews(query);
            // Remove the active state from all filter buttons when a new search is performed
            filterButtons.forEach(btn => btn.classList.remove('active'));
        }
    });

    // Event listeners for the filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');
            
            const keyword = button.dataset.keyword;
            fetchNews(keyword);
            searchInput.value = ''; // Clear the search input field
        });
    });
});
