package com.car.model;

public class Car {
    private int id;
    private String registerNumber;
    private String chasisNumber;
    private String registrationState;
    private String brand;
    private String model;
    private String variant;
    private Owner owner;
    private CarDetails carDetails;

    public Car() {
    }

    public Car(int id, String registerNumber, String chasisNumber, String registrationState, String brand,
               String model, String variant, Owner ownerId, CarDetails cardetailsId) {
        this.id = id;
        this.registerNumber = registerNumber;
        this.chasisNumber = chasisNumber;
        this.registrationState = registrationState;
        this.brand = brand;
        this.model = model;
        this.variant = variant;
        this.owner = ownerId;
        this.carDetails = cardetailsId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getChasisNumber() {
        return chasisNumber;
    }

    public void setChasisNumber(String chasisNumber) {
        this.chasisNumber = chasisNumber;
    }

    public String getRegistrationState() {
        return registrationState;
    }

    public void setRegistrationState(String registrationState) {
        this.registrationState = registrationState;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public CarDetails getCarDetails() {
        return carDetails;
    }

    public void setCardetails(CarDetails carDetailsId) {
        this.carDetails = carDetailsId;
    }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", registerNumber='" + registerNumber + '\'' +
                ", chasisNumber='" + chasisNumber + '\'' +
                ", registrationState='" + registrationState + '\'' +
                ", brand='" + brand + '\'' +
                ", model='" + model + '\'' +
                ", variant='" + variant + '\'' +
                ", ownerId=" + owner +
                ", cardetailsId=" + carDetails +
                '}';
    }
}
