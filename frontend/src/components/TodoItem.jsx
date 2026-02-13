import React from "react";

const TodoItem = ({
  todo,
  editId,
  editText,
  setEditText,
  handleUpdate,
  handleDelete,
  toggleComplete,
  startEditing,
  editInputRef,
  setEditId,
}) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl mb-3">
      {editId === todo._id ? (
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
          <div className="flex items-center gap-3 w-full">
            <input
              type="checkbox"
              checked={todo.status === "completed"}
              onChange={() => toggleComplete(todo._id)}
            />

            <span
              className={`w-full ${
                todo.status === "completed"
                  ? "line-through text-gray-400"
                  : ""
              }`}
            >
              {todo.title}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => startEditing(todo)}
              className="text-blue-500"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(todo._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(TodoItem);
