import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '../../common/schemas';

export type StudentDocument = Student & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Student extends Base {
  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  course: string;

  @Prop()
  hobby: string;

  @Prop()
  admissionDate: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
