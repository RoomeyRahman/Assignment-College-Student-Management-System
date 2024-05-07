import { IBase, IPaginate } from '../../common/interfaces';

export interface IStudent extends IBase {
    readonly _id?: string;
    readonly studentId?: string;
    readonly name?: string;
    readonly age?: number;
    readonly gender?: string;
    readonly course?: string;
    readonly hobby?: string;
    readonly admissionDate?: number;
}

export interface IStudents extends IPaginate {
    data: IStudent[];
}
