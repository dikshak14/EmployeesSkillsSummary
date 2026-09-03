package com.hexaware.employeeskillsummary.repository;

import com.hexaware.employeeskillsummary.entity.Employee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {

    Employee findByEmail(String email);
    boolean existsByEmail(String email);

    List<Employee>
    findByNameContainingIgnoreCase(
            String name
    );
}