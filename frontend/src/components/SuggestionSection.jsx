import { useState, useEffect } from 'react';
import { suggestionApi } from '../services/api.js';
import { SkeletonSuggestionCards } from './Skeletons.jsx';

export default function SuggestionSection({ onOpenModal, onError, categories = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => { void load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await suggestionApi.getAll().catch(() => []);
      setSuggestions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (suggestion) => {
    const categoryIds = (suggestion.categories ?? [])
      .map((name) => categories.find((c) => c.name.toLowerCase() === name.toLowerCase())?.id)
      .filter(Boolean);

    const existingNames = categories.map((c) => c.name.toLowerCase());
    const customCategoryNames = (suggestion.categories ?? [])
      .filter((name) => !existingNames.includes(name.toLowerCase()));

    onOpenModal({
      initialData: {
        name: suggestion.name ?? '',
        description: suggestion.description ?? '',
        categoryIds,
        customCategoryNames,
        difficulty: suggestion.difficulty ?? 'Beginner',
        minPrice: suggestion.minPrice ?? 0,
        maxPrice: suggestion.maxPrice ?? 0,
      },
      suggestionId: suggestion.id,
    });
  };

  const handleReject = async () => {
    if (!confirmRejectId) return;
    setRejecting(true);
    try {
      await suggestionApi.delete(confirmRejectId);
      setConfirmRejectId(null);
      load();
    } catch {
      onError?.('Failed to reject suggestion.');
    } finally {
      setRejecting(false);
    }
  };

  const confirmingSuggestion = suggestions.find((s) => s.id === confirmRejectId);

  if (loading) return <SkeletonSuggestionCards count={3} />;

  return (
    <div>
      {suggestions.length === 0 ? (
        <div className="card bg-base-200 p-12 text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-lg font-semibold">No pending suggestions</p>
          <p className="text-base-content/50 text-sm mt-1">All caught up!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {suggestions.map((s) => (
            <div key={s.id} className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body py-4 px-6 flex-row items-center justify-between">
                <div>
                  <p className="font-bold text-lg">{s.name}</p>
                  {s.description && (
                    <p className="text-sm text-base-content/60 mt-1 max-w-lg line-clamp-2">{s.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {s.difficulty && <span className="badge badge-sm badge-outline">{s.difficulty}</span>}
                    {(s.minPrice != null || s.maxPrice != null) && (
                      <span className="badge badge-sm badge-outline">${s.minPrice ?? 0} – ${s.maxPrice ?? 0}</span>
                    )}
                    {s.categories?.map((cat) => (
                      <span key={cat} className="badge badge-sm badge-primary badge-outline">{cat}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button className="btn btn-sm btn-primary" onClick={() => handleReview(s)}>
                    Review
                  </button>
                  <button className="btn btn-sm btn-error btn-outline" onClick={() => setConfirmRejectId(s.id)}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmRejectId && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-2">Reject Suggestion</h3>
            <p className="text-base-content/70">
              Reject and delete <span className="font-semibold text-base-content">"{confirmingSuggestion?.name}"</span>? This cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setConfirmRejectId(null)} disabled={rejecting}>Cancel</button>
              <button className="btn btn-error" onClick={handleReject} disabled={rejecting}>
                {rejecting ? <span className="loading loading-spinner loading-sm" /> : 'Reject'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => !rejecting && setConfirmRejectId(null)} />
        </div>
      )}
    </div>
  );
}
