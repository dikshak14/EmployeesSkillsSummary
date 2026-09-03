package com.hexaware.employeeskillsummary.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // EMPLOYEE NAME
    // =====================================================

    @NotBlank(message = "Employee name is required")
    @Size(
            min = 3,
            max = 50,
            message = "Name must be between 3 and 50 characters"
    )
    private String name;

    // =====================================================
    // EMAIL
    // =====================================================

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(
            max = 100,
            message = "Email cannot exceed 100 characters"
    )
    @Column(unique = true)
    private String email;

    // =====================================================
    // PASSWORD
    // =====================================================
    /*
     * Employee passwords are not used for authentication.
     * Authentication is handled through the users table.
     */

    @Column(nullable = true)
    private String password;

    // =====================================================
    // DEPARTMENT
    // =====================================================

    @NotBlank(message = "Department is required")
    @Size(
            min = 2,
            max = 50,
            message = "Department must be between 2 and 50 characters"
    )
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Department should contain only letters and spaces"
    )
    private String department;

    // =====================================================
    // SKILLS
    // =====================================================

    @NotBlank(message = "Skills are required")
    @Size(
            min = 2,
            max = 500,
            message = "Skills must be between 2 and 500 characters"
    )
    private String skills;

    // =====================================================
    // SKILL LEVEL
    // =====================================================

    @NotBlank(message = "Skill Level is required")
    @Pattern(
            regexp = "^(Beginner|Intermediate|Advanced|Expert)$",
            message = "Skill Level must be Beginner, Intermediate, Advanced, or Expert"
    )
    private String skillLevel;

    // =====================================================
    // TRAINING NEEDED
    // =====================================================

    @NotBlank(message = "Training Needed is required")
    @Pattern(
            regexp = "^(Yes|No)$",
            message = "Training Needed must be Yes or No"
    )
    private String trainingNeeded;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public Employee() {
    }


    // =====================================================
    // PARAMETERIZED CONSTRUCTOR
    // =====================================================

    public Employee(
            Long id,
            String name,
            String email,
            String password,
            String department,
            String skills,
            String skillLevel,
            String trainingNeeded) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.skills = skills;
        this.skillLevel = skillLevel;
        this.trainingNeeded = trainingNeeded;
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }


    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }


    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }


    public String getTrainingNeeded() {
        return trainingNeeded;
    }

    public void setTrainingNeeded(String trainingNeeded) {
        this.trainingNeeded = trainingNeeded;
    }
}