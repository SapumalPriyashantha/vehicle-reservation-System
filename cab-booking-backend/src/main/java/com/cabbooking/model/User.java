package com.cabbooking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;  // Encrypted password

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(unique = true, length = 12)
    private String nic;

    @Column(length = 15)
    private String telephone;

    @Column(name ="license_number",unique = true, length = 20)
    private String licenseNumber;  // Only for drivers

    @Lob
    @Column(name = "profile_image")
    private byte[] profileImage;  // Profile image stored as BLOB

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    public enum Role {
        ADMIN, CUSTOMER, DRIVER
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}