const TodoForm = ({ todo, setTodo, handleSubmit }) => {
  return (
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
  );
};

export default TodoForm;
