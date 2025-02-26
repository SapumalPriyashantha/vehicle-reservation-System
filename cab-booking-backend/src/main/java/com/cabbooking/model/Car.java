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
    private Long carId;

    @Column(nullable = false, length = 100)
    private String carModel;

    @Column(nullable = false, unique = true, length = 15)
    private String licensePlate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mileage;

    @Column(nullable = false)
    private Integer passengerCapacity;

    @Lob
    private byte[] carImage;  // Car image stored as BLOB

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;

    public enum Status {
        AVAILABLE, BOOKED, MAINTENANCE
    }
}
