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
}