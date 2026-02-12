import React, { useState, useEffect } from 'react';
import { categoryApi, hobbyApi } from '../services/api.js';

function HobbySection() {
  const initialFormState = {
    name: '',
    category_id: '',
    min_price: 0,
    max_price: 0,
    description: ''
  };

  const [categories, setCategories] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [catData, hobbyData] = await Promise.all([
        categoryApi.getAll(),
        hobbyApi.getAll()
      ]);
      setCategories(catData);
      setHobbies(hobbyData);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await hobbyApi.update(editingId, formData);
        alert("Hobby updated successfully!");
      } else {
        await hobbyApi.create(formData);
        alert("Hobby created successfully!");
      }
      setFormData(initialFormState);
      setEditingId(null);
      loadAllData();
    } catch (err) {
      alert("Error while saving hobby!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hobby?")) {
      try {
        await hobbyApi.delete(id);
        setHobbies(hobbies.filter(h => h.id !== id));
        if (editingId === id) {
          setEditingId(null);
          setFormData(initialFormState);
        }
        alert("Hobby deleted!");
      } catch (err) {
        alert("Error while deleting hobby!");
      }
    }
  };

  const handleEditClick = (hobby) => {
    setEditingId(hobby.id);
    setFormData({
      name: hobby.name,
      category_id: hobby.category_id,
      min_price: hobby.min_price,
      max_price: hobby.max_price,
      description: hobby.description
    });
  };

  return (
    <div>
      <h2>{editingId ? "Edit Hobby" : "Create Hobby"}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          placeholder="Hobby name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />

        <select
          value={formData.category_id}
          onChange={e => setFormData({...formData, category_id: e.target.value})}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <div>
          <label>Min Price:
            <input type="number" value={formData.min_price} onChange={e => setFormData({...formData, min_price: e.target.value})} />
          </label>
          <label>Max Price:
            <input type="number" value={formData.max_price} onChange={e => setFormData({...formData, max_price: e.target.value})} />
          </label>
        </div>

        <textarea
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        ></textarea>

        <div>
          <button type="submit">
            {editingId ? "Update Hobby" : "Save Hobby"}
          </button>

          {(editingId || formData.name !== '') && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormState);
                }}

              >
                {editingId ? "Cancel Edit" : "Clear Form"}
              </button>
            )}
        </div>
      </form>

      <hr/>

      {/* LIST */}
      <h3>Current Hobbies</h3>
      <table border="1" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Category ID</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hobbies.map(h => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.category_id}</td>
              <td>{h.min_price} - {h.max_price}</td>
              <td>
                <button onClick={() => handleEditClick(h)}>Edit</button>
                <button onClick={() => handleDelete(h.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HobbySection;