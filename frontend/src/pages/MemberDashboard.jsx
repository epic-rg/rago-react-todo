import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getMyTasks, completeTask } from "../services/taskService";

const MemberDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const fromLogin = location.state?.fromLogin ?? false;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    setActionError("");
    try {
      const updated = await completeTask(id);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to complete task";
      setActionError(msg);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100">
          {fromLogin && (
            <p className="text-green-600 text-sm font-medium mb-2">
              You’re in. Here are your assigned tasks.
            </p>
          )}
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            Welcome, {user?.name ?? user?.role}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Tasks assigned to you from your team.
          </p>

          {actionError && (
            <p className="text-red-600 text-sm mb-3">{actionError}</p>
          )}

          {tasks.length === 0 ? (
            <p className="text-gray-500 py-4">No tasks assigned yet.</p>
          ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap justify-between items-center gap-3 border border-gray-100"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {task.status === "completed" ? "Done" : "Pending"}
                  </p>
                </div>
                {task.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => handleComplete(task._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0"
                  >
                    Mark complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;
