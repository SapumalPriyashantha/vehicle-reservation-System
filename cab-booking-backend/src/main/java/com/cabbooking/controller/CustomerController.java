package com.cabbooking.controller;

import com.cabbooking.dto.LoginDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.dto.UpdateCustomerDTO;
import com.cabbooking.dto.UserRegistrationDTO;
import com.cabbooking.service.CustomerService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CustomerController {

    @Inject
    private CustomerService customerService;

    @POST
    @Path("/register")
    public Response registerCustomer(@Valid UserRegistrationDTO userRegistrationDTO) {
        try {
            customerService.registerCustomer(userRegistrationDTO);

            ResponseDTO<String> response = new ResponseDTO<>(
                    Response.Status.CREATED.getStatusCode(),
                    "SUCCESS",
                    "Customer registered successfully!"
            );

            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (RuntimeException e) {
            ResponseDTO<String> response = new ResponseDTO<>(
                    Response.Status.BAD_REQUEST.getStatusCode(),
                    "ERROR",
                    e.getLocalizedMessage()
            );
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        } catch (Exception e) {
            ResponseDTO<String> response = new ResponseDTO<>(
                    Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
                    "ERROR",
                    "Unexpected Error"
            );
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @PUT
    @Path("/{userId}")
    public Response updateCustomer(@PathParam("userId") Long userId, UpdateCustomerDTO dto) {
        try {
            ResponseDTO<String> result = customerService.updateCustomer(userId, dto);
            return Response.status(result.getCode()).entity(result).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ResponseDTO<>(400, "ERROR", e.getMessage()))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred"))
                    .build();
        }
    }

    @POST
    @Path("/login")
    public Response login(LoginDTO loginDTO) {
        try {
            ResponseDTO<Object> result = customerService.login(loginDTO);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("searchById/{userId}")
    public Response getActiveCustomerById(@PathParam("userId") Long userId) {
        try {
            ResponseDTO<Object> result = customerService.getActiveCustomerById(userId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @DELETE
    @Path("/{userId}")
    public Response deleteCustomer(@PathParam("userId") Long userId) {
        try {
            ResponseDTO<String> result = customerService.deleteCustomer(userId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/all")
    public Response getAllUsers() {
        try {
            ResponseDTO<Object> result = customerService.getAllUsers();
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/search/{searchText}")
    public Response searchCustomers(@PathParam("searchText") String searchText) {
        try {
            ResponseDTO<Object> result = customerService.searchCustomers(searchText);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }
}



