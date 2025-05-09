import axios from "@/lib/axios"; 

export const createShift = async (values) => {
  const res = await axios.post("/api/shift/start", values);
  return res.data;
};


export const endShift = async (values) => {
  try {
    const res = await axios.put('/api/shift/end', values);
    return res.data;
  } catch (error) {
    console.error('Error ending shift:', error);
  }
};

export const startBreak = async (values) => {
  try {
    const res = await axios.put('/api/shift/break/start', values);
    return res.data;
  } catch (error) {
    console.error('Error ending shift:', error);
  }
};


export const stopBreak = async (values) => {
  try {
    const res = await axios.put('/api/shift/break/end', values);
    return res.data;
  } catch (error) {
    console.error('Error ending shift:', error);
  }
};

export const getUserShifts = async (activeOnly = true) => {
  const response = await fetch(`/api/shifts?activeOnly=${activeOnly}`);
  return response.json();
};

export const getAllEmployeeShift= async () => {
  const res = await axios.get("/api/shift/all");
  return res.data;
};