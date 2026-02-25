import {Link} from "react-router-dom";

function HobbyCard({hobby}){
    const maxDescriptionLength = 120;
    const description =
        typeof hobby?.description === "string"
            ? hobby.description : "";

    const truncatedDescription =
        description.length > maxDescriptionLength ? `${description.slice(0, maxDescriptionLength)}...`
            : description;

    const priceRange = hobby?.min_price != null && hobby?.max_price != null
        ? `$${hobby.min_price} - $${hobby.max_price}`
        : null;

    const hasImage =
        hobby?.imageUrl &&
        hobby.imageUrl !== "/images/null" &&
        !hobby.imageUrl.endsWith("/images/null");

    const categoryLabel = Array.isArray(hobby?.categories) && hobby.categories.length > 0
        ? hobby.categories[0]?.name ?? String(hobby.categories[0])
        : "Category";

    const difficultyLabel = typeof hobby?.difficulty === "string" && hobby.difficulty.trim()
        ? hobby.difficulty
        : "Beginner";

    return (
        <Link to={`/hobbies/${hobby.id}`} className="group">
            <div className="card w-full overflow-hidden rounded-2xl bg-base-100 shadow-md transition hover:shadow-lg">
                <div className="relative">
                    <figure className="h-44 bg-base-200">
                        {hasImage ? (
                            <img src={hobby.imageUrl}
                                 alt={hobby.name}
                                 className="h-44 w-full object-cover"
                            />
                        ) : (
                            <img src="https://placehold.co/288x176?text=No+Image"
                                 alt="No image"
                                 className="h-44 w-full object-cover"
                            />
                        )}
                    </figure>
                    <span className="absolute left-3 top-3 rounded-full bg-base-100 px-3 py-1 text-xs font-semibold shadow">
                        {categoryLabel}
                    </span>
                    <button
                        type="button"
                        className="btn btn-circle btn-xs absolute right-3 top-3 bg-base-100 text-base-content shadow"
                        title="Favourites coming soon"
                        onClick={(event) => event.preventDefault()}
                        aria-label="Add to favourites"
                    >
                        ❤
                    </button>
                </div>

                <div className="card-body gap-3 p-5">
                    <h3 className="text-lg font-semibold">{hobby.name}</h3>

                    {truncatedDescription && (
                        <p className="text-sm text-base-content/70">
                            {truncatedDescription}
                        </p>
                    )}

                    <div className="mt-1 flex items-center justify-between">
                        <span className="badge badge-success badge-sm font-medium">
                            {difficultyLabel}
                        </span>
                        {priceRange && (
                            <span className="text-sm font-semibold text-primary">{priceRange}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}


export default HobbyCard;