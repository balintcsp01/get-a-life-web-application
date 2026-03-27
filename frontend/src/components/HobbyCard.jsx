import { Link } from "react-router-dom";

const MAX_DESC = 120;

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

function HobbyCard({ hobby, saved = false, onToggleSave }) {
  const description = hobby?.description ?? "";
  const truncated = description.length > MAX_DESC ? description.slice(0, MAX_DESC) + "..." : description;
  const hasImage = hobby?.imageUrl && !hobby.imageUrl.endsWith("/images/null");
  const category = hobby?.categories?.[0]?.name ?? "Uncategorised";
  const difficulty = hobby?.difficulty ?? "Beginner";
  const difficultyColor = DIFFICULTY_COLORS[difficulty] ?? "bg-gray-100 text-gray-700";
  const priceRange = hobby?.minPrice != null && hobby?.maxPrice != null
    ? `$${hobby.minPrice} – $${hobby.maxPrice}`
    : null;

  return (
    <Link to={`/hobbies/${hobby.id}`} className="group">
      <div className="card w-full overflow-hidden rounded-2xl bg-base-100 shadow-md transition hover:shadow-lg">
        <div className="relative">
          <figure className="h-44 bg-base-200">
            <img
              src={hasImage ? hobby.imageUrl : "https://placehold.co/288x176?text=No+Image"}
              alt={hobby.name}
              className="h-44 w-full object-cover"
            />
          </figure>
          <span className="absolute left-3 top-3 rounded-full bg-base-100 px-3 py-1 text-xs font-semibold shadow">
            {category}
          </span>
          <button
            type="button"
            className="btn btn-circle btn-xs absolute right-3 top-3 bg-base-100 text-base-content shadow"
            title={saved ? "Remove from wishlist" : "Save to wishlist"}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={e => { e.preventDefault(); onToggleSave?.(hobby.id); }}
          >
            {saved ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="card-body gap-3 p-5">
          <h3 className="text-lg font-semibold">{hobby.name}</h3>
          {truncated && <p className="text-sm text-base-content/70">{truncated}</p>}
          <div className="mt-1 flex items-center justify-between">
            <span className={`badge badge-sm font-medium ${difficultyColor}`}>{difficulty}</span>
            {priceRange && <span className="text-sm font-semibold text-primary">{priceRange}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HobbyCard;