import React, { useState, useEffect } from 'react';
import { categoryApi } from '../services/api.js';

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await categoryApi.create(newCategory);
      setNewCategory('');
      loadCategories();
    } catch (err) {
      alert("Error: Category might already exist.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await categoryApi.delete(id);
        loadCategories();
      } catch (err) {
        alert("Could not delete category.");
      }
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>

      <form onSubmit={handleAdd} >
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name}
              <button
                onClick={() => handleDelete(cat.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategorySection;