package com.hexaware.employeeskillsummary.controller;

import com.hexaware.employeeskillsummary.entity.Employee;
import com.hexaware.employeeskillsummary.service.EmployeeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class EmployeeApiController {

    private final EmployeeService employeeService;

    public EmployeeApiController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }


    // =====================================================
    // GET CURRENT LOGGED-IN EMPLOYEE
    // =====================================================

    @GetMapping("/me")
    public ResponseEntity<Employee> getCurrentEmployee(
            Principal principal) {

        if (principal == null) {

            return ResponseEntity
                    .status(401)
                    .build();
        }

        String email =
                principal.getName();

        System.out.println(
                "CURRENT USER EMAIL: " + email
        );

        Employee employee =
                employeeService.getEmployeeByEmail(email);

        if (employee == null) {

            System.out.println(
                    "NO EMPLOYEE FOUND FOR EMAIL: "
                            + email
            );

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(employee);
    }


// =====================================================
// UPDATE CURRENT LOGGED-IN EMPLOYEE
// =====================================================

    @PutMapping("/me")
    public ResponseEntity<Employee> updateCurrentEmployee(
            Principal principal,
            @RequestBody Employee employee) {

        if (principal == null) {

            return ResponseEntity
                    .status(401)
                    .build();
        }

        String email = principal.getName();

        System.out.println(
                "UPDATING CURRENT EMPLOYEE: " + email
        );

        Employee existingEmployee =
                employeeService.getEmployeeByEmail(email);

        if (existingEmployee == null) {

            System.out.println(
                    "NO EMPLOYEE FOUND FOR EMAIL: " + email
            );

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // -----------------------------------------------
        // UPDATE PROFILE DETAILS
        // -----------------------------------------------

        existingEmployee.setName(
                employee.getName()
        );

        existingEmployee.setDepartment(
                employee.getDepartment()
        );

        existingEmployee.setSkills(
                employee.getSkills()
        );

        existingEmployee.setSkillLevel(
                employee.getSkillLevel()
        );


        // -----------------------------------------------
        // UPDATE TRAINING
        // -----------------------------------------------

        String training =
                employee.getTrainingNeeded();

        if (training == null) {

            existingEmployee.setTrainingNeeded("No");

        } else if (
                training.equalsIgnoreCase("true")
                        ||
                        training.equalsIgnoreCase("yes")
        ) {

            existingEmployee.setTrainingNeeded("Yes");

        } else {

            existingEmployee.setTrainingNeeded("No");
        }


        // -----------------------------------------------
        // DO NOT CHANGE EMAIL
        // -----------------------------------------------

        // Existing email remains unchanged.
        // The logged-in employee is identified by
        // Principal email.


        // -----------------------------------------------
        // SAVE
        // -----------------------------------------------

        Employee updatedEmployee =
                employeeService.updateEmployee(
                        existingEmployee
                );

        System.out.println(
                "UPDATED SKILL LEVEL: "
                        + updatedEmployee.getSkillLevel()
        );

        return ResponseEntity.ok(
                updatedEmployee
        );
    }


    // =====================================================
    // GET ALL EMPLOYEES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {

        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }


    // =====================================================
    // GET EMPLOYEE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(
            @PathVariable Long id) {

        Employee employee =
                employeeService.getEmployeeById(id);

        if (employee == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(employee);
    }


    // =====================================================
    // ADD EMPLOYEE
    // =====================================================

    @PostMapping
    public ResponseEntity<Employee> addEmployee(
            @Valid @RequestBody Employee employee) {

        // -----------------------------------------------
        // DEFAULT TRAINING
        // -----------------------------------------------

        if (employee.getTrainingNeeded() == null) {

            employee.setTrainingNeeded("No");

        } else {

            String training =
                    employee.getTrainingNeeded()
                            .trim();

            if (
                    training.equalsIgnoreCase("true")
                            ||
                            training.equalsIgnoreCase("yes")
            ) {

                employee.setTrainingNeeded("Yes");

            } else {

                employee.setTrainingNeeded("No");
            }
        }


        // -----------------------------------------------
        // SAVE EMPLOYEE
        // -----------------------------------------------

        try {

            Employee savedEmployee =
                    employeeService.saveEmployee(
                            employee
                    );

            return ResponseEntity.ok(
                    savedEmployee
            );

        } catch (ResponseStatusException exception) {

            // -------------------------------------------
            // ADDED FOR ERROR STATUS
            // -------------------------------------------

            return ResponseEntity
                    .status(exception.getStatusCode())
                    .build();
        }
    }


    // =====================================================
    // UPDATE EMPLOYEE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        Employee existingEmployee =
                employeeService.getEmployeeById(id);

        if (existingEmployee == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // -----------------------------------------------
        // BASIC DETAILS
        // -----------------------------------------------

        existingEmployee.setName(
                employee.getName()
        );

        existingEmployee.setEmail(
                employee.getEmail()
        );

        existingEmployee.setDepartment(
                employee.getDepartment()
        );

        existingEmployee.setSkills(
                employee.getSkills()
        );

        existingEmployee.setSkillLevel(
                employee.getSkillLevel()
        );


        // -----------------------------------------------
        // TRAINING
        // -----------------------------------------------

        String training =
                employee.getTrainingNeeded();

        if (training == null) {

            existingEmployee.setTrainingNeeded(
                    "No"
            );

        } else if (
                training.equalsIgnoreCase("true")
                        ||
                        training.equalsIgnoreCase("yes")
        ) {

            existingEmployee.setTrainingNeeded(
                    "Yes"
            );

        } else {

            existingEmployee.setTrainingNeeded(
                    "No"
            );
        }


        // -----------------------------------------------
        // SAVE UPDATE
        // -----------------------------------------------

        Employee updatedEmployee =
                employeeService.updateEmployee(
                        existingEmployee
                );

        return ResponseEntity.ok(
                updatedEmployee
        );
    }


    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(
            @PathVariable Long id) {

        Employee employee =
                employeeService.getEmployeeById(id);

        if (employee == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        employeeService.deleteEmployee(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}