import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import './themes/fonts.css';
import GlobalStyle from './themes/';
import { throttle } from 'throttle-debounce';
import { saveSate } from './utils/localstorage';

//pattern from https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67
store.subscribe(
  throttle(1000, () => {
    // saveSate({
    //   ui: store.getState().ui,
    //   // board: {
    //   //   levelIdx: store.getState().board.levelIdx
    //   // }
    // });
    saveSate(store.getState())
  })
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <GlobalStyle />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
