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
    (todo) => showFinished || !todo.completed
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
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
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
