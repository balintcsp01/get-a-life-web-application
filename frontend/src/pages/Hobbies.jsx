import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { hobbyApi, categoryApi, wishlistApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import HobbyCard from "../components/HobbyCard.jsx";
import SuggestHobbyModal from "../components/SuggestHobbyModal.jsx";
import { SkeletonHobbyGrid, SkeletonFilterBar } from "../components/Skeletons.jsx";

const MAX_PRICE = 90_000_000;

const PRICE_RANGES = [
  { value: "all",     label: "All Prices", min: 0,   max: MAX_PRICE },
  { value: "0-25",    label: "$0–$25",     min: 0,   max: 25 },
  { value: "25-50",   label: "$25–$50",    min: 25,  max: 50 },
  { value: "50-100",  label: "$50–$100",   min: 50,  max: 100 },
  { value: "100-250", label: "$100–$250",  min: 100, max: 250 },
  { value: "250-500", label: "$250–$500",  min: 250, max: 500 },
  { value: "500+",    label: "$500+",      min: 500, max: MAX_PRICE },
];

function Hobbies() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [hobbies, setHobbies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get("category")?.toLowerCase() ?? "all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [sortBy, setSortBy] = useState("none");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([hobbyApi.getAll(), categoryApi.getAll()])
      .then(([h, c]) => {
        setHobbies(Array.isArray(h) ? h : Object.values(h));
        setCategories(Array.isArray(c) ? c : Object.values(c));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fetchWishlist = async () => {
    if (!isAuthenticated) { setWishlist(new Set()); return; }
    const data = await wishlistApi.getAll().catch(() => []);
    setWishlist(new Set(data.map(h => Number(h.id))));
  };

  useEffect(() => { void fetchWishlist(); }, [isAuthenticated]);

  useEffect(() => {
    const param = searchParams.get("category");
    if (param) setCategoryFilter(param.toLowerCase());
  }, [searchParams]);

  const handlePriceChange = (value) => {
    const range = PRICE_RANGES.find(r => r.value === value) ?? PRICE_RANGES[0];
    setPriceRange(range.value);
    setPriceMin(range.min);
    setPriceMax(range.max);
  };

  const handleToggleSave = async (hobbyId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { backgroundLocation: { pathname: "/hobbies" } } });
      return;
    }
    const id = Number(hobbyId);
    const wasSaved = wishlist.has(id);

    setWishlist(prev => {
      const next = new Set(prev);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      if (wasSaved) await wishlistApi.remove(id);
      else await wishlistApi.add(id);
    } catch {
      setWishlist(prev => {
        const next = new Set(prev);
        wasSaved ? next.add(id) : next.delete(id);
        return next;
      });
    } finally {
      void fetchWishlist();
    }
  };

  const addToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = useMemo(() => {
    const result = hobbies.filter(h => {
      if (categoryFilter !== "all" && !h.categories?.some(c => c.name.toLowerCase() === categoryFilter)) return false;
      if (difficultyFilter !== "all" && h.difficulty?.toLowerCase() !== difficultyFilter) return false;
      if (h.minPrice < priceMin || h.maxPrice > priceMax) return false;
      const q = searchQuery.trim().toLowerCase();
      return !(q && !h.name?.toLowerCase().includes(q) && !h.description?.toLowerCase().includes(q));

    });
    switch (sortBy) {
      case "nameasc":   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "namedesc":  result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "cheap":     result.sort((a, b) => a.minPrice - b.minPrice); break;
      case "expensive": result.sort((a, b) => b.maxPrice - a.maxPrice); break;
    }
    return result;
  }, [hobbies, categoryFilter, difficultyFilter, priceMin, priceMax, searchQuery, sortBy]);

  const isSaved = (id) => wishlist.has(Number(id));
  const savedHobbies   = filtered.filter(h => isSaved(h.id));
  const unsavedHobbies = filtered.filter(h => !isSaved(h.id));

  const HobbyGrid = ({ items, emptyMessage }) =>
    items.length === 0 ? (
      <p className="text-center py-10 text-base-content/40 italic">{emptyMessage}</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(h => (
          <HobbyCard key={h.id} hobby={h} saved={isSaved(h.id)} onToggleSave={handleToggleSave} />
        ))}
      </div>
    );

  return (
    <div className="px-4 py-6" data-theme="retro">
      <div className="mx-auto w-full max-w-6xl">

        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-semibold">Explore Hobbies</h1>
              <p className="text-base-content/70">Find your perfect hobby from our curated collection</p>
            </div>
            {isAuthenticated && (
              <button type="button" className="btn btn-outline btn-primary gap-2" onClick={() => setShowSuggestModal(true)}>
                💡 Suggest a Hobby
              </button>
            )}
          </div>

          <div className="mt-5">
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" className="grow" placeholder="Search hobbies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={`btn btn-sm ${categoryFilter === "all" ? "btn-neutral" : "btn-outline"}`} onClick={() => setCategoryFilter("all")}>All</button>
            {categories.map(cat => (
              <button key={cat.id} type="button" className={`btn btn-sm ${categoryFilter === cat.name.toLowerCase() ? "btn-neutral" : "btn-outline"}`} onClick={() => setCategoryFilter(cat.name.toLowerCase())}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowFilters(p => !p)}>
              {showFilters ? "Hide Filters" : "More Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select className="select select-bordered w-full bg-base-200" value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}>
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text">Price Range</span></label>
                <select className="select select-bordered w-full bg-base-200" value={priceRange} onChange={e => handlePriceChange(e.target.value)}>
                  {PRICE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text">Sort By</span></label>
                <select className="select select-bordered w-full bg-base-200" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="none">Default</option>
                  <option value="nameasc">Name A–Z</option>
                  <option value="namedesc">Name Z–A</option>
                  <option value="cheap">Price: Low to High</option>
                  <option value="expensive">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

        {loading ? (
          <>
            <SkeletonFilterBar />
            <div className="mt-8">
              <div className="skeleton h-7 w-48 rounded mb-4" />
              <SkeletonHobbyGrid count={8} />
            </div>
          </>
        ) : !error && (
          <>
            {savedHobbies.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold">❤️ My Wishlist</h2>
                  <span className="badge badge-neutral">{savedHobbies.length}</span>
                </div>
                <HobbyGrid items={savedHobbies} emptyMessage="" />
                <div className="divider mt-8" />
              </section>
            )}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold">{savedHobbies.length > 0 ? "🔍 Discover More" : "🔍 All Hobbies"}</h2>
                <span className="badge badge-neutral">{unsavedHobbies.length}</span>
              </div>
              <HobbyGrid
                items={unsavedHobbies}
                emptyMessage={filtered.length === 0 ? "No hobbies match your filters." : "You've wishlisted all matching hobbies! 🎉"}
              />
            </section>
          </>
        )}
      </div>

      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"} shadow-lg cursor-pointer`} onClick={() => setToast(null)}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <SuggestHobbyModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        onSuccess={msg => addToast(msg)}
        onError={msg => addToast(msg, "error")}
        categories={categories}
      />
    </div>
  );
}

export default Hobbies;