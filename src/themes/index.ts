import { createGlobalStyle, css } from "styled-components"

type FontStyle = 'display' | 'speech';
export const mixinFontFamily = (style?: FontStyle) => {
  switch(style){
    case 'display' : return css`font-family: 'Noto Sans', sans-serif`;
    case 'speech': return css`font-family: 'VT323', monospace`;
    default: return css`font-family: 'VT323', monospace`;
  }
}

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline:0;
    box-sizing:border-box;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
  #root{
    margin:0 auto;
  }
  h1, h2, h3, h4{
    font-family: 'Noto Sans', sans-serif;
  }
  a, p, button, span, h5, h6{
    ${mixinFontFamily()};
  }
  h1{
    font-size: 5rem;
  }
  h2{
    font-size: 4rem;
  }
  h3{
    font-size: 3.5rem;
  }
  h4{
    font-size: 2.5rem;
  }
  h5{
    font-size: 2rem;
  }
  p, span{
    font-size:2rem;
  }

  html{
    font-size: 62.5%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    ${mixinFontFamily()};
    background-color: black;
  }
`



export const listColors = () => {
  return Object.keys(store.colors);
}


export const getColor = (colorId: tColor) => {
  return store.colors[colorId] as CssString; 
}

export const getShadow = (shadowId: tShadow) => {
  return store.shadows[shadowId] as CssString;
}

export const getBreakpoint = (breakpointId: tBreakpoint) => {
  return store.breakpoints[breakpointId] as CssString;
}

type CssString = string;

type tShadow = 'z1' | 'z2' | 'z3';
const shadows = {
  z1: '-0.1rem 0.1rem .25rem .1rem rgba(0,0,0,0.16)',
  z2: '-0.1rem 0.1rem .25rem .1rem rgba(0,0,0,0.36)',
  z3: '-.2rem .5rem 1rem .2rem rgba(0,0,0,.36)'
}
type tColor = 'brown_dark' | 'brown' | 'brown_light' | 'black' | 'grey' | 'grey_light' | 'white' | 'pink_dark' | 'pink' | 'pink_light' | 'red' | 'blue_dark' | 'blue' | 'blue_light' | 'green_dark' | 'green' | 'green_light' | 'yellow' | 'purple';
const colors = {
  brown_dark: '#35120e',
  brown: '#6b2b15',
  brown_light: '#d48e55',
  black: '#1a1932',
  grey: '#424c6e',
  grey_light: '#92a1b9',
  white: '#e8c8a9',
  pink_dark: '#bd1e7d',
  pink: '#ff4785',
  pink_light: '#ff8095',
  red: '#b3102b',
  green_dark: '#1e6f50',
  green: '#5ac54f',
  green_light: '#99e65f',
  blue_dark: '#2a2f4e',
  blue: '#0069aa',
  blue_light: '#0098dc',
  yellow: '#fff249',
  purple: '#660e49',
}

type tBreakpoint = 'mobile_tiny' | 'mobile_medium' | 'mobile_large' | 'tablet' | 'desktop';
const breakpoints = {
  mobile_tiny: '300px',
  mobile_medium: '400px',
  mobile_large: '500px',
  tablet: '768px',
  desktop: '1024px'
}

type ThemeStore = {
  colors: typeof colors,
  shadows: typeof shadows,
  breakpoints: typeof breakpoints
}

export const store: ThemeStore = {
  colors: colors,
  shadows: shadows,
  breakpoints: breakpoints
}
