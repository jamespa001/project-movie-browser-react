import styled from 'styled-components';

import React from 'react';
import imgHomeBackground from '../assets/images/home-background.png';
import ImageSlider from './ImageSlider';
import Viewers from './Viewers';
import Recommended from './Recommended';
import NewRelease from './NewRelease';
import Original from './Original';
import Trending from './Trending';

export default function Home() {
  return (
    <Container>
      <ImageSlider />
      <Viewers />
      <Recommended />
      <NewRelease />
      <Original />
      <Trending />
    </Container>
  );
}

const Container = styled.main`
  position: relative;
  background: url(${imgHomeBackground});

  overflow: hidden;
  display: flex;
  flex-direction: column;
  // text-align: center;
  min-height: calc(100vh - 70px);
  margin-top: 70px; /* Pushes content down past the fixed header */
  background-image: url(${imgHomeBackground});
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;

  padding: 0 calc(3.5vw + 5px);
`;
