import React from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';

import './App.css';

const App = () => {
  return (
    <main>
      {/* Background Gradient */}
      <div className='main'>
        <div className='gradient'></div>
      </div>

      {/* App Content */}
      <div className='app'>
        {/* Hero Section */}
        <Hero />

        {/* Demo Section */}
        <Demo />
      </div>
    </main>
  );
}

export default App;
