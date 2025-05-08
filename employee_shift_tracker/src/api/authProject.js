import axios from "@/lib/axios"; 

export const createProjects = async (projectData) => {
  const res = await axios.post("/auth/project/create", projectData);
  return res.data;
};


export const getAllProjects = async (projectData) => {
  const res = await axios.get("/auth/project/employee", projectData);
  return res.data;
};


export const getProject = async (id) => {
  const res = await axios.get(`/auth/project/${id}`);
  return res.data;
};


export const updateProject = async (id, values) => {
  const res = await axios.put(`/auth/project/${id}`, values);
  return res.data;
};

