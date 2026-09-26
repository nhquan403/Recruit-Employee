import { IsOptional, IsString } from 'class-validator';

export class RejectJobDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
