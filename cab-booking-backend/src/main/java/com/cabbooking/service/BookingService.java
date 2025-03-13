package com.cabbooking.service;

import com.cabbooking.dto.BookingDTO;
import com.cabbooking.dto.CarDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.dto.UserDTO;
import com.cabbooking.model.Booking;
import com.cabbooking.model.Car;
import com.cabbooking.model.User;
import com.cabbooking.repository.*;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
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

    @Inject
    private PaymentRepository paymentRepository;

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

    public ResponseDTO<Object> getBookingsByCustomerAndStatus(Long customerId, String status) {
        List<Object[]> bookings = bookingRepository.findBookingsByCustomerAndStatus(customerId, status);

        if (bookings.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR", "No bookings found for the given customer and status.");
        }

        List<BookingDTO> bookingDTOList = bookings.stream()
                .map(booking -> new BookingDTO(
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
                        ((Number) booking[0]).longValue(),  // booking_id
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

    public ResponseDTO<Object> getAllBookings() {
        List<Object[]> bookings = bookingRepository.findAllBookings();

        if (bookings.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR", "No bookings found.");
        }

        List<BookingDTO> bookingDTOList = bookings.stream().map(booking -> new BookingDTO(
                ((Number) booking[0]).longValue(),   // booking_id
                (String) booking[1],                // pickup_location
                (String) booking[2],                // destination
                ((java.sql.Timestamp) booking[3]).toLocalDateTime() ,// start_time
                ((java.sql.Timestamp) booking[4]).toLocalDateTime(), // end_time
                ((String) booking[5]), // booking status

                // Customer Details
                new UserDTO(
                        (String) booking[6],   // customer_name
                        (String) booking[7],   // customer_address
                        (String) booking[8],   // customer_telephone
                        (String) booking[9]    // customer_nic
                ),

                // Driver Details (can be null)
                (booking[10] != null) ? new UserDTO(
                        (String) booking[10],  // driver_name
                        (String) booking[11],  // driver_address
                        (String) booking[12],  // driver_telephone
                        (String) booking[13]   // driver_license_number
                ) : null,

                // Car Details
                new CarDTO(
                        (String) booking[14],  // car_model
                        (String) booking[15],  // license_plate
                        ((BigDecimal) booking[16]),  // mileage
                        ((Number) booking[17]).intValue(),  // passenger_capacity
                        (booking[18] != null) ? Base64.getEncoder().encodeToString((byte[]) booking[18]) : null, // car_image
                        (String) booking[19]   // car_status
                )
        )).collect(Collectors.toList());

        return new ResponseDTO<>(200, "SUCCESS", bookingDTOList);
    }

    public ResponseDTO<Object> getAdminDashboardData() {
        Long activePassengers = customerRepository.getActivePassengerCount();
        Long activeDrivers = driverRepository.getActiveDriverCount();
        Long ongoingTrips = bookingRepository.getOngoingTripCount();
        BigDecimal totalRevenue = paymentRepository.getTotalRevenue();
        List<Object[]> lastBookings = paymentRepository.getLastCompletedBookings();

        List<Map<String, Object>> lastBookingList = lastBookings.stream().map(booking -> {
            Map<String, Object> map = new HashMap<>();
            map.put("bookingId", booking[0]);
            map.put("customerName", booking[1]);
            map.put("amount", booking[2]);
            map.put("bookingDate",((java.sql.Timestamp) booking[3]).toLocalDateTime());
            map.put("status", booking[4]);
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("activePassengers", activePassengers);
        responseData.put("activeDrivers", activeDrivers);
        responseData.put("ongoingTrips", ongoingTrips);
        responseData.put("totalRevenue", totalRevenue);
        responseData.put("lastCompletedBookings", lastBookingList);

        return new ResponseDTO<>(200, "SUCCESS", responseData);
    }
}
