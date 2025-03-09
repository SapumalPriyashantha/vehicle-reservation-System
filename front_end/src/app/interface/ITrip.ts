import { ReservationStatus } from "../enums/ReservationStatus.enum";
import { IDriver } from "./IDriver";
import { IRate } from "./IRate";
import { IUser } from "./IUser";

export interface ITrip {
  id: number;
  userDto: IUser;
  driverDto: IDriver;
  reveredTime: string;
  paymentAmount: number;
  pickupLatitude:number;
  pickupLongitude: number;
  dropLatitude: number;
  dropLongitude: number;
  status: ReservationStatus;
  ratingDto:IRate;
}
