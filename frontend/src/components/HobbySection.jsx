import React, { useState, useEffect } from 'react';
import { categoryApi, hobbyApi } from '../services/api.js';

function HobbySection() {
  const initialFormState = {
    name: '',
    categoryIds: [],
    min_price: 0,
    max_price: 0,
    description: ''
  };
  const [categories, setCategories] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    try {
      const [catData, hobbyData] = await Promise.all([categoryApi.getAll(), hobbyApi.getAll()]);
      setCategories(catData);
      setHobbies(hobbyData);
    } catch (err) { console.error(err); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await hobbyApi.update(editingId, formData, selectedImage);
      } else {
        if (!selectedImage) {
          alert("Please select an image");
          return;
        }
        await hobbyApi.create(formData, selectedImage);
      }
      setFormData(initialFormState);
      setSelectedImage(null)
      setEditingId(null);
      loadAllData();
    } catch (err) {
      console.log(err);
      alert("Error: " + (err.message || "Failed to save hobby"));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setFormData({...formData, categoryIds: selectedOptions});
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM CARD */}
        <div className="card bg-base-200 shadow-xl p-6 h-fit border-2 border-base-300">
          <h2 className="card-title mb-4 text-2xl font-bold">
            {editingId ? "Edit Hobby" : "Create New Hobby"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                className="input input-bordered focus:input-primary"
                placeholder="Hobby name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
            />

            <div className="form-control">
              <label className="label-text mb-1 ml-1 text-xs">Categories</label>
              <select
                  className="select select-bordered"
                  multiple
                  size="3"
                  value={formData.categoryIds}
                  onChange={handleCategoryChange}
                  required
              >
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="form-control w-1/2">
                <label className="label-text mb-1 ml-1 text-xs">Min Price</label>
                <input
                    type="number"
                    className="input input-bordered"
                    value={formData.minPrice}
                    onChange={e => setFormData({...formData, minPrice: Number(e.target.value)})}
                    required
                />
              </div>
              <div className="form-control w-1/2">
                <label className="label-text mb-1 ml-1 text-xs">Max Price</label>
                <input
                    type="number"
                    className="input input-bordered"
                    value={formData.maxPrice}
                    onChange={e => setFormData({...formData, maxPrice: Number(e.target.value)})}
                    required
                />
              </div>
            </div>

            <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
            />

            <div className="form-control">
              <label className="label-text mb-1 ml-1 text-xs">
                Hobby Image {!editingId && <span className="text-error">*</span>}
              </label>
              <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  required={!editingId}
              />
              {selectedImage && (
                  <div className="text-sm text-gray-600 mt-1">
                    Selected: {selectedImage.name}
                  </div>
              )}
            </div>

            <div className="card-actions justify-end mt-4">
              <button type="submit" className="btn btn-primary flex-1">
                {editingId ? "Update" : "Save"}
              </button>
              {(editingId || formData.name !== '') && (
                  <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setEditingId(null);
                        setFormData(initialFormState);
                        setSelectedImage(null);
                      }}
                  >
                    Cancel
                  </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="lg:col-span-2 overflow-x-auto bg-base-100 rounded-box border border-base-300">
          <table className="table table-zebra w-full">
            <thead className="bg-base-300">
            <tr>
              <th>Name</th>
              <th>Categories</th>
              <th>Price Range</th>
              <th className="text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {hobbies.map(h => (
                <tr key={h.id} className="hover">
                  <td className="font-bold">{h.name}</td>
                  <td>
                    {h.categories?.map(cat => (
                        <div key={cat.id} className="badge badge-outline mr-1">
                          {cat.name}
                        </div>
                    ))}
                  </td>
                  <td>{h.min_price} - {h.max_price} $</td>
                  <td className="text-right flex justify-end gap-2">
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={() => {
                          setEditingId(h.id);
                          setFormData({
                            name: h.name,
                            description: h.description,
                            minPrice: h.min_price,
                            maxPrice: h.max_price,
                            categoryIds: h.categories?.map(c => c.id) || []
                          });
                        }}
                    >
                      ✎
                    </button>
                    <button
                        className="btn btn-sm btn-circle btn-error btn-outline"
                        onClick={() => hobbyApi.delete(h.id).then(loadAllData)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default HobbySection;