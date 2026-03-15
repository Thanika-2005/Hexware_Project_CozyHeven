package com.car.main;

import com.car.model.Car;
import com.car.service.CarService;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class CarController {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        CarService carService = new CarService();

        while (true) {

            System.out.println("1. All Car with Owner name , Year of purchase and mileage");
            System.out.println("2. Display all cars with count");
            System.out.println("0. Exit");

            int ip = sc.nextInt();

            if (ip == 0) {
                break;
            }

            switch (ip) {

                case 1:

                    System.out.println("-----List of Cars------");

                    try {

                        List<Car> list = carService.getAllCarsWithCarDetailsAndOwner();

                        list.forEach(car -> {

                            System.out.println("Car Id: " + car.getId());
                            System.out.println("Registration No: " + car.getRegisterNumber());
                            System.out.println("Brand: " + car.getBrand());
                            System.out.println("Model: " + car.getModel());
                            System.out.println("Owner Name: " + car.getOwner().getName());
                            System.out.println("Year Of Purchase: " + car.getCarDetails().getYearOfPurchase());
                            System.out.println("Mileage: " + car.getCarDetails().getMileage());
                            System.out.println();

                        });

                    } catch (SQLException e) {
                        System.out.println(e.getMessage());
                    }

                    break;

                case 2:
                    System.out.println("---Car Brand Stats---");
                    try {
                        Map<String, Integer> map = CarService.getCarBrandStats();
                        System.out.println("   Brand  " + "\t" + "Number of cars");
                        for (Map.Entry<String, Integer> entry : map.entrySet()) {
                            System.out.println(entry.getKey() + "\t" + entry.getValue());
                        }
                    }catch (Exception e){
                        throw new RuntimeException(e);
                    }
                    break;

                default:
                    System.out.println("Invalid option");

            }
        }

        sc.close();
    }
}