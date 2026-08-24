import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/omdb';

// IMDb IDs to feature in the main hero slider
const FEATURED_IDS = [
  'tt0816692', // Interstellar
  'tt1160419', // Dune
  'tt10872600', // Spider-Man: No Way Home
  'tt15398776', // Oppenheimer
];

export default function ImageSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const promises = FEATURED_IDS.map((id) => getMovieDetails(id));
        const results = await Promise.all(promises);
        setSlides(results);
      } catch (err) {
        console.error('Failed to load slider movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: '20px',
        },
      },
    ],
  };

  if (loading || slides.length === 0) {
    return <SliderSkeleton />;
  }

  return (
    <Carousel {...settings}>
      {slides.map((movie) => (
        <Wrap
          key={movie.imdbID}
          onClick={() => navigate(`/detail/${movie.imdbID}`)}
        >
          <BannerContent>
            {/* Ambient Background Image */}
            <BannerImage src={movie.Poster} alt={movie.Title} />

            {/* Dark Gradient Overlay for Readability */}
            <GradientOverlay />

            {/* Slide Information & Quick Watch Button */}
            <SlideDetails>
              <Tag>FEATURED</Tag>
              <Title>{movie.Title}</Title>
              <Meta>
                <span>{movie.Year}</span> • <span>{movie.Runtime}</span> •{' '}
                <span>{movie.Genre}</span>
              </Meta>
              <Plot>{movie.Plot}</Plot>

              <WatchButton>
                <img src="/images/play-icon-black.png" alt="" />
                <span>EXPLORE</span>
              </WatchButton>
            </SlideDetails>
          </BannerContent>
        </Wrap>
      ))}
    </Carousel>
  );
}

// STYLED COMPONENTS
const SliderSkeleton = styled.div`
  height: 380px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  animation: pulse 1.5s infinite ease-in-out;

  @keyframes pulse {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.4;
    }
  }
`;

const Carousel = styled(Slider)`
  margin-top: 20px;

  & > button {
    opacity: 0;
    height: 100%;
    width: 6vw;
    z-index: 2;

    &:hover {
      opacity: 1;
      transition: opacity 0.2s ease;
    }
  }

  .slick-list {
    overflow: initial;
    padding-bottom: 25px !important;
  }

  ul.slick-dots {
    bottom: -20px;

    li {
      margin: 0 4px;
      width: 10px;
      height: 8px;
      transition: all 0.3s ease;

      button {
        width: 100%;
        height: 100%;
        padding: 0;

        &:before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.35);
          opacity: 1;
          top: 0;
          left: 0;
        }
      }

      &.slick-active {
        width: 24px;

        button:before {
          width: 24px;
          background-color: #f9f9f9;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      }
    }
  }

  .slick-prev {
    left: -50px;
  }
  .slick-next {
    right: -50px;
  }
`;

const Wrap = styled.div`
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  padding: 0 8px;
`;

const BannerContent = styled.div`
  position: relative;
  height: 380px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.69) 0px 26px 30px -10px;
  transition: all 300ms cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    border: 3px solid rgba(249, 249, 249, 0.8);
    transform: scale(1.01);
  }

  @media (max-width: 768px) {
    height: 260px;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: brightness(0.7);
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(4, 7, 20, 0.95) 0%,
    rgba(4, 7, 20, 0.6) 50%,
    transparent 100%
  );
`;

const SlideDetails = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;

  @media (max-width: 768px) {
    width: 80%;
    padding: 20px;
  }
`;

const Tag = styled.span`
  color: #00d2ff;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-size: 32px;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Meta = styled.div`
  font-size: 13px;
  color: #a0a0a0;
  margin-bottom: 12px;
`;

const Plot = styled.p`
  font-size: 14px;
  color: #d0d0d0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const WatchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  background: #f9f9f9;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  letter-spacing: 1.2px;
  cursor: pointer;

  img {
    width: 16px;
  }

  &:hover {
    background: #c6c6c6;
  }
`;
