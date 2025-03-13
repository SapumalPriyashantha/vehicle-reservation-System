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

    public List<Object[]> findBookingsByCustomerAndStatus(Long customerId, String status) {
        String sql = """
            SELECT 
                b.booking_id, 
                b.pickup_location, 
                b.destination, 
                b.start_time, 
                b.end_time, 
                b.booking_date, 
                b.status,

                -- Driver Details
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
            JOIN users c ON b.driver_id = c.user_id
            JOIN cars cr ON b.car_id = cr.car_id
            WHERE b.customer_id = ? AND b.status = ?
        """;

        return em.createNativeQuery(sql)
                .setParameter(1, customerId)
                .setParameter(2, status)
                .getResultList();
    }

    public List<Object[]> findAllBookings() {
        String sql = """
            SELECT 
                b.booking_id, b.pickup_location, b.destination, b.start_time, b.end_time, b.status,

                -- Customer details
                c.name AS customer_name, c.address AS customer_address, 
                c.telephone AS customer_telephone, c.nic AS customer_nic,

                -- Driver details (can be null)
                d.name AS driver_name, d.address AS driver_address, 
                d.telephone AS driver_telephone, d.license_number AS driver_license_number,

                -- Car details
                car.car_model, car.license_plate, car.mileage, 
                car.passenger_capacity, car.car_image, car.status AS car_status

            FROM bookings b
            JOIN users c ON b.customer_id = c.user_id
            LEFT JOIN users d ON b.driver_id = d.user_id
            JOIN cars car ON b.car_id = car.car_id
        """;

        return em.createNativeQuery(sql).getResultList();
    }

    public void updateBookingStatus(Booking booking) {
        String sql = "UPDATE bookings SET status = ? WHERE booking_id = ?";
        em.createNativeQuery(sql)
                .setParameter(1, booking.getStatus().name())
                .setParameter(2, booking.getBookingId())
                .executeUpdate();
    }

    public Long getOngoingTripCount() {
        String sql = "SELECT COUNT(*) FROM bookings WHERE status = 'ONGOING'";
        return ((Number) em.createNativeQuery(sql).getSingleResult()).longValue();
    }
}
