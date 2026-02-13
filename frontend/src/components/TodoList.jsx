import TodoItem from "./TodoItem";

const TodoList = ({
  todos,
  showFinished,
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
  const filteredTodos = todos.filter(
    (task) => showFinished || task.status !== "completed"
  );

  if (filteredTodos.length === 0) {
    return (
      <p className="text-gray-500 mt-3">
        No tasks yet. Add something productive.
      </p>
    );
  }

  return (
    <div className="todos mt-3">
      {filteredTodos.map((task) => (
        <TodoItem
          key={task._id}
          todo={task}
          editId={editId}
          editText={editText}
          setEditText={setEditText}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          toggleComplete={toggleComplete}
          startEditing={startEditing}
          editInputRef={editInputRef}
          setEditId={setEditId}
        />
      ))}
    </div>
  );
};

export default TodoList;
