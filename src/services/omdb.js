import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Set USE_CACHE to false when you want to bypass local cache and make live requests.
// During the development, set it to TRUE otherwise, the omdb's daily limit can be exceeded.
// By setting it to use cache, only new items will hit the network fetch.
// For this project, it should be ok to keep it as it.
const USE_CACHE = true;

const omdbClient = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: OMDB_API_KEY,
  },
});

export const getMovieDetails = async (imdbId) => {
  const cacheKey = `omdb_detail_${imdbId}`;

  // Check local cache first
  if (USE_CACHE) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  console.log(
    `%c[NETWORK FETCH] Detail: ${imdbId}`,
    'color: #ff9900; font-weight: bold;',
  );

  // Fetch live network data from omdb if the item is not already cached
  // OMDB's Daily Limit: 1000
  try {
    const response = await omdbClient.get('', {
      params: {
        i: imdbId,
        plot: 'full',
      },
    });

    if (response.data.Response !== 'False' && USE_CACHE) {
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    return {};
  }
};

export async function searchMovies(searchTerm) {
  const cacheKey = `omdb_search_${searchTerm.toLowerCase().trim()}`;

  if (USE_CACHE) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  try {
    const response = await omdbClient.get('', {
      params: {
        s: searchTerm,
      },
    });

    const data = response.data;

    if (data.Response === 'False') {
      console.warn('OMDb Search Error:', data.Error);
      return [];
    }

    if (USE_CACHE) {
      localStorage.setItem(cacheKey, JSON.stringify(data.Search));
    }

    return data.Search;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return [];
  }
}

export const fetch20DetailedMovies = async (searchQuery) => {
  const cacheKey = `omdb_cat20_${searchQuery.toLowerCase().trim()}`;

  // 1. Check if full 20-movie category list is cached
  if (USE_CACHE) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  try {
    // 2. Fetch page 1 & 2 concurrently (10 items each)
    const [res1, res2] = await Promise.all([
      omdbClient.get('', { params: { s: searchQuery, page: 1 } }),
      omdbClient.get('', { params: { s: searchQuery, page: 2 } }),
    ]);

    const list1 = res1.data.Search || [];
    const list2 = res2.data.Search || [];
    const combined = [...list1, ...list2].slice(0, 20);

    // 3. Fetch full details for all 20 movies in parallel
    const detailPromises = combined.map(async (item) => {
      // Re-use getMovieDetails so individual items leverage detail cache
      return getMovieDetails(item.imdbID);
    });

    const fullDetails = await Promise.all(detailPromises);

    // 4. Cache the aggregated array
    if (fullDetails.length > 0 && USE_CACHE) {
      localStorage.setItem(cacheKey, JSON.stringify(fullDetails));
    }

    return fullDetails;
  } catch (error) {
    console.error('Error in fetch20DetailedMovies:', error);
    return [];
  }
};
