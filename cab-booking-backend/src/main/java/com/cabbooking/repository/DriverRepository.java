package com.cabbooking.repository;

import com.cabbooking.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
@Transactional
public class DriverRepository {

    @PersistenceContext
    private EntityManager em;

    public boolean registerDriver(String username, String passwordHash, String name, String address,
                                  String nic, String telephone, String licenseNumber, byte[] profileImage) {
        String sql = "INSERT INTO users (username, password_hash, role, name, address, nic, telephone, license_number, profile_image, status) " +
                "VALUES (?, ?, 'DRIVER', ?, ?, ?, ?, ?, ?, 'ACTIVE')";
        var query = em.createNativeQuery(sql);
        query.setParameter(1, username);
        query.setParameter(2, passwordHash);
        query.setParameter(3, name);
        query.setParameter(4, address);
        query.setParameter(5, nic);
        query.setParameter(6, telephone);
        query.setParameter(7, licenseNumber);
        query.setParameter(8, profileImage);

        return query.executeUpdate() > 0;
    }

    public boolean isDriverExists(Long userId) {
        String sql = "SELECT COUNT(*) FROM users WHERE user_id = ? AND role = 'DRIVER' AND status = 'ACTIVE'";
        Number count = (Number) em.createNativeQuery(sql)
                .setParameter(1, userId)
                .getSingleResult();
        return count.intValue() > 0;
    }

    public boolean updateDriver(Long userId, String name, String address, String telephone, String licenseNumber,
                                String passwordHash, byte[] profileImage) {
        // Build update query dynamically
        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        boolean hasUpdates = false;

        if (name != null) {
            sql.append("name = ?, ");
            hasUpdates = true;
        }
        if (address != null) {
            sql.append("address = ?, ");
            hasUpdates = true;
        }
        if (telephone != null) {
            sql.append("telephone = ?, ");
            hasUpdates = true;
        }
        if (licenseNumber != null) {
            sql.append("license_number = ?, ");
            hasUpdates = true;
        }
        if (passwordHash != null) {
            sql.append("password_hash = ?, ");
            hasUpdates = true;
        }
        if (profileImage != null) {
            sql.append("profile_image = ?, ");
            hasUpdates = true;
        }

        // If no fields are updated, return false
        if (!hasUpdates) return false;

        // Remove trailing comma and add WHERE condition
        sql.setLength(sql.length() - 2);
        sql.append(" WHERE user_id = ?");

        var query = em.createNativeQuery(sql.toString());

        int paramIndex = 1;
        if (name != null) query.setParameter(paramIndex++, name);
        if (address != null) query.setParameter(paramIndex++, address);
        if (telephone != null) query.setParameter(paramIndex++, telephone);
        if (licenseNumber != null) query.setParameter(paramIndex++, licenseNumber);
        if (passwordHash != null) query.setParameter(paramIndex++, passwordHash);
        if (profileImage != null) query.setParameter(paramIndex++, profileImage);
        query.setParameter(paramIndex, userId);

        return query.executeUpdate() > 0;
    }

    public User findActiveDriverById(Long userId) {
        String sql = "SELECT * FROM users WHERE user_id = ? AND role = 'DRIVER' AND status = 'ACTIVE'";
        try {
            return (User) em.createNativeQuery(sql, User.class)
                    .setParameter(1, userId)
                    .getSingleResult();
        } catch (Exception e) {
            return null; // Customer not found or not active
        }
    }

    public int deactivateDriver(Long userId) {
        String sql = "UPDATE users SET status = 'INACTIVE' WHERE user_id = ? AND role = 'DRIVER' AND status = 'ACTIVE'";
        return em.createNativeQuery(sql)
                .setParameter(1, userId)
                .executeUpdate();
    }

    public Optional<User> findAvailableDriver(LocalDateTime startTime, LocalDateTime endTime) {
        String sql = "SELECT * FROM users u " +
                "WHERE u.role = 'DRIVER' AND u.status = 'ACTIVE' " +
                "AND NOT EXISTS (SELECT 1 FROM bookings b " +
                "WHERE b.driver_id = u.user_id " +
                "AND b.status IN ('PENDING', 'ONGOING') " +
                "AND ((:startTime BETWEEN b.start_time AND b.end_time) " +
                "OR (:endTime BETWEEN b.start_time AND b.end_time) " +
                "OR (b.start_time BETWEEN :startTime AND :endTime))) " +
                "LIMIT 1";

        List<User> result = em.createNativeQuery(sql, User.class)
                .setParameter("startTime", startTime)
                .setParameter("endTime", endTime)
                .getResultList();

        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }
}
