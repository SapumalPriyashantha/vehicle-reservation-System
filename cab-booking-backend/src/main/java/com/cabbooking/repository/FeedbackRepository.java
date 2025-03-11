package com.cabbooking.repository;

import com.cabbooking.model.Feedback;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.sql.Timestamp;
import java.util.List;


@ApplicationScoped
@Transactional
public class FeedbackRepository {

    @PersistenceContext
    private EntityManager em;

    public int save(Feedback feedback) {
        String sql = "INSERT INTO feedback (booking_id, customer_id, driver_id, rating, comments, feedback_date) VALUES (?, ?, ?, ?, ?, ?)";

        return em.createNativeQuery(sql)
                .setParameter(1,  feedback.getBooking().getBookingId())
                .setParameter(2, feedback.getCustomer().getUserId())
                .setParameter(3, feedback.getDriver().getUserId())
                .setParameter(4,  feedback.getRating())
                .setParameter(5, feedback.getComments())
                .setParameter(6, java.sql.Timestamp.valueOf(feedback.getFeedbackDate()))
                .executeUpdate();
    }

    public List<Object[]> findFeedbacksByBooking(Long bookingId) {
        String sql = """
            SELECT 
                f.feedback_id, f.booking_id, 
                c.name AS customer_name, d.name AS driver_name,
                f.rating, f.comments, f.feedback_date
            FROM feedback f
            JOIN users c ON f.customer_id = c.user_id
            JOIN users d ON f.driver_id = d.user_id
            WHERE f.booking_id = ?
        """;

        return em.createNativeQuery(sql)
                .setParameter(1, bookingId)
                .getResultList();
    }
}
