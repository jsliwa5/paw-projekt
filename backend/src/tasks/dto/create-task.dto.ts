export class CreateTaskDto {
  title: string;
  description?: string;
  projectId: number; 
  userId?: number;   
}