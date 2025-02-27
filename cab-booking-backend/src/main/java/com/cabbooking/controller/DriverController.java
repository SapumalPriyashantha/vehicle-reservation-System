package com.cabbooking.controller;

import com.cabbooking.dto.DriverRegistrationDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.dto.UpdateDriverDTO;
import com.cabbooking.service.DriverService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/drivers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DriverController {

    @Inject
    private DriverService driverService;

    @POST
    @Path("/register")
    public Response registerDriver(DriverRegistrationDTO dto) {
        try {
            ResponseDTO<String> result = driverService.registerDriver(dto);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @PUT
    @Path("/{userId}")
    public Response updateDriver(@PathParam("userId") Long userId, UpdateDriverDTO dto) {
        try {
            ResponseDTO<String> result = driverService.updateDriver(userId, dto);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/searchById/{userId}")
    public Response getDriverById(@PathParam("userId") Long userId) {
        try {
            ResponseDTO<Object> result = driverService.getDriverById(userId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @DELETE
    @Path("/{userId}")
    public Response deleteDriver(@PathParam("userId") Long userId) {
        try {
            ResponseDTO<String> result = driverService.deleteDriver(userId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }
}
