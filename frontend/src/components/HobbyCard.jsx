import {Link} from "react-router-dom";

function HobbyCard({hobby}){
    const maxDescriptionLength =120;
    const description =
        typeof hobby?.description === "string"
            ? hobby.description : "";

    const truncatedDescription =
        description.length > maxDescriptionLength ? `${description.slice(0, maxDescriptionLength)}...`
            : description;

    const priceRange = hobby?.min_price != null && hobby?.max_price != null ? `${hobby.min_price} - ${hobby.max_price}` : null;

    const hasImage =
        hobby?.imageUrl &&
        hobby.imageUrl !== "/images/null" &&
        !hobby.imageUrl.endsWith("/images/null");

    return (
        <Link to={`/hobbies/${hobby.id}`}>
            <div className="card w-64 bg-base-100 shadow-md">
                <figure className="h-40 bg-base-200 shrink-0">
                    {hasImage ? (
                        <img src={hobby.imageUrl}
                             alt={hobby.name}
                             className="h-40 w-full object-cover"
                        />
                    ) : (
                        <img src="https://placehold.co/256x160?text=No+Image"
                             alt="No image"
                             className="h-40 w-full object-cover"
                        />
                    )}
                </figure>

                <div className="card-body p-4 gap-2 flex flex-col flex-1">
                    <h3 className="card-title text-base">{hobby.name}</h3>

                    {truncatedDescription && (
                        <p className="text-sm text-base-content/70">
                            {truncatedDescription}
                        </p>
                    )}

                    {Array.isArray(hobby?.categories) && hobby.categories.length >0 && (
                        <div className="flex flex-wrap gap-1">
                            {hobby.categories.map((cat) => (
                                <span key={cat.id ?? cat.name} className="badge badge-ghost">
                                        {cat.name ?? String(cat)}
                                 </span>
                            ))}
                        </div>
                    )}

                    {priceRange && (
                        <div className="text-sm font-medium mt-auto">{priceRange}</div>
                    )}
                </div>
            </div>
        </Link>
    );
}


export default HobbyCard;