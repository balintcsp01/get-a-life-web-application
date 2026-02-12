import React, { useState } from 'react';
import HobbySection from '../components/HobbySection.jsx';
import CategorySection from '../components/CategorySection.jsx';
import SuggestionSection from '../components/SuggestionSection.jsx';

const AdminPage = () => {
  const [view, setView] = useState('hobbies');

  return (
    <div>
      <h1>Get a Life! Admin Page</h1>

      <nav>
        <button onClick={() => setView('hobbies')}>Hobbies</button>
        <button onClick={() => setView('categories')}>Categories</button>
        <button onClick={() => setView('suggestions')}>Suggestions</button>
      </nav>

      <div>
        {view === 'hobbies' && <HobbySection />}
        {view === 'categories' && <CategorySection />}
        {view === 'suggestions' && <SuggestionSection />}
      </div>
    </div>
  );
};



export default AdminPage;