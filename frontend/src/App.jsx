import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminPage from './pages/AdminPage.jsx';
import Hobbies from "./pages/Hobbies.jsx";
import Navbar from "./components/Navbar.jsx";


const HomePage = () => <div>this is the homepage</div>;
const TestPage = () => <div>this is test page</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ping" element={<TestPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/hobbies" element={<Hobbies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;