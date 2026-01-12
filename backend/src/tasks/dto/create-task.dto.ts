import { IsEnum, IsISO8601, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority } from '../entities/priority.enum'; // Import twojego Enuma

export class CreateTaskDto {
  @ApiProperty({ example: 'Naprawić logowanie' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Opis zadania...' })
  @IsOptional()
  @IsString()
  description?: string;

  // --- NOWE POLE: PRIORITY ---
  @ApiProperty({ 
    enum: Priority, 
    description: 'Priorytet zadania', 
    example: Priority.MEDIUM 
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  // --- NOWE POLE: DUE DATE ---
  @ApiPropertyOptional({ 
    description: 'Termin wykonania (ISO 8601 string)', 
    example: '2025-12-24T12:00:00Z' 
  })
  @IsOptional()
  @IsISO8601() // Sprawdza czy string jest datą (np. "2024-01-01")
  dueDate?: string;

  @ApiProperty()
  @IsNotEmpty()
  projectId: number;

  @ApiPropertyOptional()
  @IsOptional()
  userId?: number;
}
