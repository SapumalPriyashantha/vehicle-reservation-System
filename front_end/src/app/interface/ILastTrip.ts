import { ReservationStatus } from '../enums/ReservationStatus.enum';
import { IDriver } from './IDriver';
import { IRate } from './IRate';
import { IUser } from './IUser';

export interface ILastTrip {
  amount: string;
  kilometers: number;
  bookingDate: string;
  driverName: string;
  paymentDate: string;
}
