package com.cabbooking.service;

import com.cabbooking.dto.LoginDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.dto.UpdateCustomerDTO;
import com.cabbooking.model.User;
import com.cabbooking.dto.UserRegistrationDTO;
import com.cabbooking.repository.UserRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Stateless
public class UserService {
    @Inject
    private UserRepository userRepository;

    // Register a new customer
    public boolean registerCustomer(UserRegistrationDTO userRegistrationDTO) throws NoSuchAlgorithmException {
        // Check if username or NIC already exists
        if (userRepository.isUsernameExists(userRegistrationDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.isNicExists(userRegistrationDTO.getNic())) {
            throw new RuntimeException("NIC already exists");
        }

        // Encrypt password (use a simple hashing example with SHA-256)
        String encryptedPassword = hashPassword(userRegistrationDTO.getPassword());

        return userRepository.registerCustomer(
                userRegistrationDTO.getUsername(),
                encryptedPassword,
                userRegistrationDTO.getName(),
                userRegistrationDTO.getAddress(),
                userRegistrationDTO.getNic(),
                userRegistrationDTO.getTelephone()
        );
    }

    public ResponseDTO<String> updateCustomer(Long userId, UpdateCustomerDTO dto) throws NoSuchAlgorithmException {
        // Check if user exists
        if (!userRepository.isUserExists(userId)) {
            return new ResponseDTO<>(400, "ERROR", "Customer not found!");
        }

        String passwordHash = dto.getPassword() != null ? hashPassword(dto.getPassword()) : null;

        int rowsUpdated = userRepository.updateCustomer(userId, dto.getName(), dto.getAddress(), dto.getTelephone(), passwordHash);

        if (rowsUpdated > 0) {
            return new ResponseDTO<>(200, "SUCCESS", "Customer updated successfully!");
        } else {
            return new ResponseDTO<>(400, "ERROR", "No fields to update.");
        }
    }

    public ResponseDTO<Object> login(LoginDTO loginDTO) {
        try {

            User user = userRepository.findByUsername(loginDTO.getUsername());

            if (user == null) {
                return new ResponseDTO<>(400, "ERROR",  "User not found!");
            }

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