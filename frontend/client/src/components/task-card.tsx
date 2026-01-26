import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, User as UserIcon, Loader2, Calendar } from "lucide-react";
import { type Task, type User, TaskStatus, type TaskStatusType, TaskPriority, type TaskPriorityType } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {Restricted} from "@/components/restricted.tsx";

interface TaskCardProps {
  task: Task;
}

const statusOptions: { value: TaskStatusType; label: string }[] = [
  { value: TaskStatus.TODO, label: "To Do" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.FINISHED, label: "Finished" },
  { value: TaskStatus.PAUSED, label: "Paused" },
];

const priorityOptions: { value: TaskPriorityType; label: string }[] = [
  { value: TaskPriority.LOW, label: "Low" },
  { value: TaskPriority.MEDIUM, label: "Medium" },
  { value: TaskPriority.HIGH, label: "High" },
  { value: TaskPriority.URGENT, label: "Urgent" },
];

const priorityColors: Record<TaskPriorityType, string> = {
  LOW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  MEDIUM: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function TaskCard({ task }: TaskCardProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  async function updateStatus(status: TaskStatusType) {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${task.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await queryClient.invalidateQueries();
      toast({
        title: "Status updated",
        description: `Task status changed to ${status.replace("_", " ")}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function updatePriority(priority: TaskPriorityType) {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${task.id}/priority`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });

      if (!response.ok) {
        throw new Error("Failed to update priority");
      }

      await queryClient.invalidateQueries();
      toast({
        title: "Priority updated",
        description: `Task priority changed to ${priority.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task priority.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function assignUser(userId: number) {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${task.id}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign user");
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "User assigned",
        description: "Task has been assigned successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign user to task.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  const assignedUserInitials = task.assignedTo
    ? task.assignedTo.name.substring(0, 2).toUpperCase()
    : null;

  return (
    <Card
      className="hover-elevate transition-shadow duration-200"
      data-testid={`task-card-${task.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm truncate" data-testid={`task-title-${task.id}`}>
                {task.title}
              </h4>
              <StatusBadge status={task.status as TaskStatusType} />
              {task.priority && (
                <Badge variant="secondary" className={`text-[10px] px-1.5 h-4 uppercase ${priorityColors[task.priority as TaskPriorityType]}`}>
                  {task.priority}
                </Badge>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {task.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {assignedUserInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {task.assignedTo.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <UserIcon className="h-3 w-3" />
                    Unassigned
                  </span>
                )}
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.dueDate), "MMM d")}
                </div>
              )}
            </div>
          </div>
          <Restricted to="MANAGER">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isUpdating}
                    data-testid={`button-task-menu-${task.id}`}
                >
                  {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                      <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {statusOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => updateStatus(option.value)}
                            disabled={task.status === option.value}
                            data-testid={`status-option-${option.value.toLowerCase()}`}
                        >
                          {option.label}
                          {task.status === option.value && " (current)"}
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Priority</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {priorityOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => updatePriority(option.value)}
                            disabled={task.priority === option.value}
                            data-testid={`priority-option-${option.value.toLowerCase()}`}
                        >
                          {option.label}
                          {task.priority === option.value && " (current)"}
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Assign User</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {users.length === 0 ? (
                        <DropdownMenuItem disabled>No users available</DropdownMenuItem>
                    ) : (
                        users.map((user) => (
                            <DropdownMenuItem
                                key={user.id}
                                onClick={() => assignUser(user.id)}
                                data-testid={`assign-user-${user.id}`}
                            >
                              {user.name}
                              {task.userId === user.id && " (assigned)"}
                            </DropdownMenuItem>
                        ))
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </Restricted>

        </div>
      </CardContent>
    </Card>
  );
}
