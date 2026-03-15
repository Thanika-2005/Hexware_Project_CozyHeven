package com.car.repository;

import com.car.dao.CarDao;
import com.car.model.Car;
import com.car.model.CarDetails;
import com.car.model.Owner;
import com.car.utility.DBConnection;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


public class CarRepository implements CarDao {
      DBConnection dbConnection = DBConnection.getInstance();

      @Override
      public List<Car> getAllCarsWithCarDetailsAndOwner() throws SQLException{
        List<Car>list = new ArrayList<>();
        Connection conn = dbConnection.dbConnect();
        System.out.println(dbConnection);
        String sql = "select c.id , c.registration_number as RegNo, c.brand , c.model , o.name as ownerName , cd.year_of_purchase as YearOfPurchase, cd.mileage as Mileage" +
                " from car as c " +
                " Join owner as o on c.owner_id = o.id" +
                " join car_details as cd on c.car_details_id = cd.id  " ;
        PreparedStatement stmt = conn.prepareStatement(sql);
        ResultSet rst =  stmt.executeQuery();

        while(rst.next()){
            Car car = new Car();
            int id = rst.getInt("id");
            String registerNumber = rst.getString("RegNo");
            String brand = rst.getString("brand");
            String model = rst.getString("model");
            car.setId(id);
            car.setRegisterNumber(registerNumber);
            car.setBrand(brand);
            car.setModel(model);

            String OwnerName = rst.getString("ownerName");
            Owner owner = new Owner();
            owner.setName(OwnerName);

            int YearOfPurchase = rst.getInt("YearOfPurchase");
            CarDetails carDetails = new CarDetails();
            carDetails.setYearOfPurchase(YearOfPurchase);
            int mileage = rst.getInt("Mileage");
            carDetails.setMileage(mileage);

            //Attach vendor and category to product
            car.setOwner(owner);
            car.setCardetails(carDetails);
            list.add(car);
        }
        dbConnection.dbClose();
        return list;
    }

    public Map<String, Integer> getCarBrandStats()  throws  SQLException{
        Connection conn  = dbConnection.dbConnect();
        System.out.println(dbConnection);
        Map<String, Integer> map = new LinkedHashMap<>(); //maintains insertion order
        String sql =  "SELECT brand, COUNT(*) AS no_of_cars " +
                "FROM car " +
                "GROUP BY brand";
        PreparedStatement stmt = conn.prepareStatement(sql);
        ResultSet rst =  stmt.executeQuery();
        while(rst.next()){
            String brand = rst.getString("brand");
            int count = rst.getInt("no_of_cars");
            map.put(brand, count);
        }
        dbConnection.dbClose();
        return map;
    }
}
