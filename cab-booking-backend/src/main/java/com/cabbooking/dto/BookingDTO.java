package com.cabbooking.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BookingDTO {
    private Long bookingId;
    private UserDTO customer;
    private UserDTO driver;
    private CarDTO car;
    private Long customerId;
    private Long driverId;
    private Long carId;
    private String pickupLocation;
    private String destination;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime bookingDate;
    private String status;

    public BookingDTO(Long bookingId, UserDTO userDTO, CarDTO carDTO, Long customer, Long car, String pickupLocation, String destination,
                      LocalDateTime startTime, LocalDateTime endTime, LocalDateTime bookingDate, String status) {
        this.bookingId = bookingId;
        this.customer = userDTO;
        this.car = carDTO;
        this.customerId = customer;
        this.carId = car;
        this.pickupLocation = pickupLocation;
        this.destination = destination;
        this.startTime = startTime;
        this.endTime = endTime;
        this.bookingDate = bookingDate;
        this.status = status;
    }

    public BookingDTO(UserDTO userDTO, CarDTO carDTO,Long bookingId,  Long driver, Long car, String pickupLocation, String destination,
                      LocalDateTime startTime, LocalDateTime endTime, LocalDateTime bookingDate, String status) {
        this.bookingId = bookingId;
        this.driver = userDTO;
        this.car = carDTO;
        this.driverId = driver;
        this.carId = car;
        this.pickupLocation = pickupLocation;
        this.destination = destination;
        this.startTime = startTime;
        this.endTime = endTime;
        this.bookingDate = bookingDate;
        this.status = status;
    }
}
