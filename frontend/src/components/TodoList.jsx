import TodoItem from "./TodoItem";

const TodoList = ({
  todos,
  showFinished,
  alreadyFiltered = false,
  showAssignee = false,
  showTimeTaken = false,
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
  const filteredTodos = alreadyFiltered
    ? todos
    : todos.filter((task) => {
        const isCompleted = task.status === "completed" || task.completed === true;
        return showFinished || !isCompleted;
      });

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
          showAssignee={showAssignee}
          showTimeTaken={showTimeTaken}
        />
      ))}
    </div>
  );
};

export default TodoList;
