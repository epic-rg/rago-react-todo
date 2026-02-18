const TodoForm = ({ todo, setTodo, assignedTo, setAssignedTo, members, handleSubmit }) => {
  return (
    <div className="add-todo">
      <h2 className="text-lg font-bold">Add Task</h2>
      {members.length === 0 && (
        <p className="text-amber-600 text-sm mb-2">Create a member from the app first to assign tasks.</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <input
          type="text"
          placeholder="Task title"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="flex-1 min-w-50 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          required
        >
          <option value="">Assign to...</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name || m.email}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
