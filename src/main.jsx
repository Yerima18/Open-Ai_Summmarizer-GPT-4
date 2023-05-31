import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './services/store.js';

// Render the app root component to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  // Enable strict mode for additional checks during development
  <React.StrictMode>
    {/* Provide the Redux store to the app */}
    <Provider store={store}>
      {/* Render the App component */}
      <App />
    </Provider>
  </React.StrictMode>,
);
