// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import { getMembers, createMember } from "../services/authService";

function AdminDashboard() {
  const [todo, setTodo] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [todos, setTodos] = useState([]);
  const [members, setMembers] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: "", email: "", password: "" });
  const [memberError, setMemberError] = useState("");
  const [memberSuccess, setMemberSuccess] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load tasks");
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      const list = Array.isArray(data) ? data : [];
      setMembers(list);
      if (list.length && !assignedTo) setAssignedTo(list[0]._id);
    } catch {
      setMembers([]);
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    const { name, email, password } = memberForm;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      setMemberError("Name, email and password are required");
      return;
    }
    setMemberError("");
    setMemberSuccess("");
    try {
      await createMember(name.trim(), email.trim(), password);
      setMemberForm({ name: "", email: "", password: "" });
      setMemberSuccess("Member created. They can log in with this email and password.");
      fetchMembers();
    } catch (err) {
      setMemberError(err.response?.data?.message || "Failed to create member");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    if (!assignedTo) {
      setError("Select a member to assign");
      return;
    }
    setError("");
    try {
      await createTask({ title: todo.trim(), assignedTo });
      await fetchTasks();
      setTodo("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      await updateTask(editId, { title: editText.trim() });
      await fetchTasks();
      setEditId(null);
      setEditText("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await fetchTasks();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const toggleComplete = async (id) => {
    const task = todos.find((t) => t._id === id);
    if (!task) return;
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await updateTask(id, { status: newStatus });
      await fetchTasks();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const visibleTodos = todos.filter((task) => {
    const taskAssignedId =
      typeof task.assignedTo === "object" ? task.assignedTo?._id : task.assignedTo;

    const matchesSelectedMember = showAllTasks || !assignedTo || taskAssignedId === assignedTo;
    const matchesStatus = showFinished || task.status !== "completed";

    return matchesSelectedMember && matchesStatus;
  });

  const selectedMember = members.find((m) => m._id === assignedTo);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 bg-violet-100 p-6 rounded-2xl shadow">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAddMember((s) => !s)}
            className="text-violet-700 font-medium text-sm underline"
          >
            {showAddMember ? "Hide add member" : "+ Add member"}
          </button>
          {showAddMember && (
            <form onSubmit={handleCreateMember} className="mt-3 p-3 bg-white rounded-lg border flex flex-col gap-2 max-w-xs">
              <input
                type="text"
                placeholder="Name"
                value={memberForm.name}
                onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={memberForm.email}
                onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={memberForm.password}
                onChange={(e) => setMemberForm((f) => ({ ...f, password: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              {memberError && <p className="text-red-500 text-sm">{memberError}</p>}
              {memberSuccess && <p className="text-green-600 text-sm">{memberSuccess}</p>}
              <button type="submit" className="bg-violet-600 text-white py-2 rounded">
                Create member
              </button>
            </form>
          )}
        </div>
        <TodoForm
          todo={todo}
          setTodo={setTodo}
          assignedTo={assignedTo}
          setAssignedTo={setAssignedTo}
          members={members}
          handleSubmit={handleSubmit}
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAllTasks((prev) => !prev)}
            className="bg-violet-200 text-violet-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-violet-300 transition"
          >
            {showAllTasks ? "Show selected member tasks" : "Show all tasks"}
          </button>
          {!showAllTasks && selectedMember && (
            <p className="text-sm text-gray-600">
              Showing tasks for <span className="font-semibold">{selectedMember.name || selectedMember.email}</span>
            </p>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <TodoList
          todos={visibleTodos}
          showFinished={showFinished}
          alreadyFiltered
          showAssignee={showAllTasks}
          showTimeTaken
          editId={editId}
          editText={editText}
          setEditText={setEditText}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          toggleComplete={toggleComplete}
          startEditing={(task) => {
            setEditId(task._id);
            setEditText(task.title);
          }}
          setEditId={setEditId}
        />
      </div>
    </>
  );
}

export default AdminDashboard;
