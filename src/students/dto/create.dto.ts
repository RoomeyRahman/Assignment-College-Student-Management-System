import { OmitType } from '@nestjs/swagger';
import { StudentDto } from './student.dto';
import { IStudent } from '../interfaces';

export class CreateStudentDto
  extends OmitType(StudentDto, [
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<CreateStudentDto>
{
  constructor(data?: IStudent) {
    super(data);
  }
}
