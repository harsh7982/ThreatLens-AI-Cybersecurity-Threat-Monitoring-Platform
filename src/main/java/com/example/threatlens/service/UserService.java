package com.example.threatlens.service;

import com.example.threatlens.model.User;
import com.example.threatlens.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        user.setRole("USER");
        return userRepository.save(user);
    }
}