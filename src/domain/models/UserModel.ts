// Corresponding backend model: UserModel.py
import { Role } from "@/domain/enum/role";

export interface UserModel {
  readonly id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  dateOfBirth: string | null;
  gender: "male" | "female" | null;
  mfaEnabled: boolean;
}

export interface GuestUserModel {
  readonly id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UserSignUpModel extends Omit<UserModel, "id" | "role" | "mfaEnabled"> {
  password: string;
}

export type AuthenticationResponseModel = {
  readonly id: string;
  readonly username: string;
  readonly role: Role;
  readonly mfaEnabled: boolean;
};
