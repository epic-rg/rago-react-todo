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
  showAssignee = false,
  showTimeTaken = false,
}) => {
  const formatDuration = (ms) => {
    if (!ms || Number.isNaN(ms)) return "-";
    const totalMinutes = Math.floor(ms / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || parts.length === 0) parts.push(`${minutes}m`);
    return parts.join(" ");
  };

  const assigneeName =
    typeof todo.assignedTo === "object"
      ? todo.assignedTo?.name || todo.assignedTo?.email
      : null;

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

            <div className="w-full">
              <span
                className={`w-full ${
                  todo.status === "completed"
                    ? "line-through text-gray-400"
                    : ""
                }`}
              >
                {showAssignee && assigneeName ? (
                  <>
                    <span className="font-semibold text-violet-700">{assigneeName}: </span>
                    {todo.title}
                  </>
                ) : (
                  todo.title
                )}
              </span>
              {showTimeTaken && todo.status === "completed" && (
                <p className="text-xs text-gray-500 mt-1">
                  Completed in: {formatDuration(todo.timeTaken)}
                </p>
              )}
            </div>
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
