package com.cabbooking.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BookingDTO {
    private Long customerId;
    private Long carId;
    private String pickupLocation;
    private String destination;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
