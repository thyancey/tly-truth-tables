import React, { useState } from 'react';
import { getColor } from './themes/';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Main } from './scenes/main';

export const ScStage = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
`

function App() {
  const [ collapsed, setCollapsed ] = useState(false);
  const pages = [
    {
      route: '/',
      text: 'Round1',
      element: <Main/>
    }
  ]
  
  return (
    <HashRouter>
      <ScStage>
        <Routes>
          {pages.map((p, i) => (
            <Route key={i} path={p.route} element={p.element} />
          ))}
        </Routes>
      </ScStage>
    </HashRouter>
  );
}

export default App;
