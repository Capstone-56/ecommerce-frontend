export interface GuestUserModel {
  readonly id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}