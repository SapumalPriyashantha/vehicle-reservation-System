package com.cabbooking.service;

import com.cabbooking.dto.CarDTO;
import com.cabbooking.dto.ResponseDTO;
import com.cabbooking.model.Car;
import com.cabbooking.repository.CarRepository;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class CarService {

    @Inject
    private CarRepository carRepository;

    public ResponseDTO<String> addCar(CarDTO carDTO) {
        try {
            byte[] carImageBytes = null;

            if (carDTO.getCarImageBase64() != null && !carDTO.getCarImageBase64().isEmpty()) {
                carImageBytes = Base64.getDecoder().decode(carDTO.getCarImageBase64());
            }

            int result = carRepository.addCar(
                    carDTO.getCarModel(),
                    carDTO.getLicensePlate(),
                    carDTO.getMileage(),
                    carDTO.getPassengerCapacity(),
                    carImageBytes
            );

            if (result > 0) {
                return new ResponseDTO<>(200, "SUCCESS", "Car added successfully!");
            } else {
                return new ResponseDTO<>(500, "ERROR", "Failed to add car.");
            }
        } catch (IllegalArgumentException e) {
            return new ResponseDTO<>(400, "ERROR", "Invalid Base64 image format.");
        } catch (Exception e) {
            return new ResponseDTO<>(500, "ERROR", "Unexpected error occurred.");
        }
    }

    public ResponseDTO<String> updateCar(Long carId, CarDTO updateCarDTO) {
        try {
            byte[] carImageBytes = null;
            if (updateCarDTO.getCarImageBase64() != null && !updateCarDTO.getCarImageBase64().isEmpty()) {
                carImageBytes = Base64.getDecoder().decode(updateCarDTO.getCarImageBase64());
            }

            int updatedRows = carRepository.updateCar(
                    carId,
                    updateCarDTO.getCarModel(),
                    updateCarDTO.getLicensePlate(),
                    updateCarDTO.getMileage(),
                    updateCarDTO.getPassengerCapacity(),
                    carImageBytes
            );

            if (updatedRows > 0) {
                return new ResponseDTO<>(200, "SUCCESS", "Car updated successfully!");
            } else {
                return new ResponseDTO<>(400, "ERROR", "No fields to update or car not found.");
            }
        } catch (IllegalArgumentException e) {
            return new ResponseDTO<>(400, "ERROR", "Invalid Base64 image format.");
        } catch (Exception e) {
            return new ResponseDTO<>(500, "ERROR", "Unexpected error occurred.");
        }
    }

    public ResponseDTO<Object> getCarById(Long carId) {
       Car car =  carRepository.findCarById(carId);
        if (car == null) {
            return new ResponseDTO<Object>(400, "ERROR", "Active car not found!");
        }
        return new ResponseDTO<Object>(200, "SUCCESS",  new CarDTO(
                car.getCarId(),
                car.getCarModel(),
                car.getLicensePlate(),
                car.getMileage(),
                car.getPassengerCapacity(),
                car.getStatus().name(),
                car.getCarImage() != null ? Base64.getEncoder().encodeToString(car.getCarImage()) : null
        ));
    }

    public ResponseDTO<String> deleteCar(Long carId) {
        boolean updated = carRepository.updateCarStatusToInactive(carId);

        if (updated) {
            return new ResponseDTO<>(200, "SUCCESS", "Car marked as inactive successfully!");
        } else {
            return new ResponseDTO<>(404, "ERROR", "Car not found or already inactive.");
        }
    }

    public ResponseDTO<Object> getAvailableCars(LocalDateTime fromDate, LocalDateTime toDate) {
        List<Car> availableCars = carRepository.findAvailableCars(fromDate, toDate);

        if (availableCars.isEmpty()) {
            return new ResponseDTO<Object>(400, "ERROR", "No available cars found for the selected period.");
        }

        List<CarDTO> carDTOList = availableCars.stream()
                .map(car -> new CarDTO(
                        car.getCarId(),
                        car.getCarModel(),
                        car.getLicensePlate(),
                        car.getMileage(),
                        car.getPassengerCapacity(),
                        car.getStatus().name(), // Convert ENUM to String
                        (car.getCarImage() != null) ? Base64.getEncoder().encodeToString(car.getCarImage()) : null
                ))
                .collect(Collectors.toList());

        return new ResponseDTO<Object>(200, "SUCCESS", carDTOList);
    }

    public ResponseDTO<Object> getAllCars() {
        List<Object[]> cars = carRepository.getAllCars();

        if (cars.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR", "No cars found!");
        }

        List<CarDTO> carDTOList = cars.stream().map(car -> {
            byte[] carImageBytes = (byte[]) car[5]; // Car image (BLOB)
            String carImageBase64 = (carImageBytes != null) ? Base64.getEncoder().encodeToString(carImageBytes) : null;

            return new CarDTO(
                    ((Number) car[0]).longValue(),  // carId
                    (String) car[1],  // carModel
                    (String) car[2],  // licensePlate
                    (BigDecimal) car[3],  // mileage
                    (Integer) car[4],  // passengerCapacity
                    (String) car[6],  // status
                    carImageBase64  // Car image as Base64 string
            );
        }).collect(Collectors.toList());

        return new ResponseDTO<>(200, "SUCCESS", carDTOList);
    }

    public ResponseDTO<Object> searchCars(String searchText) {
        List<Object[]> cars = carRepository.searchCars(searchText);

        if (cars.isEmpty()) {
            return new ResponseDTO<>(400, "ERROR", "No matching cars found.");
        }

        List<CarDTO> carDTOList = cars.stream()
                .map(car -> new CarDTO(
                        ((Number) car[0]).longValue(),        // car_id
                        (String) car[1],                      // car_model
                        (String) car[2],                      // license_plate
                        (BigDecimal) car[3],                  // mileage
                        ((Number) car[4]).intValue(),         // passenger_capacity
                        (car[6] != null) ? car[6].toString() : null,  // status as string
                        (car[5] != null) ? Base64.getEncoder().encodeToString((byte[]) car[5]) : null // car_image as Base64
                ))
                .collect(Collectors.toList());

        return new ResponseDTO<>(200, "SUCCESS", carDTOList);
    }

}
