import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You must be logged in to see the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
        <p className="text-gray-700 mb-6">
          Email: <span className="font-medium">{user.email}</span>
        </p>

        {/* Buttons for logged-in user */}
        <div className="flex gap-4 mb-6">
          <Link
            to="/create-post"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create Post
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {/* Dashboard content */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Here is your personalized dashboard content, {user.name}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
