package com.cabbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarDTO {
    private Long carId;
    private String carModel;
    private String licensePlate;
    private BigDecimal mileage;
    private Integer passengerCapacity;
    private String status;
    private String carImageBase64;

    public CarDTO(String carModel, String licensePlate, BigDecimal mileage, int passengerCapacity,
                  String carImageBase64, String status) {
        this.carModel = carModel;
        this.licensePlate = licensePlate;
        this.mileage = mileage;
        this.passengerCapacity = passengerCapacity;
        this.carImageBase64 = carImageBase64;
        this.status = status;
    }
}