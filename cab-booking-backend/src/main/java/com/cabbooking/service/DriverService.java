package com.cabbooking.service;

import com.cabbooking.dto.*;
import com.cabbooking.model.User;
import com.cabbooking.repository.CustomerRepository;
import com.cabbooking.repository.DriverRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Driver;
import java.util.Base64;
import java.util.UUID;

import static com.cabbooking.util.Util.*;

@Stateless
public class DriverService {

    @Inject
    private CustomerRepository customerRepository;

    @Inject
    private DriverRepository driverRepository;

    public ResponseDTO<String> registerDriver(DriverRegistrationDTO dto) throws NoSuchAlgorithmException {
        String username = generateUsername(dto.getName());

        // Ensure unique username
        while (customerRepository.isUsernameExists(username)) {
            username = username + (int) (Math.random() * 1000);
        }

        // Check if NIC already exists
        if (customerRepository.isNicExists(dto.getNic())) {
            return new ResponseDTO<>(400, "ERROR", "NIC already exists.");
        }

        // Generate auto password
        String generatedPassword = generatePassword();
        String encryptedPassword = hashPassword(generatedPassword);

        // Convert Base64 to BLOB
        byte[] profileImage = dto.getProfileImage() != null ?
                Base64.getDecoder().decode(dto.getProfileImage()) : null;

        // Register driver
        boolean success = driverRepository.registerDriver(username, encryptedPassword, dto.getName(),
                dto.getAddress(), dto.getNic(), dto.getTelephone(), dto.getLicenseNumber(), profileImage);

        if (success) {
            return new ResponseDTO<>(200, "SUCCESS", "Driver registered successfully! Username: " + username + ", Password: " + generatedPassword);
        } else {
            return new ResponseDTO<>(500, "ERROR", "Driver registration failed.");
        }
    }

    public ResponseDTO<String> updateDriver(Long userId, UpdateDriverDTO dto) throws NoSuchAlgorithmException {
        // Check if driver exists
        if (!driverRepository.isDriverExists(userId)) {
            return new ResponseDTO<>(400, "ERROR", "Driver not found!");
        }

        // Convert password to hash if provided
        String passwordHash = dto.getPassword() != null ? hashPassword(dto.getPassword()) : null;

        // Convert Base64 image to BLOB
        byte[] profileImage = dto.getProfileImage() != null ?
                Base64.getDecoder().decode(dto.getProfileImage()) : null;

        // Update driver
        boolean success = driverRepository.updateDriver(userId, dto.getName(), dto.getAddress(),
                dto.getTelephone(), dto.getLicenseNumber(), passwordHash, profileImage);

        if (success) {
            return new ResponseDTO<>(200, "SUCCESS", "Driver updated successfully!");
        } else {
            return new ResponseDTO<>(400, "ERROR", "No fields were updated.");
        }
    }

    public ResponseDTO<Object> getDriverById(Long userId) {
        User driver = driverRepository.findActiveDriverById(userId);

        if (driver == null) {
            return new ResponseDTO<Object>(400, "ERROR", "Driver not found!");
        }

        return new ResponseDTO<Object>(200, "SUCCESS",   new DriverDTO(
                driver.getUserId(),
                driver.getUsername(),
                driver.getName(),
                driver.getAddress(),
                driver.getTelephone(),
                driver.getLicenseNumber(),
                driver.getStatus().toString(),
                driver.getProfileImage() != null ? Base64.getEncoder().encodeToString(driver.getProfileImage()) : null
        ));
    }

    public ResponseDTO<String> deleteDriver(Long userId) {
        int updatedRows = driverRepository.deactivateDriver(userId);
        if (updatedRows == 0) {
            return new ResponseDTO<>(400, "ERROR", "Driver not found or already inactive.");
        }
        return new ResponseDTO<>(200, "SUCCESS", "Driver deactivated successfully!");
    }
}
