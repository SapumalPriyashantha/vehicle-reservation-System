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
    private String carImageBase64; // Base64-encoded image string
}