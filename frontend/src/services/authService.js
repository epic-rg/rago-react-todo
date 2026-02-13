import API from "./api";

export const getMembers = async () => {
  const res = await API.get("/auth/members");
  return res.data?.data ?? res.data ?? [];
};

export const createMember = async (name, email, password) => {
  const res = await API.post("/auth/create-member", { name, email, password });
  return res.data?.member ?? res.data;
};
