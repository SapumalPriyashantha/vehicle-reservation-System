package com.cabbooking.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;  // Can be null if the driver is removed

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(name = "pickup_location",nullable = false, columnDefinition = "TEXT")
    private String pickupLocation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String destination;

    @Column(name = "start_time",nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time",nullable = false)
    private LocalDateTime endTime;

    @Column(name = "booking_date",nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, ONGOING, COMPLETED, CANCELLED
    }
}