import styled from "styled-components";
import React from "react";

// images
import imgViewersDisney from "../assets/images/viewers-disney.png";
import imgViewersMarvel from "../assets/images/viewers-marvel.png";
import imgViewersNational from "../assets/images/viewers-national.png";
import imgViewersPixar from "../assets/images/viewers-pixar.png";
import imgViewersStarWars from "../assets/images/viewers-starwars.png";

// videos
import videoDisney from "../assets/videos/video-disney.mp4";
import videoMarvel from "../assets/videos/video-marvel.mp4";
import videoNational from "../assets/videos/video-national-geographic.mp4";
import videoPixar from "../assets/videos/video-pixar.mp4";
import videoStarWars from "../assets/videos/video-star-wars.mp4";

export default function Viewers() {
  return (
    <Container>
      <Wrap>
        <img src={imgViewersDisney} alt="Disney" />
        <video autoPlay={true} loop={true} playsInline={true} muted={true}>
          <source src={videoDisney} type="video/mp4" />
        </video>
      </Wrap>
      <Wrap>
        <img src={imgViewersMarvel} alt="Marvel" />
        <video autoPlay={true} loop={true} playsInline={true} muted={true}>
          <source src={videoMarvel} type="video/mp4" />
        </video>
      </Wrap>
      <Wrap>
        <img src={imgViewersNational} alt="National Greographic" />
        <video autoPlay={true} loop={true} playsInline={true} muted={true}>
          <source src={videoNational} type="video/mp4" />
        </video>
      </Wrap>
      <Wrap>
        <img src={imgViewersPixar} alt="Pixar" />
        <video autoPlay={true} loop={true} playsInline={true} muted={true}>
          <source src={videoPixar} type="video/mp4" />
        </video>
      </Wrap>
      <Wrap>
        <img src={imgViewersStarWars} alt="Viewer 5" />
        <video autoPlay={true} loop={true} playsInline={true} muted={true}>
          <source src={videoStarWars} type="video/mp4" />
        </video>
      </Wrap>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 30px;
  padding: 30px 0px 26px;
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const Wrap = styled.div`
  padding-top: 56.25%;
  border-radius: 10px;
  box-shadow:
    rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 3px solid rgba(249, 249, 249, 0.1);

  img {
    inset: 0px;
    display: block;
    height: 100%;
    object-fit: cover;
    opacity: 1;
    position: absolute;
    transition: opacity 500ms ease-in-out 0s;
    width: 100%;
    z-index: 1;
    top: 0;
  }

  video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    opacity: 0;
    z-index: 0;
  }

  &:hover {
    box-shadow:
      rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);

    video {
      opacity: 1;
    }
  }
`;
