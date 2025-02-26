package com.cabbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResponseDTO<Object> {
    private int code;      // HTTP status code
    private String status; // SUCCESS / ERROR
    private Object data;        // Any object (string, list, etc.)
}
