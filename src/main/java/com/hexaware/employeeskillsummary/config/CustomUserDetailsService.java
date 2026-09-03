package com.hexaware.employeeskillsummary.config;

import com.hexaware.employeeskillsummary.entity.User;
import com.hexaware.employeeskillsummary.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Clean the email entered in the login form
        String cleanEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(cleanEmail);

        if (user == null) {
            throw new UsernameNotFoundException(
                    "User not found with email: " + cleanEmail
            );
        }

        // Get role from database
        String role = user.getRole();

        // If no role exists, make the account USER
        if (role == null || role.trim().isEmpty()) {
            role = "USER";
        }

        role = role.trim().toUpperCase();

        // Make sure Spring Security gets ROLE_ADMIN / ROLE_USER
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        System.out.println("-----------------------------------------");
        System.out.println("LOGIN EMAIL : " + user.getEmail());
        System.out.println("DATABASE ROLE : " + user.getRole());
        System.out.println("SPRING ROLE : " + role);
        System.out.println("-----------------------------------------");

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority(role)
                )
        );
    }
}