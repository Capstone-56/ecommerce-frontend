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
}

export interface GuestUserModel {
  readonly id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UserSignUpModel extends Omit<UserModel, "id"> {
  id?: string;
  password: string;
}
