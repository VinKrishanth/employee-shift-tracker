import axios from "@/lib/axios"; 

export const createProjects = async (projectData) => {
  const res = await axios.post("/api/auth/project/create", projectData);
  return res.data;
};


export const getAllProjects = async (projectData) => {
  const res = await axios.get("/api/auth/project/employee", projectData);
  return res.data;
};


export const getProject = async (id) => {
  const res = await axios.get(`/api/auth/project/${id}`);
  return res.data;
};


export const updateProject = async (id, values) => {
  const res = await axios.put(`/api/auth/project/${id}`, values);
  return res.data;
};

