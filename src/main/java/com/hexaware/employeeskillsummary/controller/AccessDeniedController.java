package com.hexaware.employeeskillsummary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccessDeniedController {

    // ==========================================
    // ACCESS DENIED PAGE
    // ==========================================

    @GetMapping("/access-denied")
    public String accessDenied() {

        return "error";
    }
}