import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { hobbyApi, categoryApi, wishlistApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import HobbyCard from "../components/HobbyCard.jsx";

const MAX_PRICE = 90_000_000;

const PRICE_RANGES = [
  { value: "all",     label: "All Prices", min: 0,   max: MAX_PRICE },
  { value: "0-25",    label: "$0 - $25",   min: 0,   max: 25 },
  { value: "25-50",   label: "$25 - $50",  min: 25,  max: 50 },
  { value: "50-100",  label: "$50 - $100", min: 50,  max: 100 },
  { value: "100-250", label: "$100 - $250",min: 100, max: 250 },
  { value: "250-500", label: "$250 - $500",min: 250, max: 500 },
  { value: "500+",    label: "$500+",      min: 500, max: MAX_PRICE },
];

function Hobbies() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [hobbies, setHobbies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [priceFilterMin, setPriceFilterMin] = useState(0);
  const [priceFilterMax, setPriceFilterMax] = useState(MAX_PRICE);
  const [sortBy, setSortBy] = useState("none");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load hobbies, categories, and wishlist
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hobbiesData, categoriesData] = await Promise.all([
          hobbyApi.getAll(),
          categoryApi.getAll(),
        ]);
        setHobbies(Array.isArray(hobbiesData) ? hobbiesData : Object.values(hobbiesData));
        setCategories(Array.isArray(categoriesData) ? categoriesData : Object.values(categoriesData));
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setWishlist([]); return; }
    wishlistApi.getAll()
      .then(data => setWishlist(data.map(item => item.id)))
      .catch(() => setWishlist([]));
  }, [isAuthenticated]);

  // Apply category from URL query param
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) setCategoryFilter(categoryParam.toLowerCase());
  }, [searchParams]);

  // Filter + sort
  useEffect(() => {
    let filtered = [...hobbies];

    if (categoryFilter !== "all") {
      filtered = filtered.filter(hobby =>
        hobby.categories?.some(cat => cat.name.toLowerCase() === categoryFilter)
      );
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(hobby =>
        hobby.name?.toLowerCase().includes(query) ||
        hobby.description?.toLowerCase().includes(query)
      );
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter(hobby =>
        hobby.difficulty?.toLowerCase() === difficultyFilter
      );
    }

    filtered = filtered.filter(hobby =>
      hobby.min_price >= priceFilterMin && hobby.max_price <= priceFilterMax
    );

    switch (sortBy) {
      case "nameasc":   filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "namedesc":  filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "cheap":     filtered.sort((a, b) => a.min_price - b.min_price); break;
      case "expensive": filtered.sort((a, b) => b.max_price - a.max_price); break;
      default: break;
    }

    setFilteredHobbies(filtered);
  }, [hobbies, categoryFilter, searchQuery, difficultyFilter, priceFilterMin, priceFilterMax, sortBy]);

  const handlePriceRangeChange = (value) => {
    const selected = PRICE_RANGES.find(r => r.value === value) ?? PRICE_RANGES[0];
    setPriceRange(selected.value);
    setPriceFilterMin(selected.min);
    setPriceFilterMax(selected.max);
  };

  const handleToggleSave = useCallback(async (hobbyId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { backgroundLocation: { pathname: "/hobbies" } } });
      return;
    }
    const currentlySaved = wishlist.includes(Number(hobbyId));
    setWishlist(prev =>
      currentlySaved ? prev.filter(id => id !== Number(hobbyId)) : [...prev, Number(hobbyId)]
    );
    try {
      if (currentlySaved) await wishlistApi.remove(hobbyId);
      else await wishlistApi.add(hobbyId);
    } catch {
      setWishlist(prev =>
        currentlySaved ? [...prev, Number(hobbyId)] : prev.filter(id => id !== Number(hobbyId))
      );
    }
  }, [isAuthenticated, wishlist, navigate]);

  const isSaved = (hobbyId) => wishlist.includes(Number(hobbyId));

  const savedHobbies = filteredHobbies.filter(h => isSaved(h.id));
  const unsavedHobbies = filteredHobbies.filter(h => !isSaved(h.id));

  const HobbyGrid = ({ items, emptyMessage }) =>
    items.length === 0 ? (
      <p className="text-center py-10 text-base-content/40 italic">{emptyMessage}</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(hobby => (
          <HobbyCard
            key={hobby.id}
            hobby={hobby}
            saved={isSaved(hobby.id)}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>
    );

  return (
    <div className="px-4 py-6" data-theme="retro">
      <div className="mx-auto w-full max-w-6xl">

        {/* Header & Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Explore Hobbies</h1>
          <p className="text-base-content/70">Find your perfect hobby from our curated collection</p>

          <div className="mt-5">
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Search hobbies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm ${categoryFilter === "all" ? "btn-neutral" : "btn-outline"}`}
              onClick={() => setCategoryFilter("all")}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id ?? category.name}
                type="button"
                className={`btn btn-sm ${categoryFilter === category.name.toLowerCase() ? "btn-neutral" : "btn-outline"}`}
                onClick={() => setCategoryFilter(category.name.toLowerCase())}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowAdvancedFilters(prev => !prev)}
            >
              {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="label"><span className="label-text">Difficulty Level</span></label>
                <select className="select select-bordered w-full bg-base-200" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text">Price Range</span></label>
                <select className="select select-bordered w-full bg-base-200" value={priceRange} onChange={(e) => handlePriceRangeChange(e.target.value)}>
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text">Sort By</span></label>
                <select className="select select-bordered w-full bg-base-200" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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

        {/* Loading / Error */}
        {loading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}
        {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

        {/* Results */}
        {!loading && !error && (
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
                <h2 className="text-2xl font-bold">
                  {savedHobbies.length > 0 ? "🔍 Discover More" : "🔍 All Hobbies"}
                </h2>
                <span className="badge badge-neutral">{unsavedHobbies.length}</span>
              </div>
              <HobbyGrid
                items={unsavedHobbies}
                emptyMessage={
                  filteredHobbies.length === 0
                    ? "No hobbies match your filters."
                    : "You've wishlisted all matching hobbies! 🎉"
                }
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Hobbies;
