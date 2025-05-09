import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { HistoryIcon } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  job: string;
  telephoneNumber: string;
  nationality: string;
}

interface EmployeeTableProps {
  data: Employee[];
  onEdit: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data = [], onEdit }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = useMemo(() => {
    return (data || []).filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.job.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, filteredData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, email or job..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No matching records found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell className="cursor-pointer">{emp.name} {emp.lastName}</TableCell>
                  <TableCell className="cursor-pointer">{emp.email}</TableCell>
                  <TableCell className="cursor-pointer">{emp.email}</TableCell>
                  <TableCell className="cursor-pointer">{emp.job}</TableCell>
                  <TableCell className="cursor-pointer">{emp.telephoneNumber}</TableCell>
                  <TableCell className="cursor-pointer">{emp.nationality}</TableCell>
                  <TableCell className="text-center cursor-pointer">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(emp._id)}
                    >
                      <HistoryIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
