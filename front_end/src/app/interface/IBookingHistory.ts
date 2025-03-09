import { ReservationStatus } from '../enums/ReservationStatus.enum';
import { IRate } from './IRate';

export interface IBookingHistory {
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
  status: ReservationStatus;
}
