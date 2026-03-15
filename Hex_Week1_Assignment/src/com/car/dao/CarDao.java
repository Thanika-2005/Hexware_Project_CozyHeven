package com.car.dao;

import com.car.model.Car;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface CarDao {
    List<Car> getAllCarsWithCarDetailsAndOwner() throws SQLException;
    Map<String,Integer> getCarBrandStats() throws SQLException;
}
