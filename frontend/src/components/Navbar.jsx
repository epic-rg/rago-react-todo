// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between bg-violet-700 text-white p-4 px-8">
      <div className="font-bold text-2xl">Agency Task Manager</div>

      <div className="flex gap-6 items-center">
        {!user && <Link to="/login">Login</Link>}

        {user && (
          <>
            <span className="capitalize">{user.role}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
