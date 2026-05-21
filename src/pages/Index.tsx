import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import type { PageName } from '../App';

interface IndexProps {
  navigate: (page: PageName) => void;
}

const App: React.FC<IndexProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-medium/80 font-sans">
      <Header />
      <main>
        <HeroSection navigate={navigate} />
      </main>
    </div>
  );
};

export default App;