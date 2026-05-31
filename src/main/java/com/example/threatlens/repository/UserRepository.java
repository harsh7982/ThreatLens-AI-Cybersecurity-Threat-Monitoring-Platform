package com.example.threatlens.repository;

import com.example.threatlens.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}