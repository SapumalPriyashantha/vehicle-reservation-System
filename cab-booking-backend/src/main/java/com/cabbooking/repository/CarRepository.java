package com.cabbooking.repository;

import com.cabbooking.model.Car;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
@Transactional
public class CarRepository {

    @PersistenceContext
    private EntityManager em;

    public int addCar(String carModel, String licensePlate,
                      BigDecimal mileage, Integer passengerCapacity, byte[] carImage) {
        String sql = "INSERT INTO cars (car_model, license_plate, mileage, passenger_capacity, car_image, status) " +
                "VALUES (?, ?, ?, ?, ?, 'AVAILABLE')";
        return em.createNativeQuery(sql)
                .setParameter(1, carModel)
                .setParameter(2, licensePlate)
                .setParameter(3, mileage)
                .setParameter(4, passengerCapacity)
                .setParameter(5, carImage)
                .executeUpdate();
    }

    public int updateCar(Long carId, String carModel, String licensePlate,
                         BigDecimal mileage, Integer passengerCapacity, byte[] carImage) {
        StringBuilder sql = new StringBuilder("UPDATE cars SET ");
        boolean hasUpdates = false;

        if (carModel != null) {
            sql.append("car_model = ?, ");
            hasUpdates = true;
        }
        if (licensePlate != null) {
            sql.append("license_plate = ?, ");
            hasUpdates = true;
        }
        if (mileage != null) {
            sql.append("mileage = ?, ");
            hasUpdates = true;
        }
        if (passengerCapacity != null) {
            sql.append("passenger_capacity = ?, ");
            hasUpdates = true;
        }
        if (carImage != null) {
            sql.append("car_image = ?, ");
            hasUpdates = true;
        }

        if (!hasUpdates) {
            return 0; // No fields to update
        }

        sql.setLength(sql.length() - 2); // Remove trailing comma
        sql.append(" WHERE car_id = ?");

        var query = em.createNativeQuery(sql.toString());

        int paramIndex = 1;
        if (carModel != null) query.setParameter(paramIndex++, carModel);
        if (licensePlate != null) query.setParameter(paramIndex++, licensePlate);
        if (mileage != null) query.setParameter(paramIndex++, mileage);
        if (passengerCapacity != null) query.setParameter(paramIndex++, passengerCapacity);
        if (carImage != null) query.setParameter(paramIndex++, carImage);
        query.setParameter(paramIndex, carId);

        return query.executeUpdate();
    }

    public Car findCarById(Long carId) {
        String sql = "SELECT * FROM cars WHERE car_id = ? AND status != 'INACTIVE';";
        try {
            return (Car) em.createNativeQuery(sql, Car.class)
                    .setParameter(1, carId)
                    .getSingleResult();
        } catch (Exception e) {
            return null; // Customer not found or not active
        }
    }

    public boolean updateCarStatusToInactive(Long carId) {
        String sql = "UPDATE cars SET status = 'INACTIVE' WHERE car_id = ? AND status != 'INACTIVE'";
        var query = em.createNativeQuery(sql);
        query.setParameter(1, carId);
        return query.executeUpdate() > 0;
    }

    public List<Car> findAvailableCars(LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            SELECT c.* FROM cars c
            WHERE c.status = 'AVAILABLE' 
            AND c.car_id NOT IN (
                SELECT b.car_id FROM bookings b
                WHERE b.status IN ('PENDING', 'ONGOING')
                AND (b.start_time BETWEEN ? AND ? OR b.end_time BETWEEN ? AND ? OR ? BETWEEN b.start_time AND b.end_time)
            )
        """;

        return em.createNativeQuery(sql, Car.class)
                .setParameter(1, fromDate)
                .setParameter(2, toDate)
                .setParameter(3, fromDate)
                .setParameter(4, toDate)
                .setParameter(5, fromDate)
                .getResultList();
    }

    public List<Object[]> getAllCars() {
        String sql = """
            SELECT car_id, car_model, license_plate, mileage, passenger_capacity, car_image, status 
            FROM cars
        """;

        try {
            return em.createNativeQuery(sql).getResultList();
        } catch (Exception e) {
            return new ArrayList<>(); // Return an empty list if an error occurs
        }
    }
}
