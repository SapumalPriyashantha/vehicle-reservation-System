package com.cabbooking.service;

import com.cabbooking.dto.BookingDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.model.Booking;
import com.cabbooking.model.Car;
import com.cabbooking.model.User;
import com.cabbooking.repository.BookingRepository;
import com.cabbooking.repository.CarRepository;
import com.cabbooking.repository.CustomerRepository;
import com.cabbooking.repository.DriverRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.time.LocalDateTime;
import java.util.Optional;

@Stateless
public class BookingService {

    @Inject
    private BookingRepository bookingRepository;

    @Inject
    private CarRepository carRepository;

    @Inject
    private CustomerRepository customerRepository;

    @Inject
    private DriverRepository driverRepository;

    public ResponseDTO<Object> createBooking(BookingDTO bookingDTO) {
        // Validate Customer
        User user = customerRepository.findActiveCustomerById(bookingDTO.getCustomerId());
        if (user==null) {
            return new ResponseDTO<>(400, "ERROR",  "Customer not found.");
        }

        // Validate Car
        Car car = carRepository.findCarById(bookingDTO.getCarId());
        if (car==null || car.getStatus() != Car.Status.AVAILABLE) {
            return new ResponseDTO<>(400, "ERROR",  "Car is not available.");
        }

        // Check if the car is already booked during the requested period
        if (bookingRepository.isCarBooked(bookingDTO.getCarId(), bookingDTO.getStartTime(), bookingDTO.getEndTime())) {
            return new ResponseDTO<>(400, "ERROR", "Car is already booked for the selected period.");
        }

        // Find an available driver for the booking
        Optional<User> driverOpt = driverRepository.findAvailableDriver(bookingDTO.getStartTime(), bookingDTO.getEndTime());
        if (driverOpt.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR",  "No available drivers.");
        }

        // Create Booking
        Booking booking = new Booking();
        booking.setCustomer(user);
        booking.setDriver(driverOpt.get());
        booking.setCar(car);
        booking.setPickupLocation(bookingDTO.getPickupLocation());
        booking.setDestination(bookingDTO.getDestination());
        booking.setStartTime(bookingDTO.getStartTime());
        booking.setEndTime(bookingDTO.getEndTime());
        booking.setStatus(Booking.Status.PENDING);

        bookingRepository.create(booking);

        return new ResponseDTO<>(201, "SUCCESS", "Booking created successfully!");
    }
}
