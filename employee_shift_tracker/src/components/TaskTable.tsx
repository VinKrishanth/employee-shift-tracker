import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Play, Trash } from "lucide-react";

export interface TaskData {
  id: string;
  taskName: string;
  startDate: string;
  endDate: string;
  process: string;
  status: string;
}

interface TaskTableProps {
  data: TaskData[];
  onTaskStart: (profile: TaskData) => void;
  onEdit: (id: String) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ data, onTaskStart, onEdit }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Process</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Time Tacker</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center ">
                <p className="min-h-16 flex justify-center items-center">
                  No tasks found. Add your first Task above.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell>{task.startDate}</TableCell>
                <TableCell>{task.endDate}</TableCell>
                <TableCell>{task.process}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <Button
                      variant="outline"
                      onClick={() => onTaskStart(task)}
                      className=""
                    >
                      Start
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(task.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
