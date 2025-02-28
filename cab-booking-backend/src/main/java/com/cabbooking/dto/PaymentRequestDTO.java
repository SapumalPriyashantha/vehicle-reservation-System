package com.cabbooking.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class PaymentRequestDTO {
    private Long bookingId;
    private BigDecimal kilometers;
    private BigDecimal extraAmount;
}
