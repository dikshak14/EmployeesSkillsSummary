package com.hexaware.employeeskillsummary.controller;

import com.hexaware.employeeskillsummary.entity.User;
import com.hexaware.employeeskillsummary.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class UserManagementController {

    private final UserRepository userRepository;

    public UserManagementController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userRepository.findAll();

        return ResponseEntity.ok(users);
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {

        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }
}