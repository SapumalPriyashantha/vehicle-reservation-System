package com.cabbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String name;
    private String address;
    private String nic;
    private String telephone;
    private String licenseNumber;
    private String role;
    private String status;
    private String profileImageBase64; // Base64-encoded profile image
}