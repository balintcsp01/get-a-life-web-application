import {Link} from "react-router-dom";

function HobbyCard({hobby}){
    return(
        <Link to={`/hobbies/${hobby.id}`}>
            <div className="card w-64 bg-base-100 shadow-md">
                <h3 className="card-title">{hobby.name}</h3>
            </div>
        </Link>
    )

}
export default HobbyCard;