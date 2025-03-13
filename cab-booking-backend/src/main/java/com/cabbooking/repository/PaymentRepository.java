package com.cabbooking.repository;

import com.cabbooking.model.Payment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

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

    public BigDecimal getTotalRevenue() {
        String sql = "SELECT COALESCE(SUM(total_amount), 0) FROM payments WHERE payment_status = 'PAID'";
        return (BigDecimal) em.createNativeQuery(sql).getSingleResult();
    }

    public List<Object[]> getLastCompletedBookings() {
        String sql = """
            SELECT b.booking_id, u.name AS customer_name, p.total_amount, b.booking_date, b.status
            FROM bookings b
            JOIN users u ON b.customer_id = u.user_id
            JOIN payments p ON b.booking_id = p.booking_id
            WHERE b.status = 'COMPLETED' AND p.payment_status = 'PAID'
            ORDER BY b.booking_date DESC
            LIMIT 5
        """;

        return em.createNativeQuery(sql).getResultList();
    }

    public List<Object[]> getAllPayments(LocalDate fromDate, LocalDate toDate) {
        String sql = """
            SELECT p.payment_date, d.name AS driver_name, p.payment_status, p.payment_date, p.total_amount
            FROM payments p
            JOIN bookings b ON p.booking_id = b.booking_id
            JOIN users d ON b.driver_id = d.user_id
            WHERE DATE(p.payment_date) BETWEEN :fromDate AND :toDate
            ORDER BY p.payment_date DESC
        """;

        return em.createNativeQuery(sql)
                .setParameter("fromDate", fromDate)
                .setParameter("toDate", toDate)
                .getResultList();
    }

}
