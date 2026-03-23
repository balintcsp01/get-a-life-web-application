import { useState, useEffect, useRef } from 'react';
import { suggestionApi } from '../services/api.js';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const emptyForm = {
  name: '',
  description: '',
  difficulty: 'Beginner',
  minPrice: 0,
  maxPrice: 0,
};

export default function SuggestHobbyModal({ isOpen, onClose, onSuccess, onError, categories = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [selectedCategories, setSelectedCategories] = useState([]); // list of category names
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const customInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setSelectedCategories([]);
      setCustomCategoryInput('');
      setFieldErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [field]: null }));
  };

  const toggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
    setFieldErrors((fe) => ({ ...fe, categories: null }));
  };

  const addCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (!selectedCategories.includes(trimmed)) {
      setSelectedCategories((prev) => [...prev, trimmed]);
    }
    setCustomCategoryInput('');
    customInputRef.current?.focus();
  };

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomCategory(); }
  };

  const removeCategory = (name) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== name));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (form.minPrice < 0) errors.minPrice = 'Cannot be negative.';
    if (form.maxPrice < form.minPrice) errors.maxPrice = 'Must be ≥ min price.';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setSaving(true);
    try {
      await suggestionApi.create({
        name: form.name.trim(),
        description: form.description.trim() || null,
        difficulty: form.difficulty,
        minPrice: form.minPrice,
        maxPrice: form.maxPrice,
        categories: selectedCategories,
      });
      onSuccess?.('Your suggestion was submitted! Admins will review it soon.');
      onClose();
    } catch (err) {
      onError?.(err.message || 'Failed to submit suggestion.');
    } finally {
      setSaving(false);
    }
  };

  const difficultyColor = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-error' };

  // Split categories into existing ones and custom (not in the fetched list)
  const existingNames = categories.map((c) => c.name);
  const customSelected = selectedCategories.filter((n) => !existingNames.includes(n));

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl w-full p-0 overflow-hidden">

        {/* Header */}
        <div className="bg-base-200 px-6 py-4 flex items-center justify-between border-b border-base-300">
          <h3 className="font-black text-xl uppercase tracking-wide">💡 Suggest a Hobby</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <p className="text-sm text-base-content/50 mb-5">
            Have a hobby idea? Fill in what you know — admins will review it and may add it to the catalogue.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">

              {/* Name */}
              <div className="form-control">
                <label className="label-text mb-1 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Hobby Name <span className="text-error">*</span>
                </label>
                <input
                  className={`input input-bordered w-full ${fieldErrors.name ? 'input-error' : 'focus:input-primary'}`}
                  placeholder="e.g. Bouldering"
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
                  placeholder="What is this hobby about? Why would people enjoy it?"
                  value={form.description}
                  onChange={set('description')}
                />
              </div>

              {/* Price */}
              <div>
                <label className="label-text mb-2 block text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Estimated Price Range ($)
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

              {/* Categories */}
              <div className="form-control">
                <label className="label-text mb-2 text-xs font-bold uppercase tracking-widest text-base-content/60">
                  Categories
                </label>

                {/* Existing category badges */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.name)}
                        className={`badge badge-lg cursor-pointer transition-all border ${
                          selectedCategories.includes(cat.name)
                            ? 'badge-primary border-primary'
                            : 'badge-ghost border-base-300 hover:border-primary'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom category input */}
                <div className="flex gap-2">
                  <input
                    ref={customInputRef}
                    className="input input-bordered input-sm flex-1 focus:input-primary"
                    placeholder="Suggest a new category…"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    onKeyDown={handleCustomKeyDown}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={addCustomCategory}
                    disabled={!customCategoryInput.trim()}
                  >
                    + Add
                  </button>
                </div>
                <p className="text-xs text-base-content/40 mt-1">Pick existing ones or type a new one and press Enter.</p>

                {/* Custom category pills */}
                {customSelected.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customSelected.map((name) => (
                      <span key={name} className="badge badge-secondary gap-1">
                        {name}
                        <button type="button" className="text-xs leading-none" onClick={() => removeCategory(name)}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
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

              {/* Info box */}
              <div className="rounded-xl bg-base-200 border border-base-300 p-4 mt-auto">
                <p className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-1">How it works</p>
                <ul className="text-xs text-base-content/60 space-y-1 list-disc list-inside">
                  <li>Submit your idea with as much detail as you like</li>
                  <li>Admins review all suggestions</li>
                  <li>Approved hobbies get added to the catalogue</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-200 px-6 py-4 flex justify-end gap-3 border-t border-base-300">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary min-w-28" onClick={handleSubmit} disabled={saving}>
            {saving ? <span className="loading loading-spinner loading-sm" /> : '💡 Submit Idea'}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={!saving ? onClose : undefined} />
    </div>
  );
}
