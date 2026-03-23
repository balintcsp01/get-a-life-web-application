import { useState, useEffect, useRef } from 'react';
import { hobbyApi, categoryApi } from '../services/api.js';

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  name: '',
  description: '',
  categoryIds: [],
  difficulty: 'Beginner',
  minPrice: 0,
  maxPrice: 0,
};

export default function HobbyModal({
  isOpen, onClose, onSaved, onError,
  categories, onCategoryCreated,
  initialData = null, editingId = null,
}) {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Quick-add category state
  const [newCatInput, setNewCatInput] = useState('');
  const [pendingCustomCategories, setPendingCustomCategories] = useState([]); // names not yet in DB
  const [addingCat, setAddingCat] = useState(false);
  const [catError, setCatError] = useState(null);
  const newCatRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? emptyForm);
      setImage(null);
      setImagePreview(null);
      setFieldErrors({});
      setNewCatInput('');
      setCatError(null);
      setPendingCustomCategories(initialData?.customCategoryNames ?? []);
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
    setImagePreview(file ? URL.createObjectURL(file) : null);
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

  const createCategory = async (name, { removeFromPending = false } = {}) => {
    setAddingCat(true);
    setCatError(null);
    try {
      const created = await categoryApi.create(name);
      if (removeFromPending) {
        setPendingCustomCategories((prev) => prev.filter((n) => n !== name));
      } else {
        setNewCatInput('');
      }
      setForm((f) => ({ ...f, categoryIds: [...f.categoryIds, created.id] }));
      setFieldErrors((fe) => ({ ...fe, categoryIds: null }));
      onCategoryCreated?.();
      newCatRef.current?.focus();
    } catch (err) {
      setCatError(err.message?.includes('409') || err.message?.toLowerCase().includes('conflict')
        ? 'Category already exists.'
        : (err.message || 'Could not create category.'));
    } finally {
      setAddingCat(false);
    }
  };

  const handleQuickAddCategory = () => createCategory(newCatInput.trim());

  const handleCatKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleQuickAddCategory(); }
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
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

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

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">

              {/* Image */}
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

              {/* Categories */}
              <div className="form-control">
                <label className="label-text mb-2 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Categories
                </label>

                {/* Existing category badges */}
                <div className="flex flex-wrap gap-2 mb-3">
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

                {/* Pending custom categories from suggestion — need to be created */}
                {pendingCustomCategories.length > 0 && (
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-warning mb-2">Suggested new categories</p>
                    <div className="flex flex-wrap gap-2">
                      {pendingCustomCategories.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className="badge badge-warning gap-1 cursor-pointer hover:opacity-80"
                          onClick={() => createCategory(name, { removeFromPending: true })}
                          disabled={addingCat}
                          title={`Click to create "${name}" and add it`}
                        >
                          + {name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-warning/70 mt-2">Click a badge to create the category and add it to this hobby.</p>
                  </div>
                )}

                {/* Quick-add input */}
                <div className="flex gap-2">
                  <input
                    ref={newCatRef}
                    className={`input input-bordered input-sm flex-1 focus:input-primary ${catError ? 'input-error' : ''}`}
                    placeholder="New category…"
                    value={newCatInput}
                    onChange={(e) => { setNewCatInput(e.target.value); setCatError(null); }}
                    onKeyDown={handleCatKeyDown}
                    disabled={addingCat}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={handleQuickAddCategory}
                    disabled={addingCat || !newCatInput.trim()}
                  >
                    {addingCat ? <span className="loading loading-spinner loading-xs" /> : '+ Add'}
                  </button>
                </div>
                {catError && <p className="text-error text-xs mt-1">{catError}</p>}
                {fieldErrors.categoryIds && <p className="text-error text-xs mt-1">{fieldErrors.categoryIds}</p>}
              </div>

              {/* Difficulty */}
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
