package com.cabbooking.repository;

import com.cabbooking.model.Booking;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

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

    public List<Object[]> findBookingsByDriverAndStatus(Long driverId, String status) {
        String sql = """
            SELECT 
                b.booking_id, 
                b.pickup_location, 
                b.destination, 
                b.start_time, 
                b.end_time, 
                b.booking_date, 
                b.status,

                -- Customer Details
                c.name, 
                c.username, 
                c.address, 
                c.nic, 
                c.telephone, 
                c.role, 
                c.status AS customer_status,

                -- Car Details
                cr.car_model, 
                cr.license_plate, 
                cr.mileage, 
                cr.passenger_capacity, 
                cr.status AS car_status, 
                cr.car_image

            FROM bookings b
            JOIN users c ON b.customer_id = c.user_id
            JOIN cars cr ON b.car_id = cr.car_id
            WHERE b.driver_id = ? AND b.status = ?
        """;

        return em.createNativeQuery(sql)
                .setParameter(1, driverId)
                .setParameter(2, status)
                .getResultList();
    }
}
