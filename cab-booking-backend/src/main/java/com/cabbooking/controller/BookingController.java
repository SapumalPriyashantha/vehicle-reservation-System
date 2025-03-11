package com.cabbooking.controller;

import com.cabbooking.dto.BookingDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.service.BookingService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingController {

    @Inject
    private BookingService bookingService;

    @POST
    @Path("/createBooking")
    public Response createBooking(BookingDTO bookingDTO) {
        try {
            ResponseDTO<Object> result = bookingService.createBooking(bookingDTO);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/bookingsByDriver")
    public Response getBookingsByDriverAndStatus(@QueryParam("driverId") Long driverId, @QueryParam("status") String status) {
        try {
            if (driverId == null || status == null || status.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ResponseDTO<>(400, "ERROR", "driverId and status are required query parameters."))
                        .build();
            }

            ResponseDTO<Object> result = bookingService.getBookingsByDriverAndStatus(driverId, status.toUpperCase());
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @PUT
    @Path("/start/{bookingId}")
    public Response startTrip(@PathParam("bookingId") Long bookingId) {
        try {
            if (bookingId == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ResponseDTO<>(400, "ERROR", "Booking ID is required."))
                        .build();
            }

            ResponseDTO<Object> result = bookingService.startTrip(bookingId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/bookingsByCustomer")
    public Response getBookingsByCustomerAndStatus(@QueryParam("customerId") Long customerId, @QueryParam("status") String status) {
        try {
            if (customerId == null || status == null || status.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ResponseDTO<>(400, "ERROR", "customerId and status are required query parameters."))
                        .build();
            }

            ResponseDTO<Object> result = bookingService.getBookingsByCustomerAndStatus(customerId, status.toUpperCase());
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/all")
    public Response getAllBookings() {
        try {
            ResponseDTO<Object> result = bookingService.getAllBookings();
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

}