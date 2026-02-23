import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from './pages/AdminPage.jsx';
import Hobbies from "./pages/Hobbies.jsx";
import Navbar from "./components/Navbar.jsx";

const HomePage = () => <div>this is the homepage</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/hobbies" element={<Hobbies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;