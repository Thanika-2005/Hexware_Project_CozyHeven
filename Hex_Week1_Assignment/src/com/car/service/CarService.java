package com.car.service;

import com.car.model.Car;
import com.car.repository.CarRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class CarService {
    static CarRepository carRepository = new CarRepository();



    public static Map<String, Integer> getCarBrandStats() throws SQLException {
     Map<String, Integer> map = carRepository.getCarBrandStats();
     return  map;
    }

    public List<Car> getAllCarsWithCarDetailsAndOwner() throws SQLException{
            return  carRepository.getAllCarsWithCarDetailsAndOwner();
    }
}
