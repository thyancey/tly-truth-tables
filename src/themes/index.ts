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
    /* font-family: 'Noto Sans', sans-serif; */
    ${mixinFontFamily()};
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
type tColor = 'brown_dark' | 'brown' | 'brown_light' | 'black' | 'grey_dark' | 'grey' | 'grey_light' | 'white' | 'pink' | 'red_dark' | 'red' | 'red_light' | 'blue_dark' | 'blue' | 'blue_light' | 'green_dark' | 'green' | 'green_light' | 'yellow_dark' | 'yellow' | 'yellow_light' | 'purple';
const colors = {
  brown_dark: '#35120e',
  brown: '#6b2b15',
  brown_light: '#d48e55',
  black: '#07070e',
  grey_dark: '#1a1932',
  grey: '#424c6e',
  grey_light: '#92a1b9',
  white: '#f7ede3',
  pink: '#f29caa',
  red_dark: '#7b102b',
  red: '#b3102b',
  red_light: '#e35970',
  green_dark: '#123f1d',
  green: '#33984b',
  green_light: '#5ac54f',
  blue_dark: '#003f61',
  blue: '#1c638d',
  blue_light: '#7ecbed',
  yellow_dark: '#666a15',
  yellow: '#afb224',
  yellow_light: '#cfd14d',
  purple: '#9c3d95',
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
