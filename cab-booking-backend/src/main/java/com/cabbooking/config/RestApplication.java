package com.cabbooking.config;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/api") // This makes your API base path: http://localhost:8080/cab-booking-backend/api/
public class RestApplication extends Application {

}
