// script.js
const apiKey = '97aed2e3'; // Replace with your OMDb API key
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const showLoading = () => loadingDiv.classList.remove('hidden');
const hideLoading = () => loadingDiv.classList.add('hidden');
const showError = (message) => {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
};
const clearError = () => errorDiv.classList.add('hidden');

const renderMovies = (movies) => {
  resultsDiv.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'bg-white p-4 rounded shadow';
    movieCard.innerHTML = `
      <h2 class="font-bold text-lg mb-2">${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" class="mt-2 w-full max-h-64 object-cover rounded" />
    `;
    resultsDiv.appendChild(movieCard);
  });
};

const fetchMovies = async (query) => {
  if (!query) return;
  showLoading();
  clearError();
  resultsDiv.innerHTML = '';
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "True") {
      renderMovies(data.Search);
    } else {
      showError(data.Error || "No movies found.");
    }
  } catch (error) {
    showError("Something went wrong. Try again.");
  } finally {
    hideLoading();
  }
};

const handleSearch = () => fetchMovies(searchInput.value.trim());

const handleKeyPress = (e) => {
  if (e.key === "Enter") handleSearch();
};

const debouncedSearch = debounce(() => fetchMovies(searchInput.value.trim()), 500);

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', handleKeyPress);
searchInput.addEventListener('input', debouncedSearch);
