// import Navbar from "./components/Navbar.jsx";

// function App() {

//   return (
//     <>
//     <Navbar />
//     <div className="container bg-violet-100 m-4 p-4  rounded-2xl">
//       <div className="add-todo">
//         <h2 className="text-lg font-bold">Add Todo</h2>
//         <input type="text" className="bg-white"/>
//         <button>ADD TODO</button>
//       </div>
//         <h2 className="text-lg font-bold">Your Todos</h2>

//         <div className="todos">
//           <div className="todo flex flex-row justify-between">
//               <span className="text bg-white px-6 py-1 m-2 rounded-2xl">This is your task</span>
//               <div className="buttons flex flex-row py-2 gap-12">
//                 <button className="edit">Edit</button>
//                 <button className="delete">Delete</button>
//               </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default App

import { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editId]);

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const handleUpdate = () => {
    if (!editText.trim()) return;

    setTodos(
      todos.map((todo) =>
        todo.id === editId ? { ...todo, text: editText } : todo,
      ),
    );

    setEditId(null);
    setEditText("");
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload

    if (!todo.trim()) return;

    setTodos([...todos, { id: Date.now(), text: todo }]);
    setTodo("");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 bg-violet-100 p-6 rounded-2xl shadow">
        <div className="add-todo">
          <h2 className="text-lg font-bold">Add Todo</h2>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
            >
              Add
            </button>
          </form>
        </div>

        <h2 className="text-lg font-bold">Your Todos</h2>

        <div className="todos">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-white p-3 rounded-xl mb-3"
            >
              {editId === todo.id ? (
                <div className="flex w-full gap-3">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate();
                      if (e.key === "Escape") {
                        setEditId(null);
                        setEditText("");
                      }
                    }}
                    className="w-full px-3 py-1 border rounded-lg"
                  />

                  <button onClick={handleUpdate} className="text-green-600">
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span className="w-full">{todo.text}</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
