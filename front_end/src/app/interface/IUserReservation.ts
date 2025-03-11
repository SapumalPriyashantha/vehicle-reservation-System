export interface IUserReservation {
  customerId: number;
  carId: number;
  pickupLocation: string;
  destination: string;
  startTime: string;
  endTime: string;
}
