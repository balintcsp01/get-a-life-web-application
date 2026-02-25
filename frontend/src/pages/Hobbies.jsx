import {useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import HobbyCard from "../components/HobbyCard.jsx";

const PRICE_RANGES = [
    { value: "all", label: "All Prices", min: 0, max: 90000000 },
    { value: "0-25", label: "$0 - $25", min: 0, max: 25 },
    { value: "25-50", label: "$25 - $50", min: 25, max: 50 },
    { value: "50-100", label: "$50 - $100", min: 50, max: 100 },
    { value: "100-250", label: "$100 - $250", min: 100, max: 250 },
    { value: "250-500", label: "$250 - $500", min: 250, max: 500 },
    { value: "500+", label: "$500+", min: 500, max: 90000000 },
];

function Hobbies(){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hobbies, setHobbies] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilterMin, setPriceFilterMin] = useState(0);
    const [priceFilterMax, setPriceFilterMax] = useState(90000000);
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [sortBy, setSortBy] = useState("none");
    const [categories, setCategories] = useState([]);
    const [filteredHobbies, setFilteredHobbies] = useState([]);
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
    const [priceRange, setPriceRange] = useState("all");

    useEffect(() => {
        const fetchHobbies = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/hobbies");
                const data = await response.json();
                const loaded = data ? Object.keys(data).map((id) => ({id, ...data[id]})) : [];

                setHobbies(loaded);
                setError(null);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchHobbies();
    }, [])

    useEffect(() => {
        let filtered = [...hobbies];

        if (categoryFilter !== "all") {
            filtered = filtered.filter(hobby =>
                    hobby.categories && hobby.categories.some(cat =>
                        cat.name.toLowerCase() === categoryFilter
                    )
            );
        }

        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (normalizedQuery) {
            filtered = filtered.filter((hobby) => {
                const name = hobby?.name?.toLowerCase() || "";
                const description = hobby?.description?.toLowerCase() || "";
                return name.includes(normalizedQuery) || description.includes(normalizedQuery);
            });
        }

        if (difficultyFilter !== "all") {
            filtered = filtered.filter((hobby) =>
                typeof hobby?.difficulty === "string" &&
                hobby.difficulty.toLowerCase() === difficultyFilter
            );
        }

        filtered = filtered.filter(hobby => {
            const minPrice = Number(priceFilterMin) || 0;
            const maxPrice = Number(priceFilterMax) || 90000000;
            return hobby.min_price >= minPrice && hobby.max_price <= maxPrice;
        });

        switch(sortBy){
            case "nameasc":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "namedesc":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "cheap":
                filtered.sort((a, b) => a.min_price - b.min_price);
                break;
            case "expensive":
                filtered.sort((a, b) => b.max_price - a.max_price);
                break;
            default: break;
        }

        setFilteredHobbies(filtered);

    }, [hobbies, categoryFilter, priceFilterMin, priceFilterMax, sortBy, searchQuery, difficultyFilter]);

    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            setCategoryFilter(categoryParam.toLowerCase());
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchCategories = async() => {
            try{
                const response = await fetch("/api/categories");
                const data = await response.json();
                const loaded = data ? Object.keys(data).map((id) => ({id, ...data[id]})) : [];
                setCategories(loaded);
            } catch (e){
                setError(e.message);
            }
        }
        fetchCategories();
    }, [])

    const handlePriceRangeChange = (value) => {
        const selected = PRICE_RANGES.find((range) => range.value === value) || PRICE_RANGES[0];
        setPriceRange(selected.value);
        setPriceFilterMin(selected.min);
        setPriceFilterMax(selected.max);
    };

    return(
        <div className="px-4 py-6" data-theme="retro">
            <div className="mx-auto w-full max-w-6xl px-0">
                {loading && <h1>Loading...</h1>}
                {error && <h2>{error}</h2>}

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
                                onChange={(event) => setSearchQuery(event.target.value)}
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
                        {categories.map((category) => (
                            <button
                                key={category.id ?? category.name}
                                type="button"
                                className={`btn btn-sm ${
                                    categoryFilter === category.name.toLowerCase()
                                        ? "btn-neutral"
                                        : "btn-outline"
                                }`}
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
                            onClick={() => setShowAdvancedFilters((prev) => !prev)}
                        >
                            {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
                        </button>
                    </div>

                    {showAdvancedFilters && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="label">
                                    <span className="label-text">Difficulty Level</span>
                                </label>
                                <select
                                    className="select select-bordered w-full bg-base-200"
                                    value={difficultyFilter}
                                    onChange={(event) => setDifficultyFilter(event.target.value)}
                                >
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Price Range</span>
                                </label>
                                <select
                                    className="select select-bordered w-full bg-base-200"
                                    value={priceRange}
                                    onChange={(event) => handlePriceRangeChange(event.target.value)}
                                >
                                    {PRICE_RANGES.map((range) => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredHobbies && filteredHobbies.map(hobby => <HobbyCard key={hobby.id} hobby={hobby}/>) }
                </div>
            </div>
        </div>
    );

}

export default Hobbies;