import {
    IsMongoId,
    IsString,
    ValidateNested,
    IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    BaseDto,
} from '../../common/dto';
import { IStudent } from '../interfaces';

export class StudentDto extends BaseDto implements Readonly<StudentDto> {
    @ApiProperty()
    studentId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    age: number;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    course: string;

    @ApiProperty()
    hobby: string;

    @ApiProperty()
    admissionDate: number;

    constructor(data?: IStudent) {
        super(data);
        if (data) {
            data.studentId && (this.studentId = data.studentId);
            data.name && (this.name = data.name);
            data.age && (this.age = data.age);
            data.gender && (this.gender = data.gender);
            data.course && (this.course = data.course);
            data.hobby && (this.hobby = data.hobby);
            data.admissionDate && (this.admissionDate = data.admissionDate);
        }
    }
}
