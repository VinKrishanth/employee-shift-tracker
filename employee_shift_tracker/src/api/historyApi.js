import axios from "@/lib/axios"; 

export const shiftHistory = async () => {
  const res = await axios.get("/shift/history");
  return res.data;
};


export const shiftAdminView = async ({id}) => {
  console.log(id);
  const res = await axios.post("/shift/admin/employee/history",{id : id});
  return res.data;
};
