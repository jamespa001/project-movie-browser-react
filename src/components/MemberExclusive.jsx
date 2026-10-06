import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectAuthLoading, selectUserName } from '../features/user/UserSlice';
import { getMovieDetails } from '../services/omdb';
import MovieCard from './MovieCard';

// IMDb IDs for Premier Access spotlight + exclusive vault
const EXCLUSIVE_IDS = [
  'tt10872600', // Spider-Man: No Way Home
  'tt6751668', // Parasite
  'tt1160419', // Dune
  'tt15398776', // Oppenheimer
  'tt0816692', // Interstellar
];

export default function MemberExclusive() {
  const userName = useSelector(selectUserName);
  const authLoading = useSelector(selectAuthLoading);
  const navigate = useNavigate();

  const [heroMovie, setHeroMovie] = useState(null);
  const [gridMovies, setGridMovies] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    // Only fetch content if authenticated
    if (userName) {
      const loadExclusiveContent = async () => {
        try {
          setContentLoading(true);
          const promises = EXCLUSIVE_IDS.map((id) => getMovieDetails(id));
          const results = await Promise.all(promises);

          if (results.length > 0) {
            setHeroMovie(results[0]); // First item is Featured Spotlight
            setGridMovies(results.slice(1)); // Rest go into Vault Grid
          }
        } catch (err) {
          console.error('Error loading member exclusives:', err);
        } finally {
          setContentLoading(false);
        }
      };

      loadExclusiveContent();
    }
  }, [userName]);

  // 1. Show Spinner while Firebase checks if a session exists
  if (authLoading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  // 2. Immediately redirect if auth check is done and user is NOT signed in
  if (!userName) {
    return <Navigate to="/" replace />;
  }

  // 3. Render page content if signed in
  return (
    <Container>
      {/* AMBIENT BLURRED BACKDROP */}
      {heroMovie?.Poster && <BackgroundBlur $poster={heroMovie.Poster} />}

      {contentLoading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <>
          {/* HERO SPOTLIGHT BANNER */}
          {heroMovie && (
            <HeroBanner>
              <VipBadge>★ PREMIER ACCESS MEMBER EXCLUSIVE</VipBadge>
              <HeroContent>
                <PosterBox>
                  <img src={heroMovie.Poster} alt={heroMovie.Title} />
                </PosterBox>
                <MetaDetails>
                  <Title>{heroMovie.Title}</Title>
                  <Subtitle>
                    <span>{heroMovie.Year}</span> •{' '}
                    <span>{heroMovie.Runtime}</span> •{' '}
                    <span>{heroMovie.Genre}</span>
                  </Subtitle>

                  <RatingsRow>
                    <Badge>IMDb {heroMovie.imdbRating}</Badge>
                    <Badge $gold>VIP EARLY SCREENING</Badge>
                  </RatingsRow>

                  <Plot>{heroMovie.Plot}</Plot>

                  <ButtonGroup>
                    <PlayButton
                      onClick={() => navigate(`/detail/${heroMovie.imdbID}`)}
                      disabled={true}
                    >
                      <img src="/images/play-icon-black.png" alt="" />
                      <span>WATCH NOW</span>
                    </PlayButton>
                  </ButtonGroup>
                </MetaDetails>
              </HeroContent>
            </HeroBanner>
          )}

          {/* EXCLUSIVE RELEASES GRID */}
          <Section>
            <SectionTitle>Exclusive Member Vault</SectionTitle>
            <MovieGrid>
              {gridMovies.map((movie) => (
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
          </Section>
        </>
      )}
    </Container>
  );
}

// KEYFRAMES & STYLED COMPONENTS
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 100%;
`;

const Spinner = styled.div`
  width: 100px;
  height: 100px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #00d2ff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 70px);
  padding: 100px calc(3.5vw + 5px) 50px;
  overflow: hidden;
`;

const BackgroundBlur = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-image: url(${(props) => props.$poster});
  background-position: center;
  background-size: cover;
  filter: blur(80px) brightness(0.25);
  transform: scale(1.1);
`;

const HeroBanner = styled.div`
  background: rgba(15, 18, 25, 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.35);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
`;

const VipBadge = styled.div`
  display: inline-block;
  color: #ffd700;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 12px;
  margin-bottom: 20px;
  background: rgba(255, 215, 0, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.4);
`;

const HeroContent = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PosterBox = styled.div`
  flex-shrink: 0;
  img {
    width: 180px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }
`;

const MetaDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #fff;
  letter-spacing: 1px;
`;

const Subtitle = styled.div`
  color: #a0a0a0;
  font-size: 14px;
`;

const RatingsRow = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Badge = styled.span`
  background: ${(props) =>
    props.$gold ? 'linear-gradient(45deg, #ffd700, #ffa500)' : '#00d2ff'};
  color: #000;
  font-weight: bold;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
`;

const Plot = styled.p`
  color: #d0d0d0;
  font-size: 15px;
  line-height: 1.5;
  max-width: 700px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PlayButton = styled.button`
  border-radius: 4px;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1.5px;
  border: none;
  background: #f9f9f9;
  color: #000;
  cursor: pointer;

  &:hover {
    background: #c6c6c6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: rgb(200, 200, 200);
  }

  img {
    width: 20px;
  }
`;

const Section = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  letter-spacing: 1.2px;
  margin-bottom: 20px;
  color: #f9f9f9;
  border-left: 4px solid #ffd700;
  padding-left: 10px;
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
