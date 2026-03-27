import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hobbyApi, wishlistApi } from '../services/api';
import { SkeletonHobbyDetails } from '../components/Skeletons.jsx';

const DIFFICULTY_STYLES = {
  Beginner:     "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced:     "bg-red-100 text-red-700",
};

function HobbyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [hobby, setHobby]   = useState(null);
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchSaved = async () => {
    if (!isAuthenticated) { setSaved(false); return; }
    const data = await wishlistApi.getAll().catch(() => []);
    setSaved(data.some(h => h.id === Number(id)));
  };

  useEffect(() => {
    hobbyApi.getById(id)
      .then(setHobby)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { void fetchSaved(); }, [id, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { backgroundLocation: { pathname: `/hobbies/${id}` } } });
      return;
    }
    const wasSaved = saved;

    setSaved(!wasSaved);

    try {
      if (wasSaved) await wishlistApi.remove(id);
      else await wishlistApi.add(id);
    } catch {
      setSaved(wasSaved);
    } finally {
      void fetchSaved();
    }
  };

  if (loading) return <SkeletonHobbyDetails />;

  if (error) return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-[60vh]" data-theme="retro">
      <div className="alert alert-error max-w-md"><span>{error}</span></div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Go back</button>
    </div>
  );

  const hasImage = hobby?.imageUrl && !hobby.imageUrl.endsWith("/images/null");
  const difficultyStyle = DIFFICULTY_STYLES[hobby.difficulty] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-base-100" data-theme="retro">

      <div className="relative w-full h-72 md:h-96 bg-base-200 overflow-hidden">
        <img
          src={hasImage ? hobby.imageUrl : "https://placehold.co/1200x400?text=No+Image"}
          alt={hobby.name}
          className={`w-full h-full object-cover ${!hasImage ? "opacity-40" : ""}`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/30 to-transparent" />
        <button type="button" className="btn btn-ghost btn-sm absolute top-4 left-4 bg-base-100/80 backdrop-blur-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 pb-16">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-5">

            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-4xl font-black">{hobby.name}</h1>
              <button
                type="button"
                onClick={handleSave}
                className={`btn btn-circle btn-lg shadow transition-all ${saved ? "btn-error text-white" : "btn-ghost border border-base-300"}`}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                {saved ? "❤️" : "🤍"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {hobby.categories?.map(cat => (
                <Link key={cat.name} to={`/hobbies?category=${cat.name.toLowerCase()}`} className="badge badge-outline hover:badge-primary transition-colors cursor-pointer">
                  {cat.name}
                </Link>
              ))}
              {hobby.difficulty && (
                <span className={`badge font-medium ${difficultyStyle}`}>{hobby.difficulty}</span>
              )}
            </div>

            {hobby.minPrice != null && hobby.maxPrice != null && (
              <div className="flex items-center gap-2">
                <span className="text-base-content/50 text-sm">Estimated cost</span>
                <span className="text-2xl font-bold text-primary">${hobby.minPrice} – ${hobby.maxPrice}</span>
              </div>
            )}

            <div className="divider my-0" />

            <p className={hobby.description ? "text-base-content/80 leading-relaxed" : "text-base-content/40 italic"}>
              {hobby.description ?? "No description available."}
            </p>

            <div className="divider my-0" />

            <div className="flex flex-wrap gap-3 justify-between items-center">
              <Link to="/hobbies" className="btn btn-ghost btn-sm">← Browse more hobbies</Link>
              <button type="button" className={`btn btn-wide ${saved ? "btn-outline btn-error" : "btn-primary"}`} onClick={handleSave}>
                {saved ? "Remove from Wishlist" : isAuthenticated ? "Save to Wishlist ❤️" : "Login to Save ❤️"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HobbyDetails;