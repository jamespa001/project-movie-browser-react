import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #040714;
  color: #f9f9f9;
  font-family: 'Nunito Sans', sans-serif;
  letter-spacing: 1.5px;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}
`;
