// src/utils/groupMovies.js

const parseLatestYear = (yearStr) => {
  if (!yearStr || yearStr === 'N/A') return 0;
  const matches = yearStr.match(/\d{4}/g);
  if (!matches) return 0;
  return Math.max(...matches.map((y) => parseInt(y, 10)));
};

const parseRating = (ratingStr) => {
  if (!ratingStr || ratingStr === 'N/A') return 0;
  const num = parseFloat(ratingStr);
  return isNaN(num) ? 0 : num;
};

export const groupAndSortMovies = (movies, sortBy, isAscending) => {
  if (!movies || movies.length === 0) return {};

  const listCopy = [...movies];

  // 1. GROUP BY YEAR
  if (sortBy === 'year') {
    const rawGroups = {};

    listCopy.forEach((movie) => {
      // Keep original label for UI display (e.g. "2019–2022"), but compute numeric value for sorting
      const yearVal = parseLatestYear(movie.Year);
      const yearKey = yearVal > 0 ? `${yearVal}` : '0000';

      if (!rawGroups[yearKey]) {
        rawGroups[yearKey] = {
          displayTitle: yearVal > 0 ? `${yearVal}` : 'Unknown Year',
          items: [],
        };
      }
      rawGroups[yearKey].items.push(movie);
    });

    // Sort numeric keys (e.g. 2023 vs 2020)
    const sortedYearKeys = Object.keys(rawGroups).sort((a, b) => {
      const numA = Number(a);
      const numB = Number(b);
      return isAscending ? numA - numB : numB - numA;
    });

    // Return as array of groups to prevent JS object key auto-sorting
    const resultGroups = {};
    sortedYearKeys.forEach((key) => {
      const group = rawGroups[key];
      // Use zero-width space or prefix if necessary, but returning structured object maintains insertion order in Object.keys() when keys aren't pure positive integers
      const label = isAscending
        ? `Year: ${group.displayTitle}`
        : `Year: ${group.displayTitle}`;
      resultGroups[label] = group.items.sort((a, b) =>
        a.Title.localeCompare(b.Title),
      );
    });

    return resultGroups;
  }

  // 2. GROUP BY RATING BRACKETS
  if (sortBy === 'rating') {
    const groups = {};

    listCopy.forEach((movie) => {
      const rating = parseRating(movie.imdbRating);
      let key = 'Unrated';

      if (rating >= 9.0) key = '9.0+ Masterpiece';
      else if (rating >= 8.0) key = '8.0 – 8.9 Excellent';
      else if (rating >= 7.0) key = '7.0 – 7.9 Good';
      else if (rating >= 6.0) key = '6.0 – 6.9 Average';
      else if (rating > 0) key = 'Under 6.0 Below Average';

      if (!groups[key]) groups[key] = [];
      groups[key].push(movie);
    });

    const tierOrder = [
      '9.0+ Masterpiece',
      '8.0 – 8.9 Excellent',
      '7.0 – 7.9 Good',
      '6.0 – 6.9 Average',
      'Under 6.0 Below Average',
      'Unrated',
    ];

    if (isAscending) tierOrder.reverse();

    const sortedGroups = {};
    tierOrder.forEach((key) => {
      if (groups[key]) {
        sortedGroups[key] = groups[key].sort((a, b) => {
          const rA = parseRating(a.imdbRating);
          const rB = parseRating(b.imdbRating);
          return isAscending ? rA - rB : rB - rA;
        });
      }
    });

    return sortedGroups;
  }

  // 3. GROUP BY GENRE
  if (sortBy === 'genre') {
    const groups = {};

    listCopy.forEach((movie) => {
      const genres =
        movie.Genre && movie.Genre !== 'N/A'
          ? movie.Genre.split(',').map((g) => g.trim())
          : ['Other'];

      genres.forEach((genre) => {
        if (!groups[genre]) groups[genre] = [];
        groups[genre].push(movie);
      });
    });

    const sortedKeys = Object.keys(groups).sort((a, b) =>
      isAscending ? a.localeCompare(b) : b.localeCompare(a),
    );

    const sortedGroups = {};
    sortedKeys.forEach((key) => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }

  return { Results: listCopy };
};
