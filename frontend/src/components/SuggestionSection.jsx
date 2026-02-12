import React, { useState, useEffect } from 'react';
import { suggestionApi, hobbyApi, categoryApi } from '../services/api.js';

function SuggestionSection() {
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingSuggestion, setEditingSuggestion] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [suggData, catData] = await Promise.all([
        suggestionApi.getAll().catch(() => []),
        categoryApi.getAll().catch(() => [])

      ]);
      setSuggestions(suggData);
      setCategories(catData);
    } catch (err) {
      console.error("Failed to load data");
    }
  };

  const handleEdit = (suggestion) => {
    setEditingSuggestion({ ...suggestion });
  };

  const handleFinalize = async () => {
    try {
      await hobbyApi.create(editingSuggestion);
      await suggestionApi.delete(editingSuggestion.id);
      alert("Suggestion finalized and moved to Hobbies!");
      setEditingSuggestion(null);
      loadData();
    } catch (err) {
      alert("Error during finalization!");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject and delete this suggestion?")) {
      try {
        await suggestionApi.delete(id);
        alert("Suggestion rejected and deleted.");
        if (editingSuggestion?.id === id) setEditingSuggestion(null);
        loadData();
      } catch (err) {
        alert("Error during rejection.");

      }
    }
  };

  return (
    <div>

      <div>
        <h2>Pending Suggestions</h2>
        <table>
          <thead>
            <tr>
              <th>Hobby Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Review</button>
                  <button
                    onClick={() => handleReject(s.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSuggestion && (
        <div>
          <h3>Review & Modify Suggestion</h3>
          <div>

            <label>Name:
              <input type="text"
                value={editingSuggestion.name}
                onChange={e => setEditingSuggestion({...editingSuggestion, name: e.target.value})} />
            </label>

            <label>Category:
              <select
                value={editingSuggestion.category_id}
                onChange={e => setEditingSuggestion({...editingSuggestion, category_id: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </label>

            <div>
              <label>Min Price:
                <input type="number" value={editingSuggestion.min_price}
                  onChange={e => setEditingSuggestion({...editingSuggestion, min_price: e.target.value})} />
              </label>
              <label>Max Price:
                <input type="number" value={editingSuggestion.max_price}
                  onChange={e => setEditingSuggestion({...editingSuggestion, max_price: e.target.value})} />
              </label>
            </div>

            <label>Description:
              <textarea rows="4"
                value={editingSuggestion.description}
                onChange={e => setEditingSuggestion({...editingSuggestion, description: e.target.value})} />
            </label>

            <div>
              <button
                onClick={handleFinalize}
              >
                Accept & Finalize
              </button>
              <button
                onClick={() => setEditingSuggestion(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestionSection;