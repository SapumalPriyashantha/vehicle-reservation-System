package com.cabbooking.controller;

import com.cabbooking.dto.CarDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.service.CarService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;

@Path("/cars")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CarController {

    @Inject
    private CarService carService;

    @POST
    @Path("/add")
    public Response addCar(CarDTO carDTO) {
        try {
            ResponseDTO<String> result = carService.addCar(carDTO);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @PUT
    @Path("/update/{carId}")
    public Response updateCar(@PathParam("carId") Long carId, CarDTO updateCarDTO) {
        try {
            ResponseDTO<String> result = carService.updateCar(carId, updateCarDTO);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/searchById/{carId}")
    public Response getCarById(@PathParam("carId") Long carId) {
        try {
            ResponseDTO<Object> result =  carService.getCarById(carId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }

    }

    @DELETE
    @Path("/{carId}")
    public Response deleteCar(@PathParam("carId") Long carId) {
        try {
            ResponseDTO<String> result =   carService.deleteCar(carId);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }

    @GET
    @Path("/available")
    public Response searchAvailableCars(@QueryParam("from") String fromDate, @QueryParam("to") String toDate) {
        try {
            LocalDateTime from = LocalDateTime.parse(fromDate);
            LocalDateTime to = LocalDateTime.parse(toDate);

            ResponseDTO<Object> result = carService.getAvailableCars(from, to);
            return Response.status(result.getCode()).entity(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ResponseDTO<>(500, "ERROR", "Unexpected error occurred."))
                    .build();
        }
    }
}
