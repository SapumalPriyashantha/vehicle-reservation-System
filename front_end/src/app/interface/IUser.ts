import { UserRoles } from "../enums/UserRoles.enum";

export interface IUser {
  address: string;
  name: string;
  nic: string;
  role:string;
  status: string;
  telephone: string;
  userId: number;
  username: string;

  // ----
  id: number;
  email: string;
  mobileNumber: string;
  userName:string;
  password: string;
  userStatus:UserRoles;
  lastLogInDate:string;
  lastLogOutDate:string;
}
