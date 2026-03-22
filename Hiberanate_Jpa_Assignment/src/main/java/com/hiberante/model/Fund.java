package com.hiberante.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;


@Entity
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    private String name;
    private BigDecimal aumAmount;
    private BigDecimal expenseRatio;
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager Manager;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAumAmount() {
        return aumAmount;
    }

    public void setAumAmount(BigDecimal aumAmount) {
        this.aumAmount = aumAmount;
    }

    public BigDecimal getExpenseRatio() {
        return expenseRatio;
    }

    public void setExpenseRatio(BigDecimal expenseRatio) {
        this.expenseRatio = expenseRatio;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Manager getManager() {
        return Manager;
    }

    public void setManager(Manager manager) {
        Manager = manager;
    }

    @Override
    public String toString() {
        return "Fund{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", aumAmount=" + aumAmount +
                ", expenseRatio=" + expenseRatio +
                ", createdAt=" + createdAt +
                ", Manager=" + Manager +
                '}';
    }
}
