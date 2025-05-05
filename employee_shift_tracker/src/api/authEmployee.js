import axios from "@/lib/axios"; 

export const loginEmployee = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export const logoutEmployee = async () => {
  const res = await axios.get("/auth/logout");
  return res.data;
};

export const fetchCurrentEmployee = async () => {
  const res = await axios.get("/auth/employees/me");
  return res.data;
};

export const fetchCurrentAdmin = async () => {
  const res = await axios.get("/auth/admins/me");
  return res.data;
};


