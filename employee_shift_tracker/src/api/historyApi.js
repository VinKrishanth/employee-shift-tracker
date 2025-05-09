import axios from "@/lib/axios"; 

export const shiftHistory = async () => {
  const res = await axios.get("/api/shift/history");
  return res.data;
};


export const shiftAdminView = async ({id}) => {
  console.log(id);
  const res = await axios.post("/api/shift/admin/employee/history",{id : id});
  return res.data;
};
