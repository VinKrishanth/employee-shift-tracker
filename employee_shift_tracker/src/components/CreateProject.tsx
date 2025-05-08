import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjects, getProject, updateProject } from "@/api/authProject.js";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema using Zod
const formSchema = z.object({
  taskName: z
    .string()
    .min(3, { message: "Task name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  process: z.string().min(1, { message: "Process is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  assignedTo: z.string().min(1, { message: "Assignment is required" }),
});

const CreateProject = () => {
  const navigate = useNavigate();
  const [loadingProject, setLoadingProject] = useState(false);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const { toast } = useToast();
  const projectId = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      description: "",
      startDate: today,
      endDate: "",
      process: "",
      status: "Not Started",
      priority: "Medium",
      assignedTo: user?.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
  
    try {
      let response;
  
      if (projectId.id) {
        response = await updateProject(projectId.id, values);
      } else {
        response = await createProjects(values);
      }
  
      if (response.success) {
        toast({
          title: projectId.id ? "Project updated successfully" : "Project created successfully",
          description: response.message,
        });
        navigate("/employee/dashboard");
      }
    } catch (error: any) {
      toast({
        title: projectId.id ? "Project update failed" : "Project creation failed",
        description: error?.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId.id) return;

      setLoadingProject(true);
      try {
        const data = await getProject(projectId.id);
        console.log("Project data:", data);
        if (data.success) {
          let projectData = data.project;
          form.reset({
            taskName: projectData.taskName || "",
            description: projectData.description || "",
            startDate: projectData.startDate
              ? projectData.startDate.split("T")[0]
              : "",
            endDate: projectData.endDate
              ? projectData.endDate.split("T")[0]
              : "",
            process: projectData.process || "",
            status: projectData.status || "Not Started",
            priority: projectData.priority || "Medium",
            assignedTo: projectData.assignedTo || user?.name || "",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load project data.",
          variant: "destructive",
        });
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, []);

  return (
    <>
      <div className="container mx-auto sm:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          {projectId?.id ? "Update Project" : "Create New Project"}
        </h1>

        <div className="bg-card shadow-md rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Task Name{" "}
                        {projectId.id && (
                          <span className="text-xs font-normal text-red-400">
                            (Read Only)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task name"
                          {...field}
                          readOnly={!!projectId.id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Assigned To{" "}
                        {projectId.id && (
                          <span className="text-xs font-normal text-red-400">
                            (Read Only)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter team member name"
                          {...field}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Start Date{" "}
                        {projectId.id && (
                          <span className="text-xs font-normal text-red-400">
                            (Read Only)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={!projectId?.id ? today : undefined}
                          readOnly={!!projectId.id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={!projectId?.id ? today : undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="process"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Process</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select process" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="10%">10%</SelectItem>
                          <SelectItem value="20%">20%</SelectItem>
                          <SelectItem value="30%">30%</SelectItem>
                          <SelectItem value="40%">40%</SelectItem>
                          <SelectItem value="50%">50%</SelectItem>
                          <SelectItem value="60%">60%</SelectItem>
                          <SelectItem value="70%">70%</SelectItem>
                          <SelectItem value="80%">80%</SelectItem>
                          <SelectItem value="90%">90%</SelectItem>
                          <SelectItem value="100%">100%</SelectItem>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="Designing">Designing</SelectItem>
                          <SelectItem value="Developing">Developing</SelectItem>
                          <SelectItem value="Testing">Testing</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter project description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the project tasks and
                        requirements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {projectId.id
                    ? isSubmitting
                      ? "Updating..."
                      : "Update Project"
                    : isSubmitting
                    ? "Creating..."
                    : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
