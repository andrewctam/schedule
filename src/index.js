import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./styles.css"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
