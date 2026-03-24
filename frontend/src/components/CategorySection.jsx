import { useState, useEffect } from 'react';
import { categoryApi } from '../services/api.js';
import { SkeletonCategoryList } from './Skeletons.jsx';

export default function CategorySection({ onError, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteBlockedBy, setDeleteBlockedBy] = useState(null);

  useEffect(() => { void load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await categoryApi.getAll());
    } catch {
      onError?.('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAdding(true);
    try {
      await categoryApi.create(newCategory.trim());
      setNewCategory('');
      onSuccess?.(`Category "${newCategory.trim()}" created.`);
      await load();
    } catch {
      onError?.('Category already exists or could not be created.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await categoryApi.delete(confirmDeleteId);
      setConfirmDeleteId(null);
      await load();
    } catch (err) {
      if (err.body?.hobbyNames) setDeleteBlockedBy(err.body.hobbyNames);
      else { onError?.('Could not delete category.'); setConfirmDeleteId(null); }
    } finally {
      setDeleting(false);
    }
  };

  const confirmingCat = categories.find((c) => c.id === confirmDeleteId);

  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-200 p-6 shadow-lg mb-6">
        <h2 className="font-bold text-sm uppercase tracking-widest text-base-content/50 mb-3">New Category</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            className="input input-bordered flex-1 focus:input-primary"
            placeholder="Category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn btn-primary" disabled={adding || !newCategory.trim()}>
            {adding ? <span className="loading loading-spinner loading-sm" /> : 'Add'}
          </button>
        </form>
      </div>

      {loading ? (
        <SkeletonCategoryList count={6} />
      ) : (
        <div className="bg-base-100 rounded-box border border-base-300 shadow-md overflow-hidden">
          <div className="px-4 py-3 bg-base-200 border-b border-base-300">
            <h2 className="font-bold text-sm uppercase tracking-widest text-base-content/50">
              Categories <span className="text-base-content/30">({categories.length})</span>
            </h2>
          </div>
          {categories.length === 0 ? (
            <p className="text-center py-8 text-base-content/40 text-sm">No categories yet.</p>
          ) : (
            <ul>
              {categories.map((cat, i) => (
                <li
                  key={cat.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i < categories.length - 1 ? 'border-b border-base-200' : ''
                  }`}
                >
                  <span className="font-semibold">{cat.name}</span>
                  <button
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => setConfirmDeleteId(cat.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDeleteId && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            {deleteBlockedBy ? (
              <>
                {/* Coloured top bar */}
                <div className="-mx-6 -mt-6 mb-5 px-6 py-4 bg-warning/10 border-b border-warning/20 flex items-center gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <p className="font-black text-base uppercase tracking-wide">Cannot Delete</p>
                    <p className="text-xs text-base-content/50">This category is still in use</p>
                  </div>
                </div>

                <p className="text-sm text-base-content/70 mb-3">
                  <span className="font-bold text-base-content">{confirmingCat?.name}</span> is assigned to
                  {' '}<span className="font-bold text-base-content">{deleteBlockedBy.length}</span>
                  {' '}{deleteBlockedBy.length === 1 ? 'hobby' : 'hobbies'}:
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {deleteBlockedBy.map((name) => (
                    <span key={name} className="badge badge-outline badge-md font-semibold">{name}</span>
                  ))}
                </div>

                <p className="text-xs text-base-content/40 mb-2">Reassign or delete those hobbies first, then try again.</p>

                <div className="modal-action mt-2">
                  <button
                    className="btn btn-sm btn-neutral"
                    onClick={() => { setConfirmDeleteId(null); setDeleteBlockedBy(null); }}
                  >
                    Understood
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-2">Delete Category</h3>
                <p className="text-base-content/70">
                  Delete <span className="font-semibold text-base-content">"{confirmingCat?.name}"</span>? This cannot be undone.
                </p>
                <div className="modal-action">
                  <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(null)} disabled={deleting}>Cancel</button>
                  <button className="btn btn-error" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <span className="loading loading-spinner loading-sm" /> : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => { if (!deleting) { setConfirmDeleteId(null); setDeleteBlockedBy(null); } }} />
        </div>
      )}
    </div>
  );
}
