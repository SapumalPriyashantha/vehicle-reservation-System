package com.cabbooking.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class DriverRegistrationDTO {
    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    private String address;

    @NotNull
    @NotEmpty
    private String nic;

    @NotNull
    @NotEmpty
    private String telephone;

    @NotNull
    @NotEmpty
    private String licenseNumber;

    @NotNull
    @NotEmpty
    private String profileImage; // Base64 encoded image
}
