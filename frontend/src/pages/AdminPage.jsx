import React, { useState } from 'react';
import HobbySection from '../components/HobbySection.jsx';
import CategorySection from '../components/CategorySection.jsx';
import SuggestionSection from '../components/SuggestionSection.jsx';

const AdminPage = () => {
  const [view, setView] = useState('hobbies');

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-base-100" data-theme="retro">
      <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-widest italic underline decoration-primary">
        Get a Life! Admin
      </h1>

      <div className="tabs tabs-boxed justify-center mb-8 bg-base-200 p-2">
        <button
          className={`tab tab-lg ${view === 'hobbies' ? 'tab-active btn-primary' : ''}`}
          onClick={() => setView('hobbies')}
        >
          Hobbies
        </button>
        <button
          className={`tab tab-lg ${view === 'categories' ? 'tab-active btn-primary' : ''}`}
          onClick={() => setView('categories')}
        >
          Categories
        </button>
        <button
          className={`tab tab-lg ${view === 'suggestions' ? 'tab-active btn-primary' : ''}`}
          onClick={() => setView('suggestions')}
        >
          Suggestions
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        {view === 'hobbies' && <HobbySection />}
        {view === 'categories' && <CategorySection />}
        {view === 'suggestions' && <SuggestionSection />}
      </div>
    </div>
  );
};

export default AdminPage;