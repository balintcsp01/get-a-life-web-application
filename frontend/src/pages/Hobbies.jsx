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
            /*try{
                const response = await fetch("/api/hobbies");
                const data = await response.json();
                const loaded = data ? Object.keys(data).map((id) => ({id, ...data[id]})) : [];
                setHobbies(loaded);
            } catch (e){
                setError(e.message);
            }*/
            setHobbies([
                    { id: 1, name: "Futás", category: "sport", price: 0, description: "Kardió edzés a szabadban." },
                    { id: 2, name: "Úszás", category: "sport", price: 15, description: "Medencében vagy nyílt vízben való úszás." },
                    { id: 3, name: "Festés", category: "kreativ", price: 25, description: "Akril vagy olajfestés vászonra." },
                    { id: 4, name: "Fotózás", category: "kreativ", price: 50, description: "Képek készítése és szerkesztése." },
                    { id: 5, name: "Programozás", category: "tech", price: 0, description: "Kódolás különböző nyelveken." },
                    { id: 6, name: "Robotika", category: "tech", price: 100, description: "Robotok építése és programozása." },
                    { id: 7, name: "Jóga", category: "wellness", price: 20, description: "Test és lélek harmóniája." },
                    { id: 8, name: "Tánc", category: "sport", price: 30, description: "Különböző táncstílusok gyakorlása." },
                    { id: 9, name: "Kertészkedés", category: "kreativ", price: 10, description: "Növények nevelése és gondozása." },
                    { id: 10, name: "Blogírás", category: "tech", price: 0, description: "Írás és tartalomkészítés az interneten." }
                ]);
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

        filtered = filtered.filter(hobby => hobby.price >= priceFilterMin && hobby.price <= priceFilterMax);

        switch(sortBy){
            case "nameasc":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "namedesc":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "cheap":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "expensive":
                filtered.sort((a, b) => b.price - a.price);
                break;
            default: break;
        }

        setFilteredHobbies(filtered);

    }, [hobbies, categoryFilter, priceFilterMin, priceFilterMax, sortBy]);

    useEffect(() => {
        const fetchCategories = async() => {
            /*try{
                const response = await fetch("/api/categories");
                const data = await response.json();
                const loaded = data ? Object.keys(data).map((id) => ({id, ...data[id]})) : [];
                setCategories(loaded);
            } catch (e){
                setError(e.message);
            }*/
            setCategories([{name:"sport"}, {name:"kreativ"}, {name:"tech"}, {name:"wellness"}]);
        }
        fetchCategories();
    }, [])

    return(
        <>
            {loading && <h1>Loading...</h1>}
            {error && <h2>error</h2>}
            <div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option key={"all"} value="all">All</option>
                    {categories.map(category => <option key={category.name} value={category.name.toLowerCase()}>{category.name}</option>)}
                </select>
                <input
                    type="number"
                    placeholder="Minimum price"
                    value={priceFilterMin}
                    onChange={(e) => setPriceFilterMin(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Maximum price"
                    value={priceFilterMax}
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
            <div>
                {filteredHobbies && filteredHobbies.map(hobby => <HobbyCard key={hobby.id} hobby={hobby}/>)}
            </div>
        </>
    );

}

export default Hobbies;