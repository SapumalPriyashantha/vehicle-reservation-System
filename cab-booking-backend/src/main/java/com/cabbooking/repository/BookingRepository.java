package com.cabbooking.repository;

import com.cabbooking.model.Booking;
import com.cabbooking.model.User;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

import java.awt.print.Book;
import java.time.LocalDateTime;
import java.util.List;

@Stateless
public class BookingRepository {

    @PersistenceContext
    private EntityManager em;

    public void create(Booking booking) {
        em.persist(booking);
    }

    public boolean isCarBooked(Long carId, LocalDateTime startTime, LocalDateTime endTime) {
        String sql = "SELECT COUNT(*) FROM bookings " +
                "WHERE car_id = :carId AND status IN ('PENDING', 'ONGOING') " +
                "AND ((:startTime BETWEEN start_time AND end_time) " +
                "OR (:endTime BETWEEN start_time AND end_time) " +
                "OR (start_time BETWEEN :startTime AND :endTime))";

        Number count = (Number) em.createNativeQuery(sql)
                .setParameter("carId", carId)
                .setParameter("startTime", startTime)
                .setParameter("endTime", endTime)
                .getSingleResult();

        return count.intValue() > 0;
    }

    public Booking findBookingById(Long bookingId) {
        try {
            String sql = "SELECT * FROM bookings WHERE booking_id = ?";
            return (Booking) em.createNativeQuery(sql, Booking.class)
                    .setParameter(1, bookingId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
