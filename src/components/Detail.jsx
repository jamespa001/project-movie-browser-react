import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import imgPlayIconBlack from '../assets/images/play-icon-black.png';
import imgPlayIconWhite from '../assets/images/play-icon-white.png';
import imgGroupIcon from '../assets/images/group-icon.png';
import imgPlaceHolder from '../assets/images/placeholder.jpg';

import { getMovieDetails } from '../services/omdb';

export default function Detail() {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    getMovieDetails(id).then((movie) => {
      const formattedRating =
        movie.imdbRating && movie.imdbRating !== 'N/A'
          ? `★ ${movie.imdbRating}/10`
          : null;

      const metadataParts = [
        movie.Year !== 'N/A' ? movie.Year : null,
        movie.Rated !== 'N/A' ? movie.Rated : null,
        movie.Runtime !== 'N/A' ? movie.Runtime : null,
        movie.Genre !== 'N/A' ? movie.Genre : null,
        movie.imdbRating !== 'N/A' ? formattedRating : null,
      ].filter(Boolean);

      const subTitle = metadataParts.join(' • ');

      setDetailData({
        id: movie.imdbID,
        title: movie.Title,
        cardImg: movie.Poster !== 'N/A' ? movie.Poster : imgPlaceHolder,
        type: movie.Type,
        year: movie.Year,
        genre: movie.Genre,
        subTitle: subTitle,
        imdbRating: movie.imdbRating !== 'N/A' ? movie.imdbRating : null,
        plot: movie.Plot,
      });
    });
  }, [id]);

  return (
    <Container>
      {/* Ambient Blurred Background with Radial Vignette */}
      <AmbientBackground $bgImg={detailData.cardImg} />

      <MainLayout>
        {/* Un-stretched Sharp Featured Poster */}
        <PosterWrapper>
          <img src={detailData.cardImg} alt={detailData.title} />
        </PosterWrapper>

        {/* Title, Metadata, Controls, and Plot */}
        <ContentMeta>
          <MovieTitle>
            <h1>{detailData.title}</h1>
            <h5>{detailData.subTitle}</h5>
          </MovieTitle>

          <Controls>
            <Player disabled={true}>
              <img src={imgPlayIconBlack} alt="Play" />
              <span>Play</span>
            </Player>
            <Trailer disabled={true}>
              <img src={imgPlayIconWhite} alt="Trailer" />
              <span>Trailer</span>
            </Trailer>
            <AddList disabled={true}>
              <span></span>
              <span></span>
            </AddList>
            <GroupWatch disabled={true}>
              <div>
                <img src={imgGroupIcon} alt="GroupWatch" />
              </div>
            </GroupWatch>
          </Controls>

          <Description>{detailData.plot}</Description>
        </ContentMeta>
      </MainLayout>
    </Container>
  );
}

// STYLED COMPONENTS
const Container = styled.div`
  position: relative;
  min-height: calc(100vh - 72px);
  top: 72px;
  padding: 40px calc(3.5vw + 5px);
  overflow-x: hidden;
`;

const AmbientBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url(${(props) => props.$bgImg});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(50px) brightness(0.4);
  transform: scale(1.2); /* Prevents white blur edges */

  /* Radial gradient overlay softens edges seamlessly into app background */
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(9, 11, 19, 0.4) 0%,
      rgba(9, 11, 19, 0.95) 80%
    );
  }
`;

const MainLayout = styled.div`
  display: flex;
  gap: 50px; /* Expanded gap to give the larger poster breathing room */
  align-items: flex-start;
  max-width: 1300px;
  margin: 0 auto;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const PosterWrapper = styled.div`
  flex-shrink: 0;
  width: 380px; /* Increased from 300px for a bolder presentation */
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(255, 255, 255, 0.12);
  transition: transform 300ms ease;

  &:hover {
    transform: scale(1.02); /* Subtle hover lift */
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  @media (max-width: 1200px) {
    width: 330px;
  }

  @media (max-width: 900px) {
    width: 260px;
  }
`;

const ContentMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MovieTitle = styled.div`
  h1 {
    margin: 0 0 10px 0;
    color: #ffffff;
    font-size: 2.8rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  h5 {
    margin: 0;
    color: #00d2ff;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.8px;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 28px 0px;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb(249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);
  font-weight: bold;
  transition: all 0.2s ease;

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: rgb(200, 200, 200);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 14px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 24px;
    }
  }
`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
  cursor: pointer;

  &:hover {
    background: rgba(249, 249, 249, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: rgb(200, 200, 200);
  }
`;

const AddList = styled.button`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.2s ease;
  cursor: pointer;

  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const GroupWatch = styled.button`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border: none;
  padding: 0;
  cursor: pointer;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: rgb(200, 200, 200);
  }
`;

const Description = styled.div`
  line-height: 1.6;
  font-size: 18px;
  color: rgb(249, 249, 249);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  max-width: 760px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
