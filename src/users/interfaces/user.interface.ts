import { IBase } from '../../common/interfaces'

export interface IUser extends IBase {
  readonly _id?: string;
  readonly email?: string;
  readonly password?: string;
  readonly otp?: number;
  readonly otpExpiresAt?: number;
  readonly emailProofToken?: string;
  readonly emailProofTokenExpiresAt?: number;
  readonly passwordResetToken?: string;
  readonly passwordResetTokenExpiresAt?: number;
  readonly isAdmin?: boolean;
  readonly isSuperAdmin?: boolean;
  readonly isVerified?: boolean;
}
