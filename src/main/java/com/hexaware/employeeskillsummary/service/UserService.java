package com.hexaware.employeeskillsummary.service;

import com.hexaware.employeeskillsummary.entity.Employee;
import com.hexaware.employeeskillsummary.entity.User;
import com.hexaware.employeeskillsummary.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmployeeService employeeService;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            EmployeeService employeeService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.employeeService = employeeService;
    }

    // =====================================================
    // CHECK EMAIL EXISTS
    // =====================================================

    public boolean existsByEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        return userRepository.existsByEmail(
                email.trim().toLowerCase()
        );
    }

    // =====================================================
    // FIND USER BY EMAIL
    // =====================================================

    public User findByEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            return null;
        }

        return userRepository.findByEmail(
                email.trim().toLowerCase()
        );
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // =====================================================
    // REGISTER USER
    // =====================================================

    public User register(User user) {

        String email = user.getEmail()
                .trim()
                .toLowerCase();

        user.setEmail(email);

        // -------------------------------------------------
        // DEFAULT ROLE
        // -------------------------------------------------

        if (user.getRole() == null ||
                user.getRole().trim().isEmpty()) {

            user.setRole("USER");

        } else {

            user.setRole(
                    user.getRole()
                            .trim()
                            .toUpperCase()
            );
        }

        // -------------------------------------------------
        // ENCRYPT PASSWORD
        // -------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        // -------------------------------------------------
        // SAVE USER
        // -------------------------------------------------

        User savedUser =
                userRepository.save(user);


        // =================================================
        // CREATE EMPLOYEE PROFILE FOR NEW USER
        // =================================================

        if ("USER".equalsIgnoreCase(savedUser.getRole())) {

            Employee employee =
                    new Employee();

            employee.setName(
                    savedUser.getFullName()
            );

            employee.setEmail(
                    savedUser.getEmail()
            );

            /*
             * Employee password is not used for authentication.
             * Login is handled through the users table.
             */
            employee.setPassword(null);

            // Safe default values
            employee.setDepartment("General");

            employee.setSkills("Not specified");

            employee.setSkillLevel("Beginner");

            employee.setTrainingNeeded("No");

            employeeService.saveEmployee(employee);
        }


        return savedUser;
    }

    // =====================================================
    // SAVE USER
    // =====================================================

    public User saveUser(User user) {

        return userRepository.save(user);
    }

    // =====================================================
    // GET USER BY ID
    // =====================================================

    public User getUserById(Long id) {

        return userRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // DELETE USER
    // =====================================================

    public void deleteUser(Long id) {

        if (userRepository.existsById(id)) {

            userRepository.deleteById(id);
        }
    }
}