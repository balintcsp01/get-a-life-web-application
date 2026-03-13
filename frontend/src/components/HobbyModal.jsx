import { useState, useEffect } from 'react';
import { hobbyApi } from '../services/api.js';

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  name: '',
  description: '',
  categoryIds: [],
  difficulty: 'Beginner',
  minPrice: 0,
  maxPrice: 0,
};

export default function HobbyModal({ isOpen, onClose, onSaved, onError, categories, initialData = null, editingId = null }) {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? emptyForm);
      setImage(null);
      setImagePreview(null);
      setFieldErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [field]: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setImage(file);
    setFieldErrors((fe) => ({ ...fe, image: null }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleCategoryToggle = (id) => {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
    setFieldErrors((fe) => ({ ...fe, categoryIds: null }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (form.categoryIds.length === 0) errors.categoryIds = 'Select at least one category.';
    if (!editingId && !image) errors.image = 'An image is required.';
    if (form.minPrice < 0) errors.minPrice = 'Cannot be negative.';
    if (form.maxPrice < form.minPrice) errors.maxPrice = 'Must be ≥ min price.';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await hobbyApi.update(editingId, form, image);
      } else {
        await hobbyApi.create(form, image);
      }
      onSaved();
      onClose();
    } catch (err) {
      onError(err.message || 'Failed to save hobby.');
    } finally {
      setSaving(false);
    }
  };

  const difficultyColor = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-error' };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl w-full p-0 overflow-hidden">

        {/* Header */}
        <div className="bg-base-200 px-6 py-4 flex items-center justify-between border-b border-base-300">
          <h3 className="font-black text-xl uppercase tracking-wide">
            {editingId ? '✎ Edit Hobby' : '✦ Create Hobby'}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">

              {/* Name */}
              <div className="form-control">
                <label className="label-text mb-1 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Hobby Name
                </label>
                <input
                  className={`input input-bordered w-full ${fieldErrors.name ? 'input-error' : 'focus:input-primary'}`}
                  placeholder="e.g. Rock Climbing"
                  value={form.name}
                  onChange={set('name')}
                />
                {fieldErrors.name && <p className="text-error text-xs mt-1">{fieldErrors.name}</p>}
              </div>

              {/* Description */}
              <div className="form-control flex-1">
                <label className="label-text mb-1 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Description
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-28 resize-none focus:textarea-primary"
                  placeholder="What is this hobby about?"
                  value={form.description}
                  onChange={set('description')}
                />
              </div>

              {/* Price */}
              <div>
                <label className="label-text mb-2 block text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Price Range ($)
                </label>
                <div className="flex gap-3 items-center">
                  <div className="form-control flex-1">
                    <input
                      type="number" min="0"
                      className={`input input-bordered w-full ${fieldErrors.minPrice ? 'input-error' : ''}`}
                      placeholder="Min"
                      value={form.minPrice}
                      onChange={(e) => { setForm((f) => ({ ...f, minPrice: Number(e.target.value) })); setFieldErrors((fe) => ({ ...fe, minPrice: null })); }}
                    />
                    {fieldErrors.minPrice && <p className="text-error text-xs mt-1">{fieldErrors.minPrice}</p>}
                  </div>
                  <span className="text-base-content/40 font-bold">–</span>
                  <div className="form-control flex-1">
                    <input
                      type="number" min="0"
                      className={`input input-bordered w-full ${fieldErrors.maxPrice ? 'input-error' : ''}`}
                      placeholder="Max"
                      value={form.maxPrice}
                      onChange={(e) => { setForm((f) => ({ ...f, maxPrice: Number(e.target.value) })); setFieldErrors((fe) => ({ ...fe, maxPrice: null })); }}
                    />
                    {fieldErrors.maxPrice && <p className="text-error text-xs mt-1">{fieldErrors.maxPrice}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">

              <div className="form-control">
                <label className="label-text mb-1 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Image {!editingId && <span className="text-error">*</span>}
                </label>
                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                  fieldErrors.image ? 'border-error' : 'border-base-300 hover:border-primary'
                }`}>
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                      <button
                        type="button"
                        className="btn btn-xs btn-circle btn-error absolute top-2 right-2"
                        onClick={() => { setImage(null); setImagePreview(null); }}
                      >✕</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 cursor-pointer gap-2 text-base-content/40 hover:text-primary transition-colors">
                      <span className="text-3xl">🖼</span>
                      <span className="text-sm font-medium">
                        {editingId ? 'Click to replace image' : 'Click to upload image'}
                      </span>
                      <span className="text-xs">PNG, JPG supported</span>
                      <input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                {fieldErrors.image && <p className="text-error text-xs mt-1">{fieldErrors.image}</p>}
              </div>

              <div className="form-control">
                <label className="label-text mb-2 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`badge badge-lg cursor-pointer transition-all border ${
                        form.categoryIds.includes(cat.id)
                          ? 'badge-primary border-primary'
                          : 'badge-ghost border-base-300 hover:border-primary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                {fieldErrors.categoryIds && <p className="text-error text-xs mt-1">{fieldErrors.categoryIds}</p>}
              </div>

              <div className="form-control">
                <label className="label-text mb-2 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, difficulty: level }))}
                      className={`badge badge-lg cursor-pointer transition-all flex-1 border ${
                        form.difficulty === level
                          ? `${difficultyColor[level]} border-transparent`
                          : 'badge-ghost border-base-300 hover:border-base-content/30'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-200 px-6 py-4 flex justify-end gap-3 border-t border-base-300">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary min-w-24" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <span className="loading loading-spinner loading-sm" />
              : (editingId ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={!saving ? onClose : undefined} />
    </div>
  );
}
