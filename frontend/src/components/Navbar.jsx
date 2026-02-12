import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 w-screen" data-theme="retro">
            <div className="navbar bg-base-300 shadow-md px-4">
                <div className="flex-1">
                    <Link to="/" className="text-xl font-bold">Get a life</Link>
                </div>

                <div className="hidden md:flex gap-4">
                    <Link to="/" className="btn btn-ghost btn-sm rounded-btn">Home</Link>
                    <Link to="/ping" className="btn btn-ghost btn-sm rounded-btn">Backend test</Link>
                    <Link to="/admin" className="btn btn-ghost btn-sm rounded-btn">Admin</Link>
                    <Link to="/hobbies" className="btn btn-ghost btn-sm rounded-btn">Hobbies</Link>
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

            {isMenuOpen && (
                <div className="bg-base-100 shadow-md flex flex-col md:hidden">
                    <Link to="/" className="btn btn-ghost w-full rounded-none text-left">Home</Link>
                    <Link to="/ping" className="btn btn-ghost w-full rounded-none text-left">Backend</Link>
                    <Link to="/admin" className="btn btn-ghost w-full rounded-none text-left">Admin</Link>
                    <Link to="/hobbies" className="btn btn-ghost w-full rounded-none text-left">Hobbies</Link>
                </div>
            )}
        </div>
    );
}