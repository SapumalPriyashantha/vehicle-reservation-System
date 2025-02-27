package com.cabbooking.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class Util {
    public static String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashedBytes = md.digest(password.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashedBytes) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    public static String generateUsername(String name) {
        return name.toLowerCase().replaceAll(" ", "") + (int) (Math.random() * 1000);
    }

    public static String generatePassword() {
        return UUID.randomUUID().toString().substring(0, 8); // 8-character random password
    }
}
