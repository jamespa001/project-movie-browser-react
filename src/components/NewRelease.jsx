import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { selectNewRelease } from '../features/movie/MovieSlice';
import MovieCard from './MovieCard';

export default function NewRelease() {
  const movies = useSelector(selectNewRelease);

  return (
    <Container>
      <h3>New Release</h3>
      <MovieGrid>
        {movies &&
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.cardImg}
              year={movie.year}
              runtime={movie.runtime}
              rating={movie.rating}
            />
          ))}
      </MovieGrid>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 0 26px;
  h3 {
    letter-spacing: 2px;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 550px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
