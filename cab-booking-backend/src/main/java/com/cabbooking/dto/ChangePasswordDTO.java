package com.cabbooking.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChangePasswordDTO {
    private Long id;
    private String currentPassword;
    private String newPassword;
}
