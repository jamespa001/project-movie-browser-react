import styled from 'styled-components';
import React, { useEffect, useState } from 'react';

// Images
import imgLogo from '../assets/images/logo.svg';
import imgHome from '../assets/images/home-icon.svg';
import imgSearch from '../assets/images/search-icon.svg';
import imgMemberExclusive from '../assets/images/member-exclusive-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPhoto,
  selectUserName,
  setSignOutState,
  setUserLoginDetails,
} from '../features/user/UserSlice';
import { auth, provider } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectPhoto);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }),
    );
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [userName]);

  const handleAuth = () => {
    if (!userName) {
      auth
        .signInWithPopup(provider)
        .then((result) => {
          setUser(result.user);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      auth.signOut().then(() => {
        dispatch(setSignOutState());
      });
    }
  };

  return (
    <Nav>
      <Logo>
        <img src={imgLogo} alt="Movie+" />
      </Logo>
      <NavMenu>
        <a href="/home">
          <img src={imgHome} alt="" />
          <span>HOME</span>
        </a>
        <a href="/search">
          <img src={imgSearch} alt="" />
          <span>SEARCH</span>
        </a>
        {userName && (
          <a href="/memberExclusive">
            <img src={imgMemberExclusive} alt="" />
            <span>MEMBER EXCLUSIVE</span>
          </a>
        )}
      </NavMenu>

      <LoginContainer>
        {/* HAMBURGER TOGGLE BUTTON (MOBILE ONLY) */}
        <Hamburger $isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>

        {/* MOBILE DRAWER OVERLAY */}
        <MobileDrawer $isOpen={menuOpen}>
          <DrawerItem onClick={() => handleNavClick('/home')}>HOME</DrawerItem>
          <DrawerItem onClick={() => handleNavClick('/search')}>
            SEARCH
          </DrawerItem>
          {!userName ? (
            <DrawerItem onClick={handleAuth}>LOG IN</DrawerItem>
          ) : (
            <>
              <DrawerItem onClick={() => handleNavClick('/memberExclusive')}>
                MEMBER EXCLUSIVE
              </DrawerItem>
              <DrawerItem onClick={handleAuth}>SIGN OUT</DrawerItem>
            </>
          )}
        </MobileDrawer>

        {!userName ? (
          <Login onClick={handleAuth}>Log in</Login>
        ) : (
          <SignOut>
            {userPhoto && <UserImg src={userPhoto} alt="{userName}" />}
            <DropDown>
              <span onClick={handleAuth}>Sign out</span>
            </DropDown>
          </SignOut>
        )}
      </LoginContainer>
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 50;
`;

const Logo = styled.a`
  padding: 0;
  width: 100px;
  margin-top: 4px;
  max-height: 70px;
  display: inline-block;

  img {
    display: block;
    width: 100%;
    height: 100%;
    margin-top: -15px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  margin: 0px;
  padding: 10px;
  position: relative;
  margin-right: auto;
  margin-left: 100px;

  a {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding: 0 12px;

    img {
      height: 25px;
      width: 25px;
      min-width: 25px;
      display: block;
    }

    span {
      color: rgb(249, 249, 249);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1.6px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      transform: translateY(0.1em);

      &:before {
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -2px;
        content: '';
        height: 2px;
        left: 0px;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }

      @media (max-width: 1024px) {
        font-size: 18px;
      }
    }

    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1;
      }
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 102;

  span {
    width: 2rem;
    height: 0.25rem;
    background: #f9f9f9;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    &:nth-child(1) {
      transform: ${(props) => (props.$isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }
    &:nth-child(2) {
      opacity: ${(props) => (props.$isOpen ? '0' : '1')};
      transform: ${(props) =>
        props.$isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }
    &:nth-child(3) {
      transform: ${(props) => (props.$isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileDrawer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #040714;
  transform: ${(props) =>
    props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: fixed;
  top: 0;
  right: 0;
  width: 70vw;
  transition: transform 0.3s ease-in-out;
  z-index: 101;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);

  @media (min-width: 769px) {
    display: none;
  }
`;

const DrawerItem = styled.a`
  font-size: 1.2rem;
  text-transform: uppercase;
  padding: 1.5rem 0;
  font-weight: bold;
  letter-spacing: 2px;
  color: #f9f9f9;
  text-decoration: none;
  transition: color 0.3s linear;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    color: #00d2ff;
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  font-size: 18px;
  letter-spacing: 2px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.3s ease 0s;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    font-weight: bold;
    border-color: transparent;
  }
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
  /* z-index: 999; */
  pointer-events: none; /* prevents click while invisible */
  transition: opacity 0.3s ease-in-out;

  span {
    display: block;
  }
`;

const UserImg = styled.img`
  border-radius: 50%;
  height: 100%;
  width: 100%;
`;

const SignOut = styled.div`
  position: relative;
  display: flex;
  height: 48px;
  width: 48px;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${DropDown} {
      opacity: 1;
      pointer-events: auto; /* Enable clicking on hover */
    }
  }
`;
