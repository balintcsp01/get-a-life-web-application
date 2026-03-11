import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { hobbyApi, categoryApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import HobbyCard from '../components/HobbyCard';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [featuredHobbies, setFeaturedHobbies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ hobbies: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hobbiesData, categoriesData] = await Promise.all([
          hobbyApi.getAll(),
          categoryApi.getAll(),
        ]);

        const hobbiesArray = Array.isArray(hobbiesData) ? hobbiesData : Object.values(hobbiesData);
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : Object.values(categoriesData);

        setFeaturedHobbies([...hobbiesArray].sort(() => 0.5 - Math.random()).slice(0, 6));
        setCategories(categoriesArray.slice(0, 6));
        setStats({ hobbies: hobbiesArray.length, categories: categoriesArray.length });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-base-100" data-theme="retro">

      <div id="about" className="hero min-h-[60vh] bg-linear-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black mb-6 uppercase italic">
              Find Your Next <span className="text-primary">Passion</span>! 🎯
            </h1>
            <p className="text-xl mb-8">
              Explore hundreds of hobbies, discover new interests, and connect with like-minded people.
              Your next adventure starts here!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/hobbies" className="btn btn-primary btn-lg">
                Browse All Hobbies
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-300 rounded-box bg-base-100 gap-4 p-2">
          <div className="stat place-items-center text-center">
            <div className="stat-title">Total Hobbies</div>
            <div className="stat-value text-primary">{stats.hobbies}</div>
            <div className="stat-desc">Ready to explore</div>
          </div>
          <div className="stat place-items-center text-center">
            <div className="stat-title">Categories</div>
            <div className="stat-value text-secondary">{stats.categories}</div>
            <div className="stat-desc">Something for everyone</div>
          </div>
          <div className="stat place-items-center text-center">
            <div className="stat-title">Community</div>
            <div className="stat-value">∞</div>
            <div className="stat-desc">Join us today</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Hobbies ✨</h2>
          <p className="text-lg text-base-content/70">Check out some popular hobbies from our community</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredHobbies.map(hobby => (
              <HobbyCard key={hobby.id} hobby={hobby} />
            ))}
          </div>
        )}
        <div className="text-center">
          <Link to="/hobbies" className="btn btn-primary btn-wide">View All Hobbies →</Link>
        </div>
      </div>

      <div id="categories" className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explore by Category 📚</h2>
            <p className="text-lg text-base-content/70">Find hobbies that match your interests</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/hobbies?category=${category.name.toLowerCase()}`}
                className="card bg-base-100 hover:bg-primary hover:text-primary-content transition-all duration-200 shadow-md hover:shadow-xl"
              >
                <div className="card-body items-center text-center p-6">
                  <h3 className="card-title text-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="card bg-primary text-primary-content">
            <div className="card-body items-center text-center py-12">
              {isAuthenticated ? (
                <>
                  <h2 className="card-title text-4xl font-bold mb-4">Ready to Explore More? 🚀</h2>
                  <p className="text-xl mb-6 max-w-2xl">Dive into our collection of hobbies and discover your next passion!</p>
                  <Link to="/hobbies" className="btn btn-secondary btn-lg">Continue Exploring →</Link>
                </>
              ) : (
                <>
                  <h2 className="card-title text-4xl font-bold mb-4">Ready to Get a Life? 🚀</h2>
                  <p className="text-xl mb-6 max-w-2xl">Join our community today and start discovering hobbies that will change your life!</p>
                  <Link to="/register" className="btn btn-secondary btn-lg">Sign Up Now - It's Free!</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage;
