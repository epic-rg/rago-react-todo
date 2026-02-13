import API from "./api";

/* ========== ADMIN ========== */

export const getAllTasks = async () => {
  const res = await API.get("/tasks/all");
  return res.data?.data ?? res.data ?? [];
};

export const createTask = async (taskData) => {
  const res = await API.post("/tasks", taskData);
  return res.data?.data ?? res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await API.put(`/tasks/${id}`, taskData);
  return res.data?.data ?? res.data;
};

export const deleteTask = async (id) => {
  await API.delete(`/tasks/${id}`);
};

/* ========== MEMBER ========== */

export const getMyTasks = async () => {
  const res = await API.get("/tasks/my");
  return res.data?.data ?? res.data ?? [];
};

export const completeTask = async (id) => {
  const res = await API.patch(`/tasks/${id}/complete`);
  return res.data?.data ?? res.data;
};
