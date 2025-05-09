import React, { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";
import { getAllEmployee } from "@/api/authEmployee.js";
import { useNavigate } from "react-router-dom";

interface Employee {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  job: string;
  telephoneNumber: string;
  nationality: string;
}

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const navigation  = useNavigate();

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployee();
      setEmployees(Array.isArray(data.employees) ? data.employees : []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } 
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (id: string) => {
    navigation(`/admin/history/${id}`)
  };

  return (
    <div className="sm:px-8 pt-10 px-4">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-8 text-center">
        Employee List
      </h2>
      <EmployeeTable data={employees || []} onEdit={handleEdit} />
    </div>
  );
};

export default EmployeePage;
