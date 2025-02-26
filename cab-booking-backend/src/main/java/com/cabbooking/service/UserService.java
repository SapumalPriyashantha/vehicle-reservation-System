package com.cabbooking.service;

import com.cabbooking.dto.LoginDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.dto.UpdateCustomerDTO;
import com.cabbooking.model.User;
import com.cabbooking.dto.UserRegistrationDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@ApplicationScoped
public class UserService {

    @PersistenceContext(unitName = "MegaCityCabPU")
    private EntityManager em;

    // Register a new customer
    @Transactional
    public boolean registerCustomer(UserRegistrationDTO userRegistrationDTO) throws NoSuchAlgorithmException {
        // Check if username or NIC already exists
        if (isUsernameExists(userRegistrationDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (isNicExists(userRegistrationDTO.getNic())) {
            throw new RuntimeException("NIC already exists");
        }

        // Encrypt password (use a simple hashing example with SHA-256)
        String encryptedPassword = hashPassword(userRegistrationDTO.getPassword());

        String sql = "INSERT INTO users (username, password_hash, role, name, address, nic, telephone, status) " +
                "VALUES (?, ?, 'CUSTOMER', ?, ?, ?, ?, 'ACTIVE')";
        Query query = em.createNativeQuery(sql);
        query.setParameter(1, userRegistrationDTO.getUsername());
        query.setParameter(2, encryptedPassword);
        query.setParameter(3, userRegistrationDTO.getName());
        query.setParameter(4, userRegistrationDTO.getAddress());
        query.setParameter(5, userRegistrationDTO.getNic());
        query.setParameter(6, userRegistrationDTO.getTelephone());

        return query.executeUpdate() > 0;
    }

    @Transactional
    public ResponseDTO<String> updateCustomer(Long userId, UpdateCustomerDTO dto) throws NoSuchAlgorithmException {
        // Check if user exists
        String checkSql = "SELECT COUNT(*) FROM users WHERE user_id = ?";
        Number count = (Number) em.createNativeQuery(checkSql)
                .setParameter(1, userId)
                .getSingleResult();

        if (count.intValue() == 0) {
            throw new NotFoundException("Customer not found!");
        }

        // Build the update query dynamically
        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        boolean hasUpdates = false;

        if (dto.getName() != null) {
            sql.append("name = ?, ");
            hasUpdates = true;
        }
        if (dto.getAddress() != null) {
            sql.append("address = ?, ");
            hasUpdates = true;
        }
        if (dto.getTelephone() != null) {
            sql.append("telephone = ?, ");
            hasUpdates = true;
        }
        if (dto.getPassword() != null) {
            sql.append("password_hash = ?, ");
            hasUpdates = true;
        }

        // Remove trailing comma and add WHERE condition
        if (!hasUpdates) {
            return new ResponseDTO<>(400, "ERROR", "No fields to update.");
        }
        sql.setLength(sql.length() - 2); // Remove last comma
        sql.append(" WHERE user_id = ?");

        // Create query and set parameters
        var query = em.createNativeQuery(sql.toString());

        int paramIndex = 1;
        if (dto.getName() != null) query.setParameter(paramIndex++, dto.getName());
        if (dto.getAddress() != null) query.setParameter(paramIndex++, dto.getAddress());
        if (dto.getTelephone() != null) query.setParameter(paramIndex++, dto.getTelephone());
        if (dto.getPassword() != null)
            query.setParameter(paramIndex++, hashPassword(dto.getPassword())); // Ideally, hash before storing
        query.setParameter(paramIndex, userId);

        int rowsUpdated = query.executeUpdate();
        if (rowsUpdated > 0) {
            return new ResponseDTO<>(200, "SUCCESS", "Customer updated successfully!");
        } else {
            return new ResponseDTO<>(500, "ERROR", "Update failed. Try again.");
        }
    }

    @Transactional
    public ResponseDTO<Object> login(LoginDTO loginDTO) {
        try {
            // Fetch the user with native query
            String sql = "SELECT * FROM users WHERE username = ? LIMIT 1";
            User user = (User) em.createNativeQuery(sql, User.class)
                    .setParameter(1, loginDTO.getUsername())
                    .getSingleResult();

            // Compare passwords (Assuming stored password is already hashed)
            if (!verifyPassword(hashPassword(loginDTO.getPassword()), user.getPasswordHash())) {
                return new ResponseDTO<>(401, "ERROR", "Invalid credentials!");
            }

            // Generate a dummy token (Replace with JWT in production)
            String token = generateToken(loginDTO.getUsername());

            return new ResponseDTO<Object>(200, "SUCCESS", user);
        } catch (NoResultException e) {
            return new ResponseDTO<>(400, "ERROR", "User not found!");
        } catch (Exception e) {
            return new ResponseDTO<>(500, "ERROR", "Unexpected error occurred.");
        }
    }

    // Check if username already exists in the database
    private boolean isUsernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Query query = em.createNativeQuery(sql);
        query.setParameter(1, username);

        Number count = (Number) query.getSingleResult();
        return count.intValue() > 0;
    }

    // Check if NIC already exists in the database
    private boolean isNicExists(String nic) {
        String sql = "SELECT COUNT(*) FROM users WHERE nic = ?";
        Query query = em.createNativeQuery(sql);
        query.setParameter(1, nic);

        Number count = (Number) query.getSingleResult();
        return count.intValue() > 0;
    }

    // Simulated password verification (Replace with hashing logic in real app)
    private boolean verifyPassword(String enteredPassword, String storedPassword) {
        return enteredPassword.equals(storedPassword);
    }

    // Simulated token generation (Use JWT or another secure method in real app)
    private String generateToken(String username) {
        return "token_" + username + "_" + System.currentTimeMillis();
    }

    // Hash the password using SHA-256
    private String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(password.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}