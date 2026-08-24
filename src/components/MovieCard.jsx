import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default function MovieCard({
  id,
  title,
  poster,
  year,
  runtime,
  rating,
}) {
  return (
    <CardContainer>
      <Link to={`/detail/${id}`}>
        <img
          src={poster && poster !== 'N/A' ? poster : '/images/no-poster.png'}
          alt={title}
        />
        <MovieInfo>
          <h4>{title}</h4>
          <p>
            {year} • {runtime} {rating ? `• ★ ${rating}/10` : ''}
          </p>
        </MovieInfo>
      </Link>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px;
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
  padding: 10px 12px;
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
