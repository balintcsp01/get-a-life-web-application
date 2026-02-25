import './App.css'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AdminPage from './pages/AdminPage.jsx';
import Hobbies from "./pages/Hobbies.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import {AuthProvider} from "./contexts/AuthContext.jsx";
import HobbyDetails from "./pages/HobbyDetails.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AuthModal from "./components/AuthModal.jsx";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.backgroundLocation;
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const initialMode = location.pathname === "/register" ? "register" : "login";

  const handleAuthClose = () => {
    if (backgroundLocation) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  return (
    <>
      <Navbar/>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/register" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/hobbies/:id" element={<HobbyDetails />} />
      </Routes>
      <AuthModal
        isOpen={isAuthRoute}
        initialMode={initialMode}
        onClose={handleAuthClose}
      />
    </>
  );
}

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;