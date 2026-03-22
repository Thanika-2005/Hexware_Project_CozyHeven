package com.hiberante.service;

import com.hiberante.exception.ResourceNotFoundException;
import com.hiberante.model.Fund;
import com.hiberante.model.Manager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BankFundService {

    @PersistenceContext
    private EntityManager em;



    @Transactional
    public void insert(Manager manager) {
        em.persist(manager);
    }

    public Manager getManager(int managerId) {
       Manager manager = em.find(Manager.class,managerId);
       if(manager == null){
                throw new ResourceNotFoundException("Invalid manager Id...");
        }
       return manager;
    }

    @Transactional
    public void insertintoFund(Fund fund, String createdAt, Manager manager) {
        fund.setCreatedAt(Instant.now());
        fund.setManager(manager);
        em.persist(fund);

    }

    public List<?> fetchAllFundsForManager() {
        String hql = "select f from Fund f";
        Query query = em.createQuery(hql,Fund.class);
        return query.getResultList();
    }
}
