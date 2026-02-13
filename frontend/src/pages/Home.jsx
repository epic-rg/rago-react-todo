import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const STORAGE_KEY = "personalTodos";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTodos(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    if (todos.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    setTodos((prev) => [
      ...prev,
      { id: `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`, title, completed: false },
    ]);
    setInput("");
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = () => {
    if (editText.trim() && editId) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, title: editText.trim() } : t))
      );
      setEditId(null);
      setEditText("");
    }
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 bg-violet-50 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">Personal To-Do</h1>
        <p className="text-gray-600 text-sm mb-6">
          Your local list — stored only on this device.
        </p>

        <form onSubmit={addTodo} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            type="submit"
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-gray-500">No items yet. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm"
              >
                {editId === todo.id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") {
                          setEditId(null);
                          setEditText("");
                        }
                      }}
                      className="flex-1 px-3 py-1 border rounded-lg"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="text-green-600 font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        className="rounded"
                      />
                      <span
                        className={
                          todo.completed ? "line-through text-gray-400" : ""
                        }
                      >
                        {todo.title}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(todo)}
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Home;
