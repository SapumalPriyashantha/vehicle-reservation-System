package com.cabbooking.controller;

import com.cabbooking.dto.FeedbackRequestDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.service.FeedbackService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FeedbackController {

    @Inject
    private FeedbackService feedbackService;

    @POST
    @Path("/submit-feedback")
    public Response submitFeedback(FeedbackRequestDTO request) {
        try {
            ResponseDTO<Object> result = feedbackService.submitFeedback(request);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }
}
