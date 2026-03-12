import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const handleHashScroll = (id) => (e) => {
        e.preventDefault();
        const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(scroll, 100);
        } else {
            scroll();
        }
    };

    const openAuthModal = (mode) => {
        const path = mode === "register" ? "/register" : "/login";
        navigate(path, { state: { backgroundLocation: location } });
        setIsMenuOpen(false);
    };

    return (
        <div className="sticky top-0 z-50 w-screen" data-theme="retro">
            <div className="navbar bg-base-100 border-b border-base-200 px-4">
                <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary">Get a Life</Link>
                    </div>

                    <div className="hidden md:flex items-center justify-center gap-6 text-sm font-medium">
                        <Link to="/hobbies" className="hover:text-primary">Hobbies</Link>
                        <a href="/#about" className="hover:text-primary" onClick={handleHashScroll('about')}>About</a>
                        <a href="/#categories" className="hover:text-primary" onClick={handleHashScroll('categories')}>Categories</a>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <div className="hidden md:block">
                            {isAuthenticated ? (
                                <>
                                    {isAdmin && (
                                        <Link to="/admin" className="btn btn-ghost btn-sm rounded-btn">Admin</Link>
                                    )}
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="btn btn-ghost btn-sm rounded-btn">
                                            👤 {user?.username}
                                        </label>
                                        <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                                            <li><a className="text-sm">{user?.email}</a></li>
                                            <li><hr className="my-1"/></li>
                                            <li><button onClick={handleLogout}>Logout</button></li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-neutral btn-sm rounded-btn gap-2"
                                    onClick={() => openAuthModal("login")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    Login / Sign Up
                                </button>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button className="btn btn-square btn-ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="bg-base-100 shadow-md flex flex-col md:hidden">
                    <Link to="/hobbies" className="btn btn-ghost w-full rounded-none text-left" onClick={() => setIsMenuOpen(false)}>Hobbies</Link>
                    <a href="/#about" className="btn btn-ghost w-full rounded-none text-left" onClick={(e) => { handleHashScroll('about')(e); setIsMenuOpen(false); }}>About</a>
                    <a href="/#categories" className="btn btn-ghost w-full rounded-none text-left" onClick={(e) => { handleHashScroll('categories')(e); setIsMenuOpen(false); }}>Categories</a>

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="btn btn-ghost w-full rounded-none text-left" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                            )}
                            <div className="divider my-0"></div>
                            <div className="px-4 py-2 text-sm">
                                <div className="font-semibold">{user?.name}</div>
                                <div className="text-xs opacity-70">{user?.email}</div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-ghost w-full rounded-none text-left">Logout</button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn btn-neutral w-full rounded-none text-left"
                                onClick={() => openAuthModal("login")}
                            >
                                Login / Sign Up
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}