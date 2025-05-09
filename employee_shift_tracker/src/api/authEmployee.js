import axios from "@/lib/axios"; 

export const loginEmployee = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export const registerEmployee = async (formdata) => {
  const res = await axios.post("/auth/register", formdata);
  return res.data;
};

export const logoutEmployee = async () => {
  const res = await axios.get("/api/auth/logout");
  return res.data;
};

export const fetchCurrentEmployee = async () => {
  const res = await axios.get("/api/auth/employees/me");
  return res.data;
};

export const fetchCurrentAdmin = async () => {
  const res = await axios.get("/api/auth/admins/me");
  return res.data;
};


export const getAllEmployee= async () => {
  const res = await axios.get("/api/auth/employees/allProfile");
  return res.data;
};




