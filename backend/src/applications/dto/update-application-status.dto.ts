import { IsIn } from 'class-validator';

export type EmployerSettableStatus = 'VIEWED' | 'INTERVIEW' | 'REJECTED';

export class UpdateApplicationStatusDto {
  @IsIn(['VIEWED', 'INTERVIEW', 'REJECTED'], {
    message: 'status phải là VIEWED, INTERVIEW hoặc REJECTED',
  })
  status!: EmployerSettableStatus;
}
