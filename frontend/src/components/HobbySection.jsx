import { useState, useEffect } from 'react';
import { hobbyApi } from '../services/api.js';
import { SkeletonHobbyTableRows } from './Skeletons.jsx';

export default function HobbySection({onOpenModal, reloadRef, onError }) {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void load();
    if (reloadRef) reloadRef.current = load;
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hobbyApi.getAll();
      setHobbies(Array.isArray(data) ? data : Object.values(data));
    } catch (err) {
      onError?.('Failed to load hobbies.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await hobbyApi.delete(confirmDeleteId);
      setConfirmDeleteId(null);
      await load();
    } catch {
      onError?.('Failed to delete hobby.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (hobby) => {
    onOpenModal({
      editingId: hobby.id,
      initialData: {
        name: hobby.name,
        description: hobby.description,
        categoryIds: hobby.categories?.map((c) => c.id) ?? [],
        difficulty: hobby.difficulty ?? 'Beginner',
        minPrice: hobby.minPrice ?? 0,
        maxPrice: hobby.maxPrice ?? 0,
      },
    });
  };

  const confirmingHobby = hobbies.find((h) => h.id === confirmDeleteId);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => onOpenModal({})}>
          + New Hobby
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-box border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-300">
            <tr>
              <th>Name</th>
              <th>Categories</th>
              <th>Difficulty</th>
              <th>Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonHobbyTableRows count={6} />
            ) : hobbies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-base-content/40">No hobbies yet.</td>
              </tr>
            ) : hobbies.map((h) => (
              <tr key={h.id} className="hover">
                <td className="font-semibold">{h.name}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {h.categories?.map((cat) => (
                      <span key={cat.id} className="badge badge-outline badge-sm">{cat.name}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge badge-sm ${
                    h.difficulty === 'Advanced' ? 'badge-error' :
                    h.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-success'
                  }`}>{h.difficulty}</span>
                </td>
                <td className="text-sm">${h.minPrice} – ${h.maxPrice}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-sm btn-ghost btn-circle" onClick={() => handleEdit(h)}>✎</button>
                    <button
                      className="btn btn-sm btn-circle btn-error btn-outline"
                      onClick={() => setConfirmDeleteId(h.id)}
                    >✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDeleteId && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-2">Delete Hobby</h3>
            <p className="text-base-content/70">
              Are you sure you want to delete <span className="font-semibold text-base-content">"{confirmingHobby?.name}"</span>? This cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(null)} disabled={deleting}>Cancel</button>
              <button className="btn btn-error" onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className="loading loading-spinner loading-sm" /> : 'Delete'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => !deleting && setConfirmDeleteId(null)} />
        </div>
      )}
    </div>
  );
}
