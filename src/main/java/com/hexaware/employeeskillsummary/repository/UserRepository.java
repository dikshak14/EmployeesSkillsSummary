package com.hexaware.employeeskillsummary.repository;

import com.hexaware.employeeskillsummary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);
}