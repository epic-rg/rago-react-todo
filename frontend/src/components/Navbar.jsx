import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user?.role === "admin" ? "/admin" : "/member";

  return (
    <nav className="flex justify-between items-center bg-violet-700 text-white p-4 px-8">
      <Link to="/" className="font-bold text-2xl hover:opacity-90">
        Agency Task Manager
      </Link>

      <div className="flex gap-6 items-center">
        <Link
          to="/home"
          className="hover:underline font-medium"
        >
          Home
        </Link>

        {!user ? (
          <Link
            to="/login"
            className="bg-white text-violet-700 px-4 py-2 rounded-lg font-medium hover:bg-violet-100 transition"
          >
            Login
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate(dashboardPath)}
              className="font-medium hover:underline capitalize"
            >
              {user.name || user.email || user.role}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/home");
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
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
