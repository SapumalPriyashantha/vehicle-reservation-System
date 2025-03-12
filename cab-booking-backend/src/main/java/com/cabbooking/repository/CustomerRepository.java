package com.cabbooking.repository;

import com.cabbooking.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
@Transactional
public class CustomerRepository {
    @PersistenceContext(unitName = "MegaCityCabPU")
    private EntityManager em;


    public boolean registerCustomer(String username, String encryptedPassword, String name,
                                    String address, String nic, String telephone) {
        String sql = "INSERT INTO users (username, password_hash, role, name, address, nic, telephone, status) " +
                "VALUES (?, ?, 'CUSTOMER', ?, ?, ?, ?, 'ACTIVE')";
        Query query = em.createNativeQuery(sql);
        query.setParameter(1, username);
        query.setParameter(2, encryptedPassword);
        query.setParameter(3, name);
        query.setParameter(4, address);
        query.setParameter(5, nic);
        query.setParameter(6, telephone);

        return query.executeUpdate() > 0;
    }

    public boolean isUsernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ? AND role = 'CUSTOMER' AND status = 'ACTIVE'";
        Number count = (Number) em.createNativeQuery(sql)
                .setParameter(1, username)
                .getSingleResult();
        return count.intValue() > 0;
    }

    public boolean isNicExists(String nic) {
        String sql = "SELECT COUNT(*) FROM users WHERE nic = ? AND role = 'CUSTOMER' AND status = 'ACTIVE'";
        Number count = (Number) em.createNativeQuery(sql)
                .setParameter(1, nic)
                .getSingleResult();
        return count.intValue() > 0;
    }

    public User findByUsername(String username) {
        try {
            String sql = "SELECT * FROM users WHERE username = ? AND status = 'ACTIVE' LIMIT 1";
            return (User) em.createNativeQuery(sql, User.class)
                    .setParameter(1, username)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public boolean isUserExists(Long userId) {
        String sql = "SELECT COUNT(*) FROM users WHERE user_id = ? AND role = 'CUSTOMER' AND status = 'ACTIVE'";
        Number count = (Number) em.createNativeQuery(sql)
                .setParameter(1, userId)
                .getSingleResult();
        return count.intValue() > 0;
    }

    public int updateCustomer(Long userId, String name, String address, String telephone, String passwordHash) {
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
        if (passwordHash != null) {
            sql.append("password_hash = ?, ");
            hasUpdates = true;
        }

        if (!hasUpdates) {
            return 0;
        }

        sql.setLength(sql.length() - 2);
        sql.append(" WHERE user_id = ?");

        var query = em.createNativeQuery(sql.toString());

        int paramIndex = 1;
        if (name != null) query.setParameter(paramIndex++, name);
        if (address != null) query.setParameter(paramIndex++, address);
        if (telephone != null) query.setParameter(paramIndex++, telephone);
        if (passwordHash != null) query.setParameter(paramIndex++, passwordHash);
        query.setParameter(paramIndex, userId);

        return query.executeUpdate();
    }

    public User findActiveCustomerById(Long userId) {
        String sql = "SELECT * FROM users WHERE user_id = ? AND role = 'CUSTOMER' AND  status = 'ACTIVE'";
        try {
            return (User) em.createNativeQuery(sql, User.class)
                    .setParameter(1, userId)
                    .getSingleResult();
        } catch (Exception e) {
            return null; // Customer not found or not active
        }
    }

    public int deactivateCustomer(Long userId) {
        String sql = "UPDATE users SET status = 'INACTIVE' WHERE user_id = ? AND role = 'CUSTOMER' AND status = 'ACTIVE'";
        return em.createNativeQuery(sql)
                .setParameter(1, userId)
                .executeUpdate();
    }

    public void updatePassword(User user) {
        String sql = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        em.createNativeQuery(sql)
                .setParameter(1, user.getPasswordHash())
                .setParameter(2, user.getUserId())
                .executeUpdate();
    }

    public List<Object[]> getAllUsers() {
        String sql = """
            SELECT user_id, username, name, address, nic, telephone, license_number, role, status, profile_image 
            FROM users WHERE status = 'ACTIVE'
        """;

        try {
            return em.createNativeQuery(sql).getResultList();
        } catch (Exception e) {
            return new ArrayList<>(); // Return an empty list if an error occurs
        }
    }

    public List<Object[]> searchCustomers(String searchText) {
        String sql = """
            SELECT user_id, username, name, address, nic, telephone, license_number, role, status, profile_image
            FROM users WHERE status = 'ACTIVE'
            AND (
                CAST(user_id AS CHAR) LIKE :searchText
                OR username LIKE :searchText
                OR name LIKE :searchText
                OR address LIKE :searchText
                OR nic LIKE :searchText
                OR telephone LIKE :searchText
            )
        """;

        Query query = em.createNativeQuery(sql);
        query.setParameter("searchText", "%" + searchText + "%");

        return query.getResultList();
    }
}
