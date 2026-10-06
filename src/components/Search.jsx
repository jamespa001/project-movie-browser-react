import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import imgHomeBackground from '../assets/images/home-background.png';
import { groupAndSortMovies } from '../utils/groupMovies';
import MovieCard from './MovieCard';
import { fetch20DetailedMovies } from '../services/omdb';
import {
  setSearchResults,
  setSortConfig,
  selectSearchResults,
  selectSearchQuery,
  selectSortBy,
  selectIsAscending,
} from '../features/movie/MovieSlice';

export default function Search() {
  const dispatch = useDispatch();

  // Redux Selectors for Persisted State
  const movies = useSelector(selectSearchResults) || [];
  const savedQuery = useSelector(selectSearchQuery) || '';
  const sortBy = useSelector(selectSortBy) || 'year';
  const isAscending = useSelector(selectIsAscending) || false;

  const [query, setQuery] = useState(savedQuery);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      const fullDetails = await fetch20DetailedMovies(query);
      dispatch(setSearchResults({ results: fullDetails, query }));
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (type) => {
    if (sortBy === type) {
      dispatch(setSortConfig({ sortBy: type, isAscending: !isAscending }));
    } else {
      dispatch(setSortConfig({ sortBy: type, isAscending: false }));
    }
  };

  const groupedMovies = groupAndSortMovies(movies, sortBy, isAscending);

  return (
    <Container>
      <StickyControls $scrolled={scrolled}>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Search movies, series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchButton type="submit">SEARCH</SearchButton>
        </SearchForm>

        <SorterGrid>
          <SorterCard
            $active={sortBy === 'year'}
            onClick={() => handleCardClick('year')}
          >
            <CardContent>
              <span>YEAR</span>
              {sortBy === 'year' && (
                <DirectionBadge>
                  {isAscending ? (
                    <>
                      <span className="mobile-show">▲</span>
                      <span className="mobile-hide">Oldest</span>
                    </>
                  ) : (
                    <>
                      <span className="mobile-show">▼</span>
                      <span className="mobile-hide">Newest</span>
                    </>
                  )}
                </DirectionBadge>
              )}
            </CardContent>
          </SorterCard>

          <SorterCard
            $active={sortBy === 'genre'}
            onClick={() => handleCardClick('genre')}
          >
            <CardContent>
              <span>GENRE</span>
              {sortBy === 'genre' && (
                <DirectionBadge>
                  {/* {isAscending ? '▲ A-Z' : '▼ Z-A'} */}
                  {isAscending ? (
                    <>
                      <span className="mobile-show">▲</span>
                      <span className="mobile-hide">A-Z</span>
                    </>
                  ) : (
                    <>
                      <span className="mobile-show">▼</span>
                      <span className="mobile-hide">Z-A</span>
                    </>
                  )}
                </DirectionBadge>
              )}
            </CardContent>
          </SorterCard>

          <SorterCard
            $active={sortBy === 'rating'}
            onClick={() => handleCardClick('rating')}
          >
            <CardContent>
              <span>RATING</span>
              {sortBy === 'rating' && (
                <DirectionBadge>
                  {/* {isAscending ? '▲ Lowest' : '▼ Highest'} */}
                  {isAscending ? (
                    <>
                      <span className="mobile-show">▲</span>
                      <span className="mobile-hide">Lowest</span>
                    </>
                  ) : (
                    <>
                      <span className="mobile-show">▼</span>
                      <span className="mobile-hide">Highest</span>
                    </>
                  )}
                </DirectionBadge>
              )}
            </CardContent>
          </SorterCard>
        </SorterGrid>
      </StickyControls>

      <ResultsContainer>
        {loading ? (
          <Message>Fetching 20 detailed results...</Message>
        ) : (
          Object.keys(groupedMovies).map((groupTitle) => (
            <GroupSection key={groupTitle}>
              <SectionHeader>{groupTitle}</SectionHeader>
              <MovieGrid>
                {groupedMovies[groupTitle].map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    id={movie.imdbID}
                    title={movie.Title}
                    poster={movie.Poster}
                    year={movie.Year}
                    runtime={movie.Runtime}
                    rating={movie.imdbRating}
                  />
                ))}
              </MovieGrid>
            </GroupSection>
          ))
        )}
      </ResultsContainer>
    </Container>
  );
}

// STYLED COMPONENTS
const Container = styled.main`
  position: relative;
  min-height: 100vh;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url(${imgHomeBackground}) center center / cover no-repeat fixed;
    content: '';
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;

const StickyControls = styled.div`
  position: sticky;
  top: 70px;
  z-index: 10;
  padding-top: 20px;
  padding-bottom: 20px;

  margin-left: calc(-3.5vw - 5px);
  margin-right: calc(-3.5vw - 5px);
  padding-left: calc(3.5vw + 5px);
  padding-right: calc(3.5vw + 5px);

  transition: all 100ms ease-in-out;
  background: ${(props) =>
    props.$scrolled ? 'rgba(10, 11, 16, 0.95)' : 'transparent'};
  backdrop-filter: ${(props) => (props.$scrolled ? 'blur(12px)' : 'none')};
  -webkit-backdrop-filter: ${(props) =>
    props.$scrolled ? 'blur(12px)' : 'none'};
  border-bottom: ${(props) =>
    props.$scrolled
      ? '1px solid rgba(249, 249, 249, 0.1)'
      : '1px solid transparent'};

  /* Relative ON MOBILE SCREENS */
  @media (max-width: 768px) {
    position: relative;
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom: none;
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 15px;
  margin: 0 auto 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border-radius: 4px;
  border: 1px solid rgba(249, 249, 249, 0.3);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #00d2ff;
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  background-color: #0063e5;
  color: #f9f9f9;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0483ee;
  }
`;

const SorterGrid = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(4, minmax(0, 220px));

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 200px));
  }
`;

const DirectionBadge = styled.div`
  font-size: 11px;
  background: #00d2ff;
  color: #000;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: bold;
`;

const SorterCard = styled.div`
  height: 40px;
  border-radius: 5px;
  box-shadow:
    rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  position: relative;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: ${(props) =>
    props.$active
      ? '1px solid rgba(249, 249, 249, 0.7)'
      : '1px solid rgba(249, 249, 249, 0.1)'};
  background: linear-gradient(
    145deg,
    rgba(30, 34, 42, 0.7),
    rgba(15, 18, 25, 0.9)
  );

  &:hover {
    transform: scale(1.02);
    border-color: rgba(249, 249, 249, 0.8);
  }

  /* Hide specific text labels on iPhone 16 / small mobile screens */
  @media (max-width: 480px) {
    .mobile-hide {
      display: none;
    }

    .mobile-show {
      color: #00d2ff !important;
    }

    /* Make sure the badge centers nicely when text is hidden */
    ${DirectionBadge} {
      padding: 0;
      background: transparent;
    }
  }
`;

const CardContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  span {
    font-size: 12px;
    font-weight: normal;
    letter-spacing: 2px;
    color: #f9f9f9;
  }
`;

const ResultsContainer = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
`;

const GroupSection = styled.div`
  margin-bottom: 35px;
`;

const SectionHeader = styled.h3`
  font-size: 20px;
  letter-spacing: 1.2px;
  margin-bottom: 15px;
  color: #f9f9f9;
  border-left: 4px solid #00d2ff;
  padding-left: 10px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 550px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Message = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #a0a0a0;
`;
