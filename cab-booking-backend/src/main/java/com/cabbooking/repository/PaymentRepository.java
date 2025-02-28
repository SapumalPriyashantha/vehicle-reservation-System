package com.cabbooking.repository;

import com.cabbooking.model.Payment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.sql.Timestamp;

@ApplicationScoped
@Transactional
public class PaymentRepository {

    @PersistenceContext
    private EntityManager em;

    public int makePayment(Payment payment) {
        String sql = "INSERT INTO payments (booking_id, amount, extra_amount, tax, discount, payment_date, payment_status, kilometers)\n" +
                "            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return em.createNativeQuery(sql)
                .setParameter(1,  payment.getBooking().getBookingId())
                .setParameter(2, payment.getAmount())
                .setParameter(3,  payment.getExtraAmount())
                .setParameter(4,  payment.getTax())
                .setParameter(5, payment.getDiscount())
                .setParameter(6, Timestamp.valueOf(payment.getPaymentDate()))
                .setParameter(7,  payment.getPaymentStatus().name())
                .setParameter(8, payment.getKilometers())
                .executeUpdate();
    }
}
