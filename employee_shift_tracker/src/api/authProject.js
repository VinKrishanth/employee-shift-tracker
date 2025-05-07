import axios from "@/lib/axios"; 

export const createProjects = async (projectData) => {
  const res = await axios.post("/auth/project/create", projectData);
  return res.data;
};


export const getAllProjects = async (projectData) => {
  const res = await axios.get("/auth/project/employee", projectData);
  return res.data;
};

