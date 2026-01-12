import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Loader2, ListTodo, Filter } from "lucide-react";
import { type Task, type Project, TaskStatus, type TaskStatusType } from "@shared/schema";
import { TaskCard } from "@/components/task-card";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusFilters: { value: TaskStatusType; label: string }[] = [
  { value: TaskStatus.TODO, label: "To Do" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.FINISHED, label: "Finished" },
  { value: TaskStatus.PAUSED, label: "Paused" },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatusType[]>([]);

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const project = projects.find((p) => p.id === projectId);

  const { data: allTasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/tasks", projectId],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`http://localhost:3000/api/tasks?projectId=${projectId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });


  const filteredTasks =
    selectedStatuses.length === 0
      ? allTasks
      : allTasks.filter((task) => selectedStatuses.includes(task.status));

  const completedTasks = allTasks.filter(t => t.status === "FINISHED").length;
  const progress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
  const urgentTasks = allTasks.filter(t => t.priority === "URGENT").length;

  function toggleStatus(status: TaskStatusType) {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }

  function clearFilters() {
    setSelectedStatuses([]);
  }

  const isLoading = projectsLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h2 className="text-lg font-medium mb-2">Project not found</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The project you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/" data-testid="link-back-home">
            Go to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
                data-testid="breadcrumb-dashboard"
              >
                Dashboard
              </Link>
              <span>/</span>
              <span>{project.name}</span>
            </div>
            <h1 className="text-2xl font-semibold" data-testid="text-project-name">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {project.description}
              </p>
            )}
          </div>
          <CreateTaskDialog projectId={projectId} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Progress</div>
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-bold">{progress}%</span>
              <span className="text-xs text-muted-foreground mb-1">{completedTasks}/{allTasks.length} tasks</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>
          <Card className="p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Urgent</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">Requiring immediate attention</div>
          </Card>
          <Card className="p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Active</div>
            <div className="text-2xl font-bold">{allTasks.filter(t => t.status === "IN_PROGRESS").length}</div>
            <div className="text-xs text-muted-foreground mt-1">Tasks currently in progress</div>
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-3 border-b flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" data-testid="button-filter">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {selectedStatuses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusFilters.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.value}
                checked={selectedStatuses.includes(filter.value)}
                onCheckedChange={() => toggleStatus(filter.value)}
                data-testid={`filter-${filter.value.toLowerCase()}`}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedStatuses.length > 0 && (
          <>
            <div className="flex items-center gap-1 flex-wrap">
              {selectedStatuses.map((status) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleStatus(status)}
                  data-testid={`active-filter-${status.toLowerCase()}`}
                >
                  {status.replace("_", " ")} ×
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              data-testid="button-clear-filters"
            >
              Clear all
            </Button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">
              {allTasks.length === 0 ? "No tasks yet" : "No matching tasks"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {allTasks.length === 0
                ? "Create your first task to get started"
                : "Try adjusting your filters"}
            </p>
            {allTasks.length === 0 ? (
              <CreateTaskDialog projectId={projectId} />
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3" data-testid="tasks-list">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
