package com.cabbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDTO {
    private Long feedbackId;
    private Long bookingId;
    private String customerName;
    private String driverName;
    private Integer rating;
    private String comments;
    private LocalDateTime feedbackDate;
}
