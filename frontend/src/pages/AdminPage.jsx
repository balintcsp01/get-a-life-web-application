import { useState, useEffect, useRef, useCallback } from 'react';
import { categoryApi, suggestionApi } from '../services/api.js';
import HobbySection from '../components/HobbySection.jsx';
import HobbyModal from '../components/HobbyModal.jsx';
import CategorySection from '../components/CategorySection.jsx';
import SuggestionSection from '../components/SuggestionSection.jsx';

const TABS = [
  { key: 'hobbies',     label: '🎯 Hobbies' },
  { key: 'categories',  label: '🗂 Categories' },
  { key: 'suggestions', label: '💡 Suggestions' },
];

let toastId = 0;

function Toast({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast toast-top toast-end z-50 gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`alert shadow-lg max-w-sm cursor-pointer ${t.type === 'error' ? 'alert-error' : 'alert-success'}`}
          onClick={() => onDismiss(t.id)}
        >
          <span>{t.type === 'error' ? '✕' : '✓'}</span>
          <span className="text-sm">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('hobbies');
  const [categories, setCategories] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditingId, setModalEditingId] = useState(null);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [modalSuggestionId, setModalSuggestionId] = useState(null);

  const reloadHobbiesRef = useRef(null);

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(() => addToast('Failed to load categories.', 'error'));
  }, []);

  const addToast = useCallback((message, type = 'error') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openModal = ({ editingId = null, initialData = null, suggestionId = null } = {}) => {
    setModalEditingId(editingId);
    setModalInitialData(initialData);
    setModalSuggestionId(suggestionId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalEditingId(null);
    setModalInitialData(null);
    setModalSuggestionId(null);
  };

  const handleSaved = async () => {
    if (modalSuggestionId) {
      try {
        await suggestionApi.delete(modalSuggestionId);
      } catch {
        addToast('Hobby created but failed to remove the suggestion.', 'error');
      }
    }
    addToast(modalEditingId ? 'Hobby updated!' : 'Hobby created!', 'success');
    reloadHobbiesRef.current?.();
  };

  return (
    <div className="min-h-screen bg-base-100" data-theme="retro">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black uppercase italic tracking-widest">
            Admin <span className="text-primary">Panel</span>
          </h1>
          <p className="text-base-content/50 mt-2">Manage hobbies, categories, and community suggestions</p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center mb-8 bg-base-200 p-1 rounded-xl">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`tab tab-lg font-semibold transition-all ${tab === key ? 'tab-active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {tab === 'hobbies' && (
            <HobbySection
              categories={categories}
              onOpenModal={openModal}
              reloadRef={reloadHobbiesRef}
              onError={(msg) => addToast(msg, 'error')}
            />
          )}
          {tab === 'categories' && (
            <CategorySection
              onError={(msg) => addToast(msg, 'error')}
              onSuccess={(msg) => addToast(msg, 'success')}
            />
          )}
          {tab === 'suggestions' && (
            <SuggestionSection
              categories={categories}
              onError={(msg) => addToast(msg, 'error')}
              onOpenModal={(opts) => {
                setTab('hobbies');
                openModal(opts);
              }}
            />
          )}
        </div>
      </div>

      <HobbyModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSaved={handleSaved}
        onError={(msg) => addToast(msg, 'error')}
        categories={categories}
        onCategoryCreated={() => categoryApi.getAll().then(setCategories).catch(() => {})}
        editingId={modalEditingId}
        initialData={modalInitialData}
      />
    </div>
  );
}
