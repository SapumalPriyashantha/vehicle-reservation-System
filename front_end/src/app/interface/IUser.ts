import { UserRoles } from "../enums/UserRoles.enum";

export interface IUser {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  userName:string;
  password: string;
  role:string;
  userStatus:UserRoles;
  lastLogInDate:string;
  lastLogOutDate:string;
}
