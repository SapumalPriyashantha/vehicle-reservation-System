package com.cabbooking.controller;

import com.cabbooking.dto.PaymentRequestDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.service.PaymentService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;

@Path("/payment")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentController {

    @Inject
    private PaymentService paymentService;

    @POST
    @Path("/process")
    public Response processPayment(PaymentRequestDTO paymentRequest) {
        try {
            ResponseDTO<Object> result = paymentService.processPayment(paymentRequest);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/report")
    public Response getPaymentRecords(@QueryParam("from") String fromDateStr,
                                      @QueryParam("to") String toDateStr) {
        try {
            if (fromDateStr == null || toDateStr == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ResponseDTO<>(400, "ERROR", "Missing required date parameters."))
                        .build();
            }

            LocalDate fromDate = LocalDate.parse(fromDateStr);
            LocalDate toDate = LocalDate.parse(toDateStr);

            ResponseDTO<Object> result = paymentService.getPaymentRecords(fromDate, toDate);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }
}
