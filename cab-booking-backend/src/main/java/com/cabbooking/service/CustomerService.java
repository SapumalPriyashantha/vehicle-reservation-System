package com.cabbooking.service;

import com.cabbooking.dto.*;
import com.cabbooking.model.User;
import com.cabbooking.repository.CustomerRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.*;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import static com.cabbooking.util.Util.hashPassword;

@Stateless
public class CustomerService {
    @Inject
    private CustomerRepository customerRepository;

    // Register a new customer
    public boolean registerCustomer(UserRegistrationDTO userRegistrationDTO) throws NoSuchAlgorithmException {
        // Check if username or NIC already exists
        if (customerRepository.isUsernameExists(userRegistrationDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (customerRepository.isNicExists(userRegistrationDTO.getNic())) {
            throw new RuntimeException("NIC already exists");
        }

        // Encrypt password (use a simple hashing example with SHA-256)
        String encryptedPassword = hashPassword(userRegistrationDTO.getPassword());

        return customerRepository.registerCustomer(
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
        if (!customerRepository.isUserExists(userId)) {
            return new ResponseDTO<>(400, "ERROR", "Customer not found!");
        }

        String passwordHash = dto.getPassword() != null ? hashPassword(dto.getPassword()) : null;

        int rowsUpdated = customerRepository.updateCustomer(userId, dto.getName(), dto.getAddress(), dto.getTelephone(), passwordHash);

        if (rowsUpdated > 0) {
            return new ResponseDTO<>(200, "SUCCESS", "Customer updated successfully!");
        } else {
            return new ResponseDTO<>(400, "ERROR", "No fields to update.");
        }
    }

    public ResponseDTO<Object> login(LoginDTO loginDTO) {
        try {

            User user = customerRepository.findByUsername(loginDTO.getUsername());

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

    public ResponseDTO<Object> getActiveCustomerById(Long userId) {
        User user = customerRepository.findActiveCustomerById(userId);
        if (user == null) {
            return new ResponseDTO<Object>(400, "ERROR", "Active customer not found!");
        }
        return new ResponseDTO<Object>(200, "SUCCESS", user);
    }

    public ResponseDTO<String> deleteCustomer(Long userId) {
        int updatedRows = customerRepository.deactivateCustomer(userId);
        if (updatedRows == 0) {
            return new ResponseDTO<>(400, "ERROR", "Customer not found or already inactive!");
        }
        return new ResponseDTO<>(200, "SUCCESS", "Customer deleted (status set to INACTIVE).");
    }

    public ResponseDTO<Object> getAllUsers() {
        List<Object[]> users = customerRepository.getAllUsers();

        if (users.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR", "No users found!");
        }

        List<UserDTO> userDTOList = users.stream().map(user -> {
            byte[] profileImageBytes = (byte[]) user[9]; // Profile image (BLOB)
            String profileImageBase64 = (profileImageBytes != null) ? Base64.getEncoder().encodeToString(profileImageBytes) : null;

            return new UserDTO(
                    ((Number) user[0]).longValue(),  // userId
                    (String) user[1],  // username
                    (String) user[2],  // name
                    (String) user[3],  // address
                    (String) user[4],  // nic
                    (String) user[5],  // telephone
                    (String) user[6],  // licenseNumber
                    (String) user[7],  // role
                    (String) user[8],  // status
                    profileImageBase64  // Profile image as Base64 string
            );
        }).collect(Collectors.toList());

        return new ResponseDTO<>(200, "SUCCESS", userDTOList);
    }

    // Simulated password verification (Replace with hashing logic in real app)
    private boolean verifyPassword(String enteredPassword, String storedPassword) {
        return enteredPassword.equals(storedPassword);
    }

    // Simulated token generation (Use JWT or another secure method in real app)
    private String generateToken(String username) {
        return "token_" + username + "_" + System.currentTimeMillis();
    }


}