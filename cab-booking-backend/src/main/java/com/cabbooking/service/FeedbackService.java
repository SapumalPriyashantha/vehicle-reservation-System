package com.cabbooking.service;

import com.cabbooking.dto.FeedbackRequestDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.model.Booking;
import com.cabbooking.model.Feedback;
import com.cabbooking.repository.BookingRepository;
import com.cabbooking.repository.FeedbackRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.time.LocalDateTime;

@Stateless
public class FeedbackService {

    @Inject
    private FeedbackRepository feedbackRepository;

    @Inject
    private BookingRepository bookingRepository;

    public ResponseDTO<Object> submitFeedback(FeedbackRequestDTO request) {
        Booking booking = bookingRepository.findBookingById(request.getBookingId());
        if (booking == null ) {
            return new ResponseDTO<>(400, "ERROR", "Invalid or incomplete booking.");
        }


        if (request.getRating() < 1 || request.getRating() > 5) {
            return new ResponseDTO<>(400, "ERROR", "Rating must be between 1 and 5.");
        }

        Feedback feedback = new Feedback();
        feedback.setBooking(booking);
        feedback.setCustomer(booking.getCustomer());
        feedback.setDriver(booking.getDriver());
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());
        feedback.setFeedbackDate(LocalDateTime.now());

        feedbackRepository.save(feedback);
        return new ResponseDTO<>(200, "SUCCESS", "Feedback submitted successfully.");
    }
}
