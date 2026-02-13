// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      const user = await login(email, password);
      setSuccess(true);

      const path = user.role === "admin" ? "/admin" : "/member";
      setTimeout(() => {
        navigate(path, { replace: true, state: { fromLogin: true } });
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setLoading(false);
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-80 flex flex-col gap-4"
      >
        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-violet-600 hover:underline"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-violet-600 hover:underline"
          >
            Home
          </button>
        </div>
        <h2 className="text-xl font-bold text-center">Login</h2>

        {success && (
          <p className="text-green-600 text-center text-sm">
            Login successful. Taking you to your dashboard…
          </p>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-violet-600 text-white p-2 rounded-lg w-full font-medium disabled:opacity-70 disabled:cursor-not-allowed hover:bg-violet-700 transition"
          disabled={loading || success}
        >
          {loading || success ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
