import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { shiftHistory , shiftAdminView} from "@/api/historyApi.js";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";

interface HistoryDataTableProps {
  timeFilter: "today" | "yesterday" | "week" | "month" | "all";
}

const HistoryDataTable = ({ timeFilter }: HistoryDataTableProps) => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { user } = useAuth();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (user.role === "employee") {
          data = await shiftHistory();
        } else {
          if (!id) {
            console.warn("Admin view requires a user ID.");
            return;
          }
          data = await shiftAdminView({id}); 
        }
  
        if (data?.success) {
          setAllData(data.shifts);
        } else {
          console.warn("Data fetch was not successful:", data);
        }
      } catch (error) {
        console.error("Failed to fetch shift history:", error);
      }
    };
  
    if (user?.role) {
      fetchData();
    }
  }, [user?.role]);

  useEffect(() => {
    let filtered = [...allData];

    if (searchTerm) {
      filtered = filtered.filter((entry) =>
        entry.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (timeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date);
        switch (timeFilter) {
          case "today":
            return (
              entryDate >= today &&
              entryDate < new Date(today.getTime() + 86400000)
            );
          case "yesterday":
            return (
              entryDate >= yesterday &&
              entryDate < new Date(today.getTime())
            );
          case "week":
            return entryDate >= weekStart;
          case "month":
            return entryDate >= monthStart;
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [allData, timeFilter, searchTerm]);

  const formatDate = (isoString: string): string =>
    format(new Date(isoString), "MMM dd, yyyy");

  const formatTime = (isoString: string): string =>
    format(new Date(isoString), "hh:mm a");

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex items-center mb-4 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search by notes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>History of activities and time tracking</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Breaks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{formatTime(entry.startTime)}</TableCell>
                  <TableCell>
                    {entry.endTime ? formatTime(entry.endTime) : "N/A"}
                  </TableCell>
                  <TableCell>{entry.shiftHours}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.notes}
                  </TableCell>
                  <TableCell>
                    {entry.breaks?.length || 0}{" "}
                    {entry.breaks?.length === 1 ? "break" : "breaks"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default HistoryDataTable;
