import { OmitType } from '@nestjs/swagger';
import { StudentDto } from './student.dto';
import { IStudent } from '../interfaces';

export class UpdateStudentDto
    extends OmitType(StudentDto, [
        'studentId',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateStudentDto> {
    constructor(data?: IStudent) {
        super(data);
    }
}
