package com.hiberante.controller;

import com.hiberante.config.ProjConfig;
import com.hiberante.model.Fund;
import com.hiberante.model.Manager;
import com.hiberante.service.BankFundService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Scanner;

public class BankFundController {

    public static void main(String[] args){


        var context = new AnnotationConfigApplicationContext(ProjConfig.class);
        LocalContainerEntityManagerFactoryBean emf =context.getBean(LocalContainerEntityManagerFactoryBean.class);
        BankFundService bankFundService = context.getBean(BankFundService.class);
        Scanner sc = new Scanner(System.in);

        while (true){
            System.out.println("1. Insert Manager");
            System.out.println("2. Insert Fund");
            System.out.println("3. fetch all Funds for specific manager");
            System.out.println("0. Exit");

        int input = sc.nextInt();
        if(input == 0){
            break;
        }
        switch (input){
            case 1:
                Manager manager = new Manager();
                System.out.println("Enter the Name");
                manager.setName(sc.next());
                System.out.println("Enter the  email");
                manager.setEmail(sc.next());
                bankFundService.insert(manager);
                System.out.println("Manager added");
                break;
            case 2:
                System.out.println("Enter the manager id in which fund belongs to :");
                int managerId = sc.nextInt();
                try {
                    manager = bankFundService.getManager(managerId);
                    // Reading flight info
                    Fund fund = new Fund();
                    System.out.println("Enter fund Number");
                    fund.setName(sc.next());
                    System.out.println("Enter aumAmount");
                    fund.setAumAmount(sc.nextBigDecimal());
                    System.out.println("Enter expense Ratio");
                    fund.setExpenseRatio(sc.nextBigDecimal());
                    // Read date as String and then parse it to convert to LocalTime in service
                    System.out.println("Enter time of acc creation");
                    String createdAt = sc.next();

                    bankFundService.insertintoFund(fund,createdAt,manager);
                    System.out.println("Flight added");
                }catch(RuntimeException e){
                    System.out.println(e.getMessage());
                }

                break;

            case 3:
                List<?> list = bankFundService.fetchAllFundsForManager();
                list.forEach(System.out::println);

                break;
        }
        }

    sc.close();
    context.close();

}
}
