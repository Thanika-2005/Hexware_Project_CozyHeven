package com.springboot.myapp.repository;

import com.springboot.myapp.model.CustomerPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerPlanRepository extends JpaRepository<CustomerPlan,Long> {
    @Query("""
    select cp from CustomerPlan cp where cp.customer.id = ?1
    """)
    List<CustomerPlan> getCustomerByPlanId(long planId);
}
