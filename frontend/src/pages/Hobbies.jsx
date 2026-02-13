import {useState, useEffect} from "react";
import HobbyCard from "../components/HobbyCard.jsx";
function Hobbies(){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hobbies, setHobbies] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilterMin, setPriceFilterMin] = useState(0);
    const [priceFilterMax, setPriceFilterMax] = useState(90000000);
    const [sortBy, setSortBy] = useState("none");
    const [categories, setCategories] = useState([]);
    const [filteredHobbies, setFilteredHobbies] = useState([]);

    useEffect(() => {
        const fetchHobbies = async () => {
            setLoading(true);
            try{
                const response = await fetch("/api/hobbies");
                const data = await response.json();
                const loaded = data ? Object.keys(data).map((id) => ({id, ...data[id]})) : [];
                setHobbies(loaded);
            } catch (e){
                setError(e.message);
            }
            /*setHobbies([
                    { id: 1, name: "Futás", category: "sport", min_price: 0, max_price: 10, description: "Kardió edzés a szabadban." },
                    { id: 2, name: "Úszás", category: "sport", min_price: 15, max_price: 20,description: "Medencében vagy nyílt vízben való úszás." },
                    { id: 3, name: "Festés", category: "kreativ", min_price: 25, max_price: 35,description: "Akril vagy olajfestés vászonra." },
                    { id: 4, name: "Fotózás", category: "kreativ", min_price: 50, max_price: 100,description: "Képek készítése és szerkesztése." },
                    { id: 5, name: "Programozás", category: "tech", min_price: 0, max_price: 50,description: "Kódolás különböző nyelveken." },
                    { id: 6, name: "Robotika", category: "tech", min_price: 100, max_price: 200,description: "Robotok építése és programozása." },
                    { id: 7, name: "Jóga", category: "wellness", min_price: 20, max_price: 50,description: "Test és lélek harmóniája." },
                    { id: 8, name: "Tánc", category: "sport", min_price: 30, max_price: 50,description: "Különböző táncstílusok gyakorlása." },
                    { id: 9, name: "Kertészkedés", category: "kreativ", min_price: 10, max_price: 20,description: "Növények nevelése és gondozása." },
                    { id: 10, name: "Blogírás", category: "tech", min_price: 0, max_price: 30,description: "Írás és tartalomkészítés az interneten." }
                ]);*/
            setLoading(false);
            setFilteredHobbies(hobbies);
            console.log(filteredHobbies);

        }
        fetchHobbies();
    }, [])

    useEffect(() => {
        let filtered = [...hobbies];

        if (categoryFilter !== "all") {
            filtered = filtered.filter(hobby => hobby.category.toLowerCase() === categoryFilter);
        }

        filtered = filtered.filter(hobby => hobby.min_price >= priceFilterMin && hobby.max_price <= priceFilterMax);

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

    }, [hobbies, categoryFilter, priceFilterMin, priceFilterMax, sortBy]);

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
            /*setCategories([{name:"sport"}, {name:"kreativ"}, {name:"tech"}, {name:"wellness"}]);*/
        }
        fetchCategories();
    }, [])

    return(
        <div className="p-4" data-theme="retro">
            {loading && <h1>Loading...</h1>}
            {error && <h2>error</h2>}
            <div className={"flex flex-wrap gap-2 mb-4"}>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option key={"all"} value="all">All</option>
                    {categories.map(category => <option key={category.name} value={category.name.toLowerCase()}>{category.name}</option>)}
                </select>
                <input
                    type="number"
                    placeholder="Minimum price"

                    onChange={(e) => setPriceFilterMin(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Maximum price"

                    onChange={(e) => setPriceFilterMax(e.target.value)}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="none">Sort by</option>
                    <option value="nameasc">Name A-Z</option>
                    <option value="namedesc">Name Z-A</option>
                    <option value="cheap">Price low to high</option>
                    <option value="expensive">Price high to low</option>
                </select>
            </div>
            <div className="flex flex-wrap gap-4">
                {filteredHobbies && filteredHobbies.map(hobby => <HobbyCard key={hobby.id} hobby={hobby}/>)}
            </div>
        </div>
    );

}

export default Hobbies;