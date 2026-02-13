import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getMyTasks, completeTask } from "../services/taskService";

const MemberDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const updated = await completeTask(id);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 bg-blue-100 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">
          Welcome, {user?.name ?? user?.role}
        </h1>

        {tasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Status: {task.status}
                  </p>
                </div>

                {task.status !== "completed" && (
                  <button
                    onClick={() =>
                      handleComplete(task._id)
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MemberDashboard;
