package com.cabbooking.service;

import com.cabbooking.dto.PaymentRequestDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.model.Booking;
import com.cabbooking.model.Payment;
import com.cabbooking.repository.BookingRepository;
import com.cabbooking.repository.PaymentRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Stateless
public class PaymentService {
    private static final BigDecimal RATE_PER_KM = new BigDecimal("100"); // Fixed amount per km

    @Inject
    private PaymentRepository paymentRepository;

    @Inject
    private BookingRepository bookingRepository;

    public ResponseDTO<Object> processPayment(PaymentRequestDTO paymentRequest) {
        Booking booking = bookingRepository.findBookingById(paymentRequest.getBookingId());

        if (booking == null) {
            return new ResponseDTO<Object>(400, "ERROR", "Invalid booking ID.");
        }

        if (!booking.getStatus().equals(Booking.Status.PENDING)) {
            return new ResponseDTO<>(400, "ERROR", "Payment can only be processed for completed bookings.");
        }

        // Calculate amount
        BigDecimal baseAmount = paymentRequest.getKilometers().multiply(RATE_PER_KM);
        BigDecimal tax = baseAmount.multiply(new BigDecimal("0.10")); // 10% tax
        BigDecimal discount = baseAmount.multiply(new BigDecimal("0.05")); // 5% discount
        BigDecimal totalAmount = baseAmount.add(paymentRequest.getExtraAmount()).add(tax).subtract(discount);

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(baseAmount);
        payment.setExtraAmount(paymentRequest.getExtraAmount());
        payment.setTax(tax);
        payment.setDiscount(discount);
        payment.setKilometers(paymentRequest.getKilometers());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(Payment.Status.PENDING);

        paymentRepository.makePayment(payment);

        return new ResponseDTO<>(200, "SUCCESS", "Payment processed successfully. Total: " + totalAmount);
    }
}
