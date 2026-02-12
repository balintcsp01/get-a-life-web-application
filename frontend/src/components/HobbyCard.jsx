import {Link} from "react-router-dom";

function HobbyCard({hobby}){
    return(
        <div>
            <Link to={`/hobbies/${hobby.id}`}><h3>{hobby.name}</h3></Link>
        </div>
    )

}
export default HobbyCard;