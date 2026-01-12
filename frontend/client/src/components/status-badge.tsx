import { type TaskStatusType, TaskStatus } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle, PauseCircle } from "lucide-react";

interface StatusBadgeProps {
  status: TaskStatusType;
}

const statusConfig: Record<TaskStatusType, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock; className: string }> = {
  [TaskStatus.TODO]: {
    label: "To Do",
    variant: "secondary",
    icon: Clock,
    className: "bg-muted text-muted-foreground",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    variant: "default",
    icon: Play,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  [TaskStatus.FINISHED]: {
    label: "Finished",
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  [TaskStatus.PAUSED]: {
    label: "Paused",
    variant: "destructive",
    icon: PauseCircle,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1 border-transparent`}
      data-testid={`badge-status-${status.toLowerCase()}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
