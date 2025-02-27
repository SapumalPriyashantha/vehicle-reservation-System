package com.cabbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DriverDTO {
    private Long userId;
    private String username;
    private String name;
    private String address;
    private String telephone;
    private String licenseNumber;
    private String status;
    private String profileImage;
}
