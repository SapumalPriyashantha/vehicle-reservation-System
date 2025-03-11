package com.cabbooking.service;

import com.cabbooking.dto.BookingDTO;
import com.cabbooking.dto.CarDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.dto.UserDTO;
import com.cabbooking.model.Booking;
import com.cabbooking.model.Car;
import com.cabbooking.model.User;
import com.cabbooking.repository.BookingRepository;
import com.cabbooking.repository.CarRepository;
import com.cabbooking.repository.CustomerRepository;
import com.cabbooking.repository.DriverRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public ResponseDTO<Object> getBookingsByDriverAndStatus(Long driverId, String status) {
        List<Object[]> bookings = bookingRepository.findBookingsByDriverAndStatus(driverId, status);

        if (bookings.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR", "No bookings found for the given driver and status.");
        }

        List<BookingDTO> bookingDTOList = bookings.stream()
                .map(booking -> new BookingDTO(
                        ((Number) booking[0]).longValue(),  // booking_id
                        new UserDTO(
                                null,
                                (String) booking[8],   // username
                                (String) booking[7],   // name
                                (String) booking[9],   // address
                                (String) booking[10],  // nic
                                (String) booking[11],  // telephone
                                null,
                                (String) booking[12],  // role
                                (String) booking[13],   // customer_status
                                null
                        ),
                        new CarDTO(
                                null,
                                (String) booking[14],  // car_model
                                (String) booking[15],  // license_plate
                                (BigDecimal) booking[16],  // mileage
                                ((Number) booking[17]).intValue(),  // passenger_capacity
                                (String) booking[18],  // car_status
                                (booking[19] != null) ? Base64.getEncoder().encodeToString((byte[]) booking[19]) : null // car_image
                        ),
                        null,
                        null,
                        (String) booking[1],   // pickup_location
                        (String) booking[2],   // destination
                        ((java.sql.Timestamp) booking[3]).toLocalDateTime(), // start_time
                        ((java.sql.Timestamp) booking[4]).toLocalDateTime(), // end_time
                        ((java.sql.Timestamp) booking[5]).toLocalDateTime(), // booking_date
                        (String) booking[6]    // status
                ))
                .collect(Collectors.toList());

        return new ResponseDTO<>(200, "SUCCESS", bookingDTOList);
    }

    public ResponseDTO<Object> startTrip(Long bookingId) {
        Booking booking = bookingRepository.findBookingById(bookingId);

        if (booking == null) {
            return new ResponseDTO<>(400, "ERROR", "Booking not found.");
        }

        if (!booking.getStatus().equals(Booking.Status.PENDING)) {
            return new ResponseDTO<>(400, "ERROR", "Trip cannot be started. Booking is not in PENDING status.");
        }

        Car car = booking.getCar();
        if (car == null) {
            return new ResponseDTO<>(400, "ERROR", "Car not assigned to booking.");
        }

        // Update statuses
        booking.setStatus(Booking.Status.ONGOING);
        car.setStatus(Car.Status.BOOKED);

        // Save updates
        bookingRepository.updateBookingStatus(booking);
        carRepository.updateCarStatus(car);

        return new ResponseDTO<>(200, "SUCCESS", "Trip started successfully.");
    }
}
