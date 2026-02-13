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
      <div className="max-w-md mx-auto">
        <div className="card bg-base-200 p-6 shadow-lg mb-8">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text" className="input input-bordered flex-1"
              placeholder="New category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="btn btn-primary">Add</button>
          </form>
        </div>

        <ul className="menu bg-base-100 w-full rounded-box border border-base-300 shadow-md">
          <li className="menu-title text-lg">Existing Categories</li>
          {categories.map((cat) => (
            <li key={cat.id} className="flex-row justify-between items-center p-2 border-b border-base-200 last:border-0">
              <span className="flex-1 font-semibold">{cat.name}</span>
              <button className="btn btn-xs btn-error btn-outline" onClick={() => handleDelete(cat.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default CategorySection;