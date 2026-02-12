import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Hobbies from "./pages/Hobbies.jsx";


const HomePage = () => <div>this is the homepage</div>;
const TestPage = () => <div>this is test page</div>;

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/" className="hover:text-blue-400">Home</Link>
                <Link to="/ping">Backend test</Link>
                <Link to="/hobbies">Hobby page</Link>
            </nav>


            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ping" element={<TestPage />} />
                <Route path="/hobbies" element={<Hobbies />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
