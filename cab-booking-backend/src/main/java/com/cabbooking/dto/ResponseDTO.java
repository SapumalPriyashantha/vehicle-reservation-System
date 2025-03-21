package com.cabbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
public class ResponseDTO<Object> {
    @NotNull
    @NotEmpty
    private int code;      // HTTP status code

    @NotNull
    @NotEmpty
    private String status; // SUCCESS / ERROR

    @NotNull
    @NotEmpty
    private Object data;        // Any object (string, list, etc.)
}
