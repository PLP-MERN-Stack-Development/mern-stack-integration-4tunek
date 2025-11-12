import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">
        <Link to="/">BlogApp</Link>
      </h1>

      <div className="space-x-4 flex items-center">
        {loading && <p>Loading...</p>}

        {!loading && user && (
          <>
            <Link to="/create-post" className="hover:underline">
              Create Post
            </Link>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
            >
              Logout
            </button>
          </>
        )}

        {!loading && !user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
