import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRecommended } from '../features/movie/MovieSlice';
import imgBackground from '../assets/images/home-background.png';

export default function Test() {
  const movies = useSelector(selectRecommended);
  console.log(movies);
  return (
    <Container>
      <h3>Test</h3>
      <MovieGrid>
        {movies &&
          movies.map((movie) => (
            <CardContainer>
              <Link to={`/detail/${movie.id}`}>
                <img src={movie.cardImg} alt={movie.title} />
                <MovieInfo>
                  <h4>{movie.title}</h4>
                  <p>
                    {movie.year} • {movie.runtime}{' '}
                    {movie.rating ? `• ★ ${movie.rating}/10` : ''}
                  </p>
                </MovieInfo>
              </Link>
            </CardContainer>
          ))}
      </MovieGrid>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  padding: 0 26px 26px 26px;
  background-image: url(${imgBackground});
  background-size: cover;

  h3 {
    letter-spacing: 2px;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;

const CardContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgb(0 0 0/ 69%) 0px 26px 30px -10px;
  border: 3px solid rgba(249, 249, 249, 0.1);
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    display: block;
  }

  &:hover {
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px;
  }
`;

const MovieInfo = styled.div`
  padding: 5px 12px;
  background: #090b13;

  h4 {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #f9f9f9;
  }

  p {
    font-size: 12px;
    color: #a0a0a0;
    margin-top: 4px;
  }
`;
