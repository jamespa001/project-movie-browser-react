import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies } from '../features/movie/MovieSlice';
import { getMovieDetails } from '../services/omdb';
import { CATEGORY_COLLECTIONS } from '../constants/categories';

export const useFetchOmdbCategories = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user?.name);

  useEffect(() => {
    let isMounted = true;

    const fetchCollection = async (idList) => {
      const moviePromises = idList.map((id) => getMovieDetails(id));
      const rawMovies = await Promise.all(moviePromises);

      return rawMovies
        .filter((movie) => movie && movie.Response !== 'False')
        .map((movie) => ({
          id: movie.imdbID,
          title: movie.Title,
          cardImg:
            movie.Poster !== 'N/A' ? movie.Poster : '/images/placeholder.jpg',
          type: movie.Type,
          year: movie.Year,
          genre: movie.Genre,
          plot: movie.Plot,
          runtime: movie.Runtime,
          rating: movie.imdbRating,
        }));
    };

    const loadAllCategories = async () => {
      try {
        const [recommended, newRelease, original, trending] = await Promise.all(
          [
            fetchCollection(CATEGORY_COLLECTIONS.recommended),
            fetchCollection(CATEGORY_COLLECTIONS.newRelease),
            fetchCollection(CATEGORY_COLLECTIONS.original),
            fetchCollection(CATEGORY_COLLECTIONS.trending),
          ],
        );

        if (!isMounted) return;

        dispatch(
          setMovies({
            recommended,
            newRelease,
            original,
            trending,
          }),
        );
      } catch (error) {
        console.error('Error fetching curated OMDb categories:', error);
      }
    };

    loadAllCategories();

    return () => {
      isMounted = false;
    };
  }, [userName, dispatch]);
};
