package com.car.model;

public class CarDetails {
    private int id;
    private int  yearOfPurchase;
    private int mileage;



    public CarDetails() {
    }
    public CarDetails(int id, int yearOfPurchase, int mileage) {
        this.id = id;
        this.yearOfPurchase = yearOfPurchase;
        this.mileage = mileage;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getYearOfPurchase() {
        return yearOfPurchase;
    }

    public void setYearOfPurchase(int yearOfPurchase) {
        this.yearOfPurchase = yearOfPurchase;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }

    @Override
    public String toString() {
        return "CarDetails{" +
                "id=" + id +
                ", yearOfPurchase=" + yearOfPurchase +
                ", mileage=" + mileage +
                '}';
    }
}
