import { useState } from "react";
import { Link } from "wouter";
import { Trash2, FolderKanban, Loader2 } from "lucide-react";
import { type Project } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {Restricted} from "@/components/restricted.tsx";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.status === "DONE").length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      if (onDelete) onDelete(project.id);
      await queryClient.invalidateQueries({ queryKey: ["/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card
      className="hover-elevate transition-shadow duration-200 group"
      data-testid={`project-card-${project.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FolderKanban className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-medium truncate">
            <Link
              href={`/projects/${project.id}`}
              className="hover:underline"
              data-testid={`link-project-${project.id}`}
            >
              {project.name}
            </Link>
          </CardTitle>
        </div>
        <Restricted to="MANAGER">
        <AlertDialog>
          <AlertDialogTrigger asChild>


              <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isDeleting}
                  data-testid={`button-delete-project-${project.id}`}
              >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>


          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{project.name}"? This will also
                delete all tasks associated with this project. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </Restricted>

      </CardHeader>
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 h-4">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </Badge>
            {completedTasks > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 h-4 border-green-500/50 text-green-600 dark:text-green-400">
                {completedTasks} completed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
