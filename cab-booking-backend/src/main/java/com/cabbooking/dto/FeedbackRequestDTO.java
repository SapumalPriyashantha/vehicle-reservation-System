package com.cabbooking.dto;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class FeedbackRequestDTO {
    private Long bookingId;
    private Integer rating;
    private String comments;
}