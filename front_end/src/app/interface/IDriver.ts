import { DriverStatus } from "../enums/DriverStatus.enum";

export interface IDriver {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  userName: string;
  password: string;
  licenseNumber: string;
  profileImage: string;
  status: DriverStatus;
  lastLogInDate: string;
  lastLogOutDate: string;
  averageScore:number;
}
