import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IUser } from './user.interface';

export interface IUsers extends IPaginate {
  data: IUser[];
}
