package com.cabbooking.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    private Long carId;

    @Column(name = "car_model",nullable = false, length = 100)
    private String carModel;

    @Column(name = "license_plate",nullable = false, unique = true, length = 15)
    private String licensePlate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mileage;

    @Column(name = "passenger_capacity",nullable = false)
    private Integer passengerCapacity;

    @Lob
    @Column(name = "car_image")
    private byte[] carImage;  // Car image stored as BLOB

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;

    public enum Status {
        AVAILABLE, BOOKED, MAINTENANCE, INACTIVE
    }
}
