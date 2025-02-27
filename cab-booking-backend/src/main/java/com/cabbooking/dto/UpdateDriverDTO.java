package com.cabbooking.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class UpdateDriverDTO {
    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    private String address;

    @NotNull
    @NotEmpty
    private String telephone;

    @NotNull
    @NotEmpty
    private String licenseNumber;

    private String password;
    private String profileImage;
}
