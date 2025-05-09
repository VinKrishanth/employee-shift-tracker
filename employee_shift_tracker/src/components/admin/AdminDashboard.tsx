import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { MapPin, FileText, File, Filter } from "lucide-react";
import {  LocationData } from "@/contexts/TimeTrackingContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shift } from "@/types/shift";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import WelcomeSection from "../WelcomeSection";
import { getAllEmployeeShift } from "@/api/shiftApi.js";
import MapPreview from "@/components/MapPreview";


const mockShifts: Shift[] = [
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-09T00:00:00.000Z",
    checkIn: "2025-05-09T06:57:38.233Z",
    checkOut: "2025-05-09T07:02:01.710Z",
    duration: "00:04:23",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "Testing Finshied",
  },
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-09T00:00:00.000Z",
    checkIn: "2025-05-09T06:53:56.351Z",
    checkOut: "2025-05-09T06:54:37.693Z",
    duration: "00:00:41",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "Testing ",
  },
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-09T00:00:00.000Z",
    checkIn: "2025-05-09T06:53:56.351Z",
    duration: "",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {},
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "",
  },
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-09T00:00:00.000Z",
    checkIn: "2025-05-09T06:53:56.351Z",
    checkOut: "2025-05-09T07:02:01.710Z",
    duration: "00:08:05",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "Testing Finshied",
  },
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-09T00:00:00.000Z",
    checkIn: "2025-05-09T06:53:56.351Z",
    checkOut: "2025-05-09T07:02:01.710Z",
    duration: "00:08:05",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "Testing Finshied",
  },
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-09T00:00:00.000Z",
    checkIn: "2025-05-09T05:28:05.961Z",
    checkOut: "2025-05-09T05:29:16.617Z",
    duration: "00:01:10",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "Testing completed",
  },
  {
    employee: {
      _id: "6819c852705dbb0719a434a2",
      name: "test2",
      email: "test2@gmail.com",
    },
    date: "2025-05-08T00:00:00.000Z",
    checkIn: "2025-05-08T02:45:54.546Z",
    checkOut: "2025-05-08T04:37:29.725Z",
    duration: "01:51:35",
    startLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    endLocation: {
      latitude: 6.8288512,
      longitude: 79.9932416,
    },
    projectId: "681b5b0cf80d26af0b6d8fb0",
    notes: "Ui Web development",
  },
];

const Location: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "today" | "yesterday" | "week">(
    "all"
  );

  const [mapPreview, setMapPreview] = useState<{
      isOpen: boolean;
      location: LocationData;
      title: string;
    }>({
      isOpen: false,
      location: null,
      title: ""
    });

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployeeShift();
      if (data.success) {
        setShifts(data.shifts);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  const itemsPerPage = 5;

  const filteredShifts = shifts.filter((shift) => {
    const shiftDate = new Date(shift.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    switch (filter) {
      case "today":
        return shiftDate.toDateString() === today.toDateString();
      case "yesterday":
        return shiftDate.toDateString() === yesterday.toDateString();
      case "week":
        return shiftDate >= weekAgo && shiftDate <= today;
      default:
        return true;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const openMapPreview = (location: LocationData, title: string) => {
    if (location) {
      setMapPreview({
        isOpen: true,
        location,
        title
      });
    }
  };

  const closeMapPreview = () => {
    setMapPreview(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <WelcomeSection />
      </div>
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Shift Locations
            </CardTitle>
            <CardDescription>
              View and manage shift locations and export data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select
                  value={filter}
                  onValueChange={(value) => {
                    setFilter(value as "all" | "today" | "yesterday" | "week");
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => exportToCSV(filteredShifts)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportToPDF(filteredShifts)}
                  className="flex items-center gap-2"
                >
                  <File className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Start Location</TableHead>
                    <TableHead>End Location</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedShifts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No shifts found for the selected filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedShifts.map((shift, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {format(new Date(shift.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{shift.employee.name}</TableCell>
                        <TableCell>
                          {format(new Date(shift.checkIn), "hh:mm a")}
                        </TableCell>
                        <TableCell>
                          {shift.checkOut
                            ? format(new Date(shift.checkOut), "hh:mm a")
                            : "-"}
                        </TableCell>
                        <TableCell>{shift.duration || "In progress"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openMapPreview(shift.startLocation, "Check-in Location");
                            }}
                            className="flex items-center gap-1 text-primary"
                          >
                            <MapPin className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
                          {Object.keys(shift.endLocation).length > 0 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openMapPreview(shift.endLocation, "Check-in Location");
                              }}
                              className="flex items-center gap-1 text-primary"
                            >
                              <MapPin className="h-4 w-4" />
                              View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">
                              Not recorded
                            </span>
                          )}
                        </TableCell>
                        <TableCell
                          className="max-w-[150px] truncate"
                          title={shift.notes}
                        >
                          {shift.notes || "No notes"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      // Logic to show first, last, and pages around current
                      let pageNumber = i + 1;
                      if (totalPages > 5) {
                        if (currentPage > 3 && currentPage < totalPages - 1) {
                          pageNumber = [
                            1,
                            currentPage - 1,
                            currentPage,
                            currentPage + 1,
                            totalPages,
                          ][i];
                        } else if (currentPage >= totalPages - 1) {
                          pageNumber = [
                            1,
                            totalPages - 3,
                            totalPages - 2,
                            totalPages - 1,
                            totalPages,
                          ][i];
                        }
                      }

                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
          </CardContent>
        </Card>
      </div>

      <MapPreview
        isOpen={mapPreview.isOpen}
        onClose={closeMapPreview}
        location={mapPreview.location}
        title={mapPreview.title}
      />
    </main>
  );
};

export default Location;
