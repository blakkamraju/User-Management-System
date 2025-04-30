import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Search, XCircle } from 'lucide-react';
import UserProfile from "./UserProfile";
import { useSearchUsers } from "../hooks/useFetchUser";
import './CSS/Dashboard.css';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: any;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const Dashboard: React.FC = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate(); 

  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: searchedUsers, isLoading, refetch } = useSearchUsers(debouncedQuery);

  useEffect(() => {
    if (!user) {
      const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
      if (storedUser) {
        setUser(storedUser);
      } else {
        navigate('/form/login');
      }
    }
  }, [user, navigate, setUser]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserProfile user={user} />
        <button
          onClick={logout}
          className="logout-button"
        >
          <LogOut size={20} />
          Logout
        </button>
        
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for other users"
              className="search-input"
            />
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search"
            >
              <XCircle size={20} />
            </button>
            <Search
              onClick={() => refetch()}
              className="search-icon"
              size={38}
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="loading-spinner">
            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}

        {/* Searched Users */}
        {!isLoading && searchedUsers && searchedUsers.length > 0 && (
          <div className="searched-users">
            {searchedUsers.map((user: User) => (
              <motion.div
                key={user.id}
                className="user-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="user-name">{user.name}</h4>
                <p className="user-email">{user.email}</p>
                {user.phone && <p className="user-phone">{user.phone}</p>}
                {user.address && <p className="user-address">{user.address}</p>}
              </motion.div>
            ))}
          </div>
        )}

        {/* No users found */}
        {debouncedQuery && !isLoading && searchedUsers && searchedUsers.length === 0 && (
          <div className="no-users-found">No users found</div>
        )}
      </motion.main>
    </div>
  );
};

export default Dashboard;
