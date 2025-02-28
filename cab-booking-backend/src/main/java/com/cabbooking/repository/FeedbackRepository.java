package com.cabbooking.repository;

import com.cabbooking.model.Feedback;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.sql.Timestamp;


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
}
