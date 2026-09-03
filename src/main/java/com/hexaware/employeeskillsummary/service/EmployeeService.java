package com.hexaware.employeeskillsummary.service;

import com.hexaware.employeeskillsummary.entity.Employee;
import com.hexaware.employeeskillsummary.repository.EmployeeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;


    public EmployeeService(
            EmployeeRepository employeeRepository) {

        this.employeeRepository =
                employeeRepository;
    }


    // =====================================================
    // GET ALL
    // =====================================================

    public List<Employee> getAllEmployees() {

        return employeeRepository.findAll();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    public Employee getEmployeeById(Long id) {

        return employeeRepository
                .findById(id)
                .orElse(null);
    }


    // =====================================================
    // GET BY EMAIL
    // =====================================================

    public Employee getEmployeeByEmail(
            String email) {

        return employeeRepository
                .findByEmail(email);
    }


    // =====================================================
    // SAVE
    // =====================================================

    public Employee saveEmployee(
            Employee employee) {

        if (
                employeeRepository
                        .existsByEmail(employee.getEmail())
        ) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        return employeeRepository.save(
                employee
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    public Employee updateEmployee(
            Employee employee) {

        return employeeRepository.save(
                employee
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteEmployee(Long id) {

        if (
                employeeRepository
                        .existsById(id)
        ) {

            employeeRepository.deleteById(id);
        }
    }


    // =====================================================
    // SEARCH
    // =====================================================

    public List<Employee> searchEmployees(
            String keyword) {

        return employeeRepository
                .findByNameContainingIgnoreCase(
                        keyword
                );
    }
}