package com.hexaware.employeeskillsummary.controller;

import com.hexaware.employeeskillsummary.entity.User;
import com.hexaware.employeeskillsummary.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ==========================================
    // REGISTER USER
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        if (userService.existsByEmail(user.getEmail())) {

            Map<String, String> response = new HashMap<>();

            response.put(
                    "message",
                    "Email is already registered"
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        userService.register(user);

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Registration successful"
        );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // LOGIN STATUS
    // ==========================================

    @GetMapping("/api/auth/status")
    public ResponseEntity<?> loginStatus() {

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Authentication endpoint is available"
        );

        return ResponseEntity.ok(response);
    }
}