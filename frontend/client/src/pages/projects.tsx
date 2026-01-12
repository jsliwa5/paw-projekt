import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Loader2 } from "lucide-react";
import { type Project } from "@shared/schema";
import { ProjectCard } from "@/components/project-card";
import { CreateProjectDialog } from "@/components/create-project-dialog";

import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const { data: projectsData = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  const [projects, setProjects] = useState<Project[]>(projectsData);

  useEffect(() => {
    setProjects(projectsData);
  }, [projectsData]);

  // Handler to remove project from local state
  const handleProjectDeleted = (deletedId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">All Projects</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your projects
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first project to get started
            </p>
            <CreateProjectDialog />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            data-testid="projects-grid"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleProjectDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
