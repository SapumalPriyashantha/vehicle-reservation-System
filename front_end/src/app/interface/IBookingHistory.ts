import { ReservationStatus } from '../enums/ReservationStatus.enum';
import { ICar } from './ICar';
import { IRate } from './IRate';
import { IUser } from './IUser';

export interface IBookingHistory {
  bookingDate: string;
  bookingId: number;
  car: ICar;
  destination: string;
  driver: IUser;
  customer: IUser;
  endTime: string;
  pickupLocation: string;
  startTime: string;
  status: ReservationStatus;

  // ---------
  id: number;
  amount: number;
  distance: number;
  driverName: string;
  driverImage: string;
  driverId: number;
  dropLatitude: number;
  dropLongitude: number;
  pickupLatitude: number;
  pickupLongitude: number;
  rating: IRate;
  reveredTime: string;
}
