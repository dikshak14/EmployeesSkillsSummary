package com.hexaware.employeeskillsummary.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =================================================
                // CORS
                // =================================================

                .cors(cors -> {})


                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf -> csrf.disable())


                // =================================================
                // SESSION
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // OPTIONS / CORS PREFLIGHT
                        // -------------------------------------------------

                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // -------------------------------------------------
                        // PUBLIC PAGES
                        // -------------------------------------------------

                        .requestMatchers(
                                "/",
                                "/login",
                                "/register",
                                "/register/**",
                                "/error",
                                "/favicon.ico",
                                "/css/**",
                                "/js/**",
                                "/images/**"
                        ).permitAll()


                        // =================================================
                        // CURRENT LOGGED-IN EMPLOYEE
                        // =================================================
                        //
                        // IMPORTANT:
                        // This MUST come BEFORE:
                        //
                        // /api/employees/**
                        //
                        // because normal employees need access to /me.
                        // =================================================

                        .requestMatchers(
                                "/api/employees/me"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )


                        // -------------------------------------------------
                        // ADMIN EMPLOYEE API
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/employees/**"
                        ).hasRole("ADMIN")


                        // -------------------------------------------------
                        // USER MANAGEMENT API
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")


                        // -------------------------------------------------
                        // ADMIN PAGES
                        // -------------------------------------------------

                        .requestMatchers(
                                "/admin/**"
                        ).hasRole("ADMIN")


                        // -------------------------------------------------
                        // EMPLOYEE DASHBOARD
                        // -------------------------------------------------

                        .requestMatchers(
                                "/dashboard/**",
                                "/employee/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )


                        // -------------------------------------------------
                        // EVERYTHING ELSE
                        // -------------------------------------------------

                        .anyRequest().authenticated()
                )


                // =================================================
                // LOGIN
                // =================================================

                .formLogin(form -> form

                        .loginProcessingUrl("/login")

                        .usernameParameter("email")

                        .passwordParameter("password")

                        .successHandler(
                                authenticationSuccessHandler()
                        )

                        .failureHandler(
                                authenticationFailureHandler()
                        )

                        .permitAll()
                )


                // =================================================
                // LOGOUT
                // =================================================

                .logout(logout -> logout

                        .logoutUrl("/logout")

                        .invalidateHttpSession(true)

                        .clearAuthentication(true)

                        .deleteCookies("JSESSIONID")

                        .logoutSuccessHandler(
                                (request, response, authentication) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_OK
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.setCharacterEncoding(
                                            "UTF-8"
                                    );

                                    response.getWriter().write(
                                            "{\"success\":true,\"message\":\"Logged out successfully\"}"
                                    );
                                }
                        )

                        .permitAll()
                );


        return http.build();
    }


    // =========================================================
    // LOGIN SUCCESS
    // =========================================================

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {

        return new AuthenticationSuccessHandler() {

            @Override
            public void onAuthenticationSuccess(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    Authentication authentication)
                    throws IOException, ServletException {

                String role =
                        authentication
                                .getAuthorities()
                                .stream()
                                .findFirst()
                                .map(authority ->
                                        authority.getAuthority()
                                )
                                .orElse("ROLE_USER");


                String email =
                        authentication.getName();


                System.out.println(
                        "======================================"
                );

                System.out.println(
                        "LOGIN SUCCESS"
                );

                System.out.println(
                        "EMAIL : " + email
                );

                System.out.println(
                        "ROLE : " + role
                );

                System.out.println(
                        "======================================"
                );


                response.setStatus(
                        HttpServletResponse.SC_OK
                );

                response.setContentType(
                        "application/json"
                );

                response.setCharacterEncoding(
                        "UTF-8"
                );


                String json =
                        "{"
                                + "\"success\":true,"
                                + "\"message\":\"Login successful\","
                                + "\"email\":\""
                                + escapeJson(email)
                                + "\","
                                + "\"role\":\""
                                + escapeJson(role)
                                + "\""
                                + "}";


                response.getWriter().write(json);
            }
        };
    }


    // =========================================================
    // LOGIN FAILURE
    // =========================================================

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {

        return (request, response, exception) -> {

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "LOGIN FAILED"
            );

            System.out.println(
                    "EMAIL : " +
                            request.getParameter("email")
            );

            System.out.println(
                    "REASON : " +
                            exception.getMessage()
            );

            System.out.println(
                    "======================================"
            );


            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.setCharacterEncoding(
                    "UTF-8"
            );


            response.getWriter().write(
                    "{"
                            + "\"success\":false,"
                            + "\"message\":\"Invalid email or password\""
                            + "}"
            );
        };
    }


    // =========================================================
    // JSON ESCAPE
    // =========================================================

    private String escapeJson(String value) {

        if (value == null) {

            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}